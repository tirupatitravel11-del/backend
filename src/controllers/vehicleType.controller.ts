import { Request, Response } from "express";
import slugify from "slugify";
import CabTypeModel from "../models/vehicleType.model";

export const createUpdateCabType = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      name,
      description = "",
      image = "",
      tags = [],
      sortOrder = 0,
      isPopular = false,
    } = req.body;

    const userId = req.user?._id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Cab type name is required.",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // ================= UPDATE =================

    if (id) {
      const cabType = await CabTypeModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!cabType) {
        return res.status(404).json({
          success: false,
          message: "Cab type not found.",
        });
      }

      const duplicate = await CabTypeModel.findOne({
        slug,
        isDeleted: false,
        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "Cab type already exists.",
        });
      }

      cabType.name = name;
      cabType.slug = slug;
      cabType.description = description;
      cabType.image = image;
      cabType.tags = tags;
      cabType.sortOrder = sortOrder;
      cabType.isPopular = isPopular;
      cabType.updated_by = userId;

      await cabType.save();

      return res.status(200).json({
        success: true,
        message: "Cab type updated successfully.",
        data: cabType,
      });
    }

    // ================= CREATE =================

    const duplicate = await CabTypeModel.findOne({
      slug,
      isDeleted: false,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Cab type already exists.",
      });
    }

    const cabType = await CabTypeModel.create({
      name,
      slug,
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
      message: "Cab type created successfully.",
      data: cabType,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getAllCabType = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      isActive,
      isDeleted,
    } = req.body;

    const filter: any = {};

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
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const total = await CabTypeModel.countDocuments(filter);

    const cabTypes = await CabTypeModel.find(filter)
      .sort({
        sortOrder: 1,
        created_at: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Cab type list fetched successfully.",
      data: cabTypes,
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

export const getSingleCabType = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cab type id is required.",
      });
    }

    const cabType = await CabTypeModel.findById(id);

    if (!cabType) {
      return res.status(404).json({
        success: false,
        message: "Cab type not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cab type fetched successfully.",
      data: cabType,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const deleteCabType = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cab type id is required.",
      });
    }

    const cabType = await CabTypeModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!cabType) {
      return res.status(404).json({
        success: false,
        message: "Cab type not found.",
      });
    }

    cabType.isDeleted = true;
    cabType.updated_by = req.user?._id;

    await cabType.save();

    return res.status(200).json({
      success: true,
      message: "Cab type deleted successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const restoreCabType = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cab type id is required.",
      });
    }

    const cabType = await CabTypeModel.findOne({
      _id: id,
      isDeleted: true,
    });

    if (!cabType) {
      return res.status(404).json({
        success: false,
        message: "Cab type not found.",
      });
    }

    cabType.isDeleted = false;
    cabType.updated_by = req.user?._id;

    await cabType.save();

    return res.status(200).json({
      success: true,
      message: "Cab type restored successfully.",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const changeCabTypeStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Cab type id is required.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be boolean.",
      });
    }

    const cabType = await CabTypeModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!cabType) {
      return res.status(404).json({
        success: false,
        message: "Cab type not found.",
      });
    }

    cabType.isActive = isActive;
    cabType.updated_by = req.user?._id;

    await cabType.save();

    return res.status(200).json({
      success: true,
      message: `Cab type ${
        isActive ? "activated" : "deactivated"
      } successfully.`,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const getCabTypeDropdown = async (
  req: Request,
  res: Response
) => {
  try {
    const cabTypes = await CabTypeModel.find({
      isActive: true,
      isDeleted: false,
    })
      .select("_id name slug")
      .sort({
        sortOrder: 1,
        name: 1,
      });

    return res.status(200).json({
      success: true,
      message: "Cab type dropdown fetched successfully.",
      data: cabTypes,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};