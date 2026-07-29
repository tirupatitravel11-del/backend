import { Request, Response } from "express";
import NearbyCityModel from "../../models/nearbycity/nearbycity.model";
import RouteModel from "../../models/route/route.model";

export const createUpdateNearbyCity = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      route_id,
      cities = [],
    } = req.body;

    const userId = req.user?._id;

    if (!route_id) {
      return res.status(400).json({
        success: false,
        message: "Route is required.",
      });
    }

    if (!Array.isArray(cities) || cities.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one nearby city is required.",
      });
    }

    // Remove duplicate & empty cities
    const formattedCities = [
      ...new Set(
        cities
          .map((city: string) => city.trim())
          .filter((city: string) => city)
      ),
    ];

    // Check Route Exists
    const route = await RouteModel.findOne({
      _id: route_id,
      isDeleted: false,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    // ================= UPDATE =================

    if (id) {
      const nearbyCity = await NearbyCityModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!nearbyCity) {
        return res.status(404).json({
          success: false,
          message: "Nearby city not found.",
        });
      }

      const duplicate = await NearbyCityModel.findOne({
        route_id,
        isDeleted: false,
        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Nearby cities already exist for this route.",
        });
      }

      nearbyCity.route_id = route_id;
      nearbyCity.cities = formattedCities;
      nearbyCity.updated_by = userId;

      await nearbyCity.save();

      return res.status(200).json({
        success: true,
        message: "Nearby cities updated successfully.",
        data: nearbyCity,
      });
    }

    // ================= CREATE =================

    const duplicate = await NearbyCityModel.findOne({
      route_id,
      isDeleted: false,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Nearby cities already exist for this route.",
      });
    }

    const nearbyCity = await NearbyCityModel.create({
      route_id,
      cities: formattedCities,
      created_by: userId,
      updated_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Nearby cities created successfully.",
      data: nearbyCity,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getAllNearbyCity = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      route_id,
      isActive,
      isDeleted,
    } = req.body;

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};

    if (route_id) {
      filter.route_id = route_id;
    }

    if (typeof isActive === "boolean") {
      filter.isActive = isActive;
    }

    if (typeof isDeleted === "boolean") {
      filter.isDeleted = isDeleted;
    }

    if (search) {
      filter.cities = {
        $regex: search,
        $options: "i",
      };
    }

    const nearbyCities = await NearbyCityModel.find(filter)
      .populate({
        path: "route_id",
        select: "from_city_id to_city_id distance duration",
        populate: [
          {
            path: "from_city_id",
            select: "name",
          },
          {
            path: "to_city_id",
            select: "name",
          },
        ],
      })
      .sort({
        created_at: -1,
      })
      .skip(skip)
      .limit(Number(limit));

    const total = await NearbyCityModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Nearby cities fetched successfully.",
      data: nearbyCities,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getSingleNearbyCity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Nearby city id is required.",
      });
    }

    const nearbyCity = await NearbyCityModel.findById(id)
      .populate({
        path: "route_id",
        select: "from_city_id to_city_id distance duration",
        populate: [
          {
            path: "from_city_id",
            select: "name",
          },
          {
            path: "to_city_id",
            select: "name",
          },
        ],
      });

    if (!nearbyCity) {
      return res.status(404).json({
        success: false,
        message: "Nearby city not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nearby city fetched successfully.",
      data: nearbyCity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const deleteNearbyCity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Nearby city id is required.",
      });
    }

    const nearbyCity = await NearbyCityModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        updated_by: req.user?._id,
      },
      {
        new: true,
      }
    );

    if (!nearbyCity) {
      return res.status(404).json({
        success: false,
        message: "Nearby city not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nearby city deleted successfully.",
      data: nearbyCity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const restoreNearbyCity = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const nearbyCity = await NearbyCityModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: true,
      },
      {
        isDeleted: false,
        updated_by: req.user?._id,
      },
      {
        new: true,
      }
    );

    if (!nearbyCity) {
      return res.status(404).json({
        success: false,
        message: "Nearby city not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nearby city restored successfully.",
      data: nearbyCity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const changeNearbyCityStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Nearby city id is required.",
      });
    }

    const nearbyCity = await NearbyCityModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isActive,
        updated_by: req.user?._id,
      },
      {
        new: true,
      }
    );

    if (!nearbyCity) {
      return res.status(404).json({
        success: false,
        message: "Nearby city not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nearby city status updated successfully.",
      data: nearbyCity,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getNearbyCityDropdown = async (
  req: Request,
  res: Response
) => {
  try {
    const nearbyCities = await NearbyCityModel.find({
      isActive: true,
      isDeleted: false,
    })
      .select("_id route_id")
      .populate({
        path: "route_id",
        select: "from_city_id to_city_id",
        populate: [
          {
            path: "from_city_id",
            select: "name",
          },
          {
            path: "to_city_id",
            select: "name",
          },
        ],
      })
      .sort({
        created_at: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Nearby cities fetched successfully.",
      data: nearbyCities,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};