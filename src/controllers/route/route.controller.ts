import { Request, Response } from "express";
import slugify from "slugify";

import RouteModel from "../../models/route/route.model";
import StateModel from "../../models/state/state.model";
import CityModel from "../../models/city/city.model";

export const createUpdateRoute = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      from_state_id,
      from_city_id,
      to_state_id,
      to_city_id,
      distance,
      duration = "",
      description = "",
      image = "",
      tags = [],
      sortOrder = 0,
      isPopular = false,
    } = req.body;

    const userId = req.user?._id;

    if (!from_state_id)
      return res.status(400).json({ success: false, message: "From state is required." });

    if (!from_city_id)
      return res.status(400).json({ success: false, message: "From city is required." });

    if (!to_state_id)
      return res.status(400).json({ success: false, message: "To state is required." });

    if (!to_city_id)
      return res.status(400).json({ success: false, message: "To city is required." });

    if (!distance)
      return res.status(400).json({ success: false, message: "Distance is required." });

    if (from_city_id === to_city_id)
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be same.",
      });

    const fromState = await StateModel.findOne({
      _id: from_state_id,
      isDeleted: false,
    });

    if (!fromState)
      return res.status(404).json({
        success: false,
        message: "From state not found.",
      });

    const toState = await StateModel.findOne({
      _id: to_state_id,
      isDeleted: false,
    });

    if (!toState)
      return res.status(404).json({
        success: false,
        message: "To state not found.",
      });

    const fromCity = await CityModel.findOne({
      _id: from_city_id,
      isDeleted: false,
    });

    if (!fromCity)
      return res.status(404).json({
        success: false,
        message: "From city not found.",
      });

    const toCity = await CityModel.findOne({
      _id: to_city_id,
      isDeleted: false,
    });

    if (!toCity)
      return res.status(404).json({
        success: false,
        message: "To city not found.",
      });

    const slug = slugify(
      `${fromCity.name} to ${toCity.name}`,
      {
        lower: true,
        strict: true,
        trim: true,
      }
    );

    if (id) {
      const route = await RouteModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!route)
        return res.status(404).json({
          success: false,
          message: "Route not found.",
        });

      const duplicate = await RouteModel.findOne({
        from_city_id,
        to_city_id,
        isDeleted: false,
        _id: { $ne: id },
      });

      if (duplicate)
        return res.status(400).json({
          success: false,
          message: "Route already exists.",
        });

      route.from_state_id = from_state_id;
      route.from_city_id = from_city_id;
      route.to_state_id = to_state_id;
      route.to_city_id = to_city_id;
      route.slug = slug;
      route.distance = distance;
      route.duration = duration;
      route.description = description;
      route.image = image;
      route.tags = tags;
      route.sortOrder = sortOrder;
      route.isPopular = isPopular;
      route.updated_by = userId;

      await route.save();

      return res.status(200).json({
        success: true,
        message: "Route updated successfully.",
        data: route,
      });
    }

    const duplicate = await RouteModel.findOne({
      from_city_id,
      to_city_id,
      isDeleted: false,
    });

    if (duplicate)
      return res.status(400).json({
        success: false,
        message: "Route already exists.",
      });

    const route = await RouteModel.create({
      from_state_id,
      from_city_id,
      to_state_id,
      to_city_id,
      slug,
      distance,
      duration,
      description,
      image,
      tags,
      sortOrder,
      isPopular,
      created_by: userId,
      updated_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "Route created successfully.",
      data: route,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const getAllRoute = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      from_state_id,
      to_state_id,
      from_city_id,
      to_city_id,
      isActive,
      isDeleted,
    } = req.body;

    const filter: any = {};

    if (from_state_id) filter.from_state_id = from_state_id;
    if (to_state_id) filter.to_state_id = to_state_id;
    if (from_city_id) filter.from_city_id = from_city_id;
    if (to_city_id) filter.to_city_id = to_city_id;

    if (typeof isActive === "boolean") filter.isActive = isActive;
    if (typeof isDeleted === "boolean") filter.isDeleted = isDeleted;

    if (search) {
      filter.slug = {
        $regex: search,
        $options: "i",
      };
    }

    const total = await RouteModel.countDocuments(filter);

    const routes = await RouteModel.find(filter)
      .populate("from_state_id", "name code")
      .populate("to_state_id", "name code")
      .populate("from_city_id", "name")
      .populate("to_city_id", "name")
      .sort({
        sortOrder: 1,
        created_at: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Routes fetched successfully.",
      data: routes,
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



export const getSingleRoute = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Route id is required.",
      });
    }

    const route = await RouteModel.findById(id)
      .populate("from_state_id", "name code")
      .populate("to_state_id", "name code")
      .populate("from_city_id", "name")
      .populate("to_city_id", "name");

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Route fetched successfully.",
      data: route,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const deleteRoute = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const route = await RouteModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    route.isDeleted = true;
    route.updated_by = req.user?._id;

    await route.save();

    return res.status(200).json({
      success: true,
      message: "Route deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const restoreRoute = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const route = await RouteModel.findOne({
      _id: id,
      isDeleted: true,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    route.isDeleted = false;
    route.updated_by = req.user?._id;

    await route.save();

    return res.status(200).json({
      success: true,
      message: "Route restored successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const changeRouteStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, isActive } = req.body;

    const route = await RouteModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    route.isActive = isActive;
    route.updated_by = req.user?._id;

    await route.save();

    return res.status(200).json({
      success: true,
      message: `Route ${
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


export const getRouteDropdown = async (
  req: Request,
  res: Response
) => {
  try {
    const routes = await RouteModel.find({
      isActive: true,
      isDeleted: false,
    })
      .populate("from_city_id", "name")
      .populate("to_city_id", "name")
      .select(
        "_id from_city_id to_city_id slug distance duration"
      )
      .sort({
        sortOrder: 1,
      });

    return res.status(200).json({
      success: true,
      message: "Route dropdown fetched successfully.",
      data: routes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};