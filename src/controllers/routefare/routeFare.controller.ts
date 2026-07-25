import { Request, Response } from "express";
import RouteFareModel from "../../models/routefare/routefare.model";
import RouteModel from "../../models/route/route.model";
import VehicleModel from "../../models/vehicle.model";

export const createUpdateRouteFare = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      route_id,
      vehicle_id,
      tripType,
      baseFare,
      minimumKm = 0,
      pricePerKm = 0,
      extraKmCharge = 0,
      driverAllowance = 0,
      tollCharge = 0,
      parkingCharge = 0,
      nightCharge = 0,
      waitingCharge = 0,
    } = req.body;

    const userId = req.user?._id;

    if (!route_id) {
      return res.status(400).json({
        success: false,
        message: "Route is required.",
      });
    }

    if (!vehicle_id) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is required.",
      });
    }

    if (!tripType) {
      return res.status(400).json({
        success: false,
        message: "Trip type is required.",
      });
    }

    if (baseFare === undefined || baseFare === null) {
      return res.status(400).json({
        success: false,
        message: "Base fare is required.",
      });
    }

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

    const vehicle = await VehicleModel.findOne({
      _id: vehicle_id,
      isDeleted: false,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    if (id) {
      const fare = await RouteFareModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!fare) {
        return res.status(404).json({
          success: false,
          message: "Route fare not found.",
        });
      }

      const duplicate = await RouteFareModel.findOne({
        route_id,
        vehicle_id,
        tripType,
        isDeleted: false,
        _id: { $ne: id },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Fare already exists.",
        });
      }

      fare.route_id = route_id;
      fare.vehicle_id = vehicle_id;
      fare.tripType = tripType;
      fare.baseFare = baseFare;
      fare.minimumKm = minimumKm;
      fare.pricePerKm = pricePerKm;
      fare.extraKmCharge = extraKmCharge;
      fare.driverAllowance = driverAllowance;
      fare.tollCharge = tollCharge;
      fare.parkingCharge = parkingCharge;
      fare.nightCharge = nightCharge;
      fare.waitingCharge = waitingCharge;
      fare.updated_by = userId;

      await fare.save();

      return res.status(200).json({
        success: true,
        message: "Route fare updated successfully.",
        data: fare,
      });
    }

    const duplicate = await RouteFareModel.findOne({
      route_id,
      vehicle_id,
      tripType,
      isDeleted: false,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Fare already exists.",
      });
    }

    const fare = await RouteFareModel.create({
      route_id,
      vehicle_id,
      tripType,
      baseFare,
      minimumKm,
      pricePerKm,
      extraKmCharge,
      driverAllowance,
      tollCharge,
      parkingCharge,
      nightCharge,
      waitingCharge,
      created_by: userId,
      updated_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Route fare created successfully.",
      data: fare,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const getAllRouteFare = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      route_id,
      vehicle_id,
      tripType,
      isActive,
      isDeleted,
    } = req.body;

    const filter: any = {};

    if (route_id) filter.route_id = route_id;
    if (vehicle_id) filter.vehicle_id = vehicle_id;
    if (tripType) filter.tripType = tripType;

    if (typeof isActive === "boolean")
      filter.isActive = isActive;

    if (typeof isDeleted === "boolean")
      filter.isDeleted = isDeleted;

    const total = await RouteFareModel.countDocuments(filter);

    const fares = await RouteFareModel.find(filter)
      .populate({
        path: "route_id",
        populate: [
          { path: "from_city_id", select: "name" },
          { path: "to_city_id", select: "name" },
        ],
      })
      .populate("vehicle_id", "name brand")
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Route fares fetched successfully.",
      data: fares,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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

export const getSingleRouteFare = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const fare = await RouteFareModel.findById(id)
      .populate({
        path: "route_id",
        populate: [
          { path: "from_city_id", select: "name" },
          { path: "to_city_id", select: "name" },
        ],
      })
      .populate("vehicle_id", "name brand");

    if (!fare) {
      return res.status(404).json({
        success: false,
        message: "Route fare not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Route fare fetched successfully.",
      data: fare,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const deleteRouteFare = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const fare = await RouteFareModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!fare) {
      return res.status(404).json({
        success: false,
        message: "Route fare not found.",
      });
    }

    fare.isDeleted = true;
    fare.updated_by = req.user?._id;

    await fare.save();

    return res.status(200).json({
      success: true,
      message: "Route fare deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const restoreRouteFare = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const fare = await RouteFareModel.findOne({
      _id: id,
      isDeleted: true,
    });

    if (!fare) {
      return res.status(404).json({
        success: false,
        message: "Route fare not found.",
      });
    }

    fare.isDeleted = false;
    fare.updated_by = req.user?._id;

    await fare.save();

    return res.status(200).json({
      success: true,
      message: "Route fare restored successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const changeRouteFareStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, isActive } = req.body;

    const fare = await RouteFareModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!fare) {
      return res.status(404).json({
        success: false,
        message: "Route fare not found.",
      });
    }

    fare.isActive = isActive;
    fare.updated_by = req.user?._id;

    await fare.save();

    return res.status(200).json({
      success: true,
      message: `Route fare ${
        isActive ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getRouteFareDropdown = async (
  req: Request,
  res: Response
) => {
  try {
    const fares = await RouteFareModel.find({
      isActive: true,
      isDeleted: false,
    })
      .populate("vehicle_id", "name")
      .populate("route_id", "slug")
      .select("_id route_id vehicle_id tripType baseFare")
      .sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      message: "Route fare dropdown fetched successfully.",
      data: fares,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
