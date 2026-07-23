import { Request, Response } from "express";
import slugify from "slugify";
import CityModel from "../../models/city/city.model";
import StateModel from "../../models//state/state.model";

export const createUpdateCity = async (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      state_id,
      description = "",
      image = "",
      isPopular = false,
      sortOrder = 0,
    } = req.body;
    console.log(req.body);

    const userId = req.user?._id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "City name is required.",
      });
    }

    if (!state_id) {
      return res.status(400).json({
        success: false,
        message: "State is required.",
      });
    }

    // Check State Exists
    const state = await StateModel.findOne({
      _id: state_id,
      isDeleted: false,
    });

    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found.",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // ================= UPDATE =================

    if (id) {
      const city = await CityModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!city) {
        return res.status(404).json({
          success: false,
          message: "City not found.",
        });
      }

      const duplicate = await CityModel.findOne({
        slug,
        state_id,
        isDeleted: false,
        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "City already exists.",
        });
      }

      city.name = name;
      city.slug = slug;
      city.state_id = state_id;
      city.description = description;
      city.image = image;
      city.isPopular = isPopular;
      city.sortOrder = sortOrder;
      city.updated_by = userId;

      await city.save();

      return res.status(200).json({
        success: true,
        message: "City updated successfully.",
        data: city,
      });
    }

    // ================= CREATE =================

    const duplicate = await CityModel.findOne({
      slug,
      state_id,
      isDeleted: false,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "City already exists.",
      });
    }

    const city = await CityModel.create({
      name,
      slug,
      state_id,
      description,
      image,
      isPopular,
      sortOrder,
      created_by: userId,
      updated_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "City created successfully.",
      data: city,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getAllCity = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      state_id,
      isActive,
      isDeleted,
    } = req.body;

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};

    if (state_id) {
      filter.state_id = state_id;
    }

    if (typeof isActive === "boolean") {
      filter.isActive = isActive;
    }

    if (typeof isDeleted === "boolean") {
      filter.isDeleted = isDeleted;
    }

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const cities = await CityModel.find(filter)
      .populate("state_id", "name code")
      .sort({
        created_at: -1,
      })
      .skip(skip)
      .limit(Number(limit));

    const total = await CityModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Cities fetched successfully.",
      data: cities,
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

export const getSingleCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "City id is required.",
      });
    }

    const city = await CityModel.findById(id).populate("state_id", "name code");

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City fetched successfully.",
      data: city,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const deleteCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "City id is required.",
      });
    }

    const city = await CityModel.findOneAndUpdate(
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
      },
    );

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City deleted successfully.",
      data: city,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const restoreCity = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const city = await CityModel.findOneAndUpdate(
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
      },
    );

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City restored successfully.",
      data: city,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const changeCityStatus = async (req: Request, res: Response) => {
  try {
    const { id, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "City id is required.",
      });
    }

    const city = await CityModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isActive,
        updated_by: req.user?._id,
      },
      {
        new: true,
      },
    );

    if (!city) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "City status updated successfully.",
      data: city,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getCityDropdown = async (req: Request, res: Response) => {
  try {
    const { state_id } = req.body;

    const filter: any = {
      isActive: true,
      isDeleted: false,
    };

    if (state_id) {
      filter.state_id = state_id;
    }

    const cities = await CityModel.find(filter)
      .select("_id name state_id")
      .sort({
        name: 1,
      });

    return res.status(200).json({
      success: true,
      message: "Cities fetched successfully.",
      data: cities,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
