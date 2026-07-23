import { Request, Response } from "express";
import slugify from "slugify";
import StateModel from "../../models/state/state.model";

export const createUpdateState = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      name,
      code = "",
      description = "",
    } = req.body;

    const userId = req.user?._id;

    if (!name) {
      return res.status(400).json({
        error: "State name is required.",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    if (id) {
      const state = await StateModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!state) {
        return res.status(404).json({
          error: "State not found.",
        });
      }

      const duplicate = await StateModel.findOne({
        slug,
        isDeleted: false,
        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          error: "State already exists.",
        });
      }

      state.name = name;
      state.slug = slug;
      state.code = code;
      state.description = description;
      state.updated_by = userId;

      await state.save();

      return res.status(200).json({
        success: true,
        message: "State updated successfully.",
        data: state,
      });
    }

    const duplicate = await StateModel.findOne({
      slug,
      isDeleted: false,
    });

    if (duplicate) {
      return res.status(400).json({
        error: "State already exists.",
      });
    }

    const newState = await StateModel.create({
      name,
      slug,
      code,
      description,
      created_by: userId,
      updated_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "State created successfully.",
      data: newState,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: "Internal server error.",
    });

  }
};
export const getAllState = async (
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

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {};

    // Optional Filters
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
          code: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const states = await StateModel.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await StateModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "States fetched successfully.",
      data: states,
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

export const getSingleState = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "State id is required.",
      });
    }

    const state = await StateModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!state) {
      return res.status(404).json({
        error: "State not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "State fetched successfully.",
      data: state,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export const deleteState = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const userId = req.user?._id;

    if (!id) {
      return res.status(400).json({
        error: "State id is required.",
      });
    }

    const state = await StateModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
        updated_by: userId,
      },
      {
        new: true,
      }
    );

    if (!state) {
      return res.status(404).json({
        error: "State not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "State deleted successfully.",
      data: state,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export const restoreState = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const userId = req.user?._id;

    if (!id) {
      return res.status(400).json({
        error: "State id is required.",
      });
    }

    const state = await StateModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: true,
      },
      {
        isDeleted: false,
        updated_by: userId,
      },
      {
        new: true,
      }
    );

    if (!state) {
      return res.status(404).json({
        error: "State not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "State restored successfully.",
      data: state,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};


export const changeStateStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id, isActive } = req.body;

    const userId = req.user?._id;

    if (!id) {
      return res.status(400).json({
        error: "State id is required.",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        error: "isActive is required.",
      });
    }

    const state = await StateModel.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isActive,
        updated_by: userId,
      },
      {
        new: true,
      }
    );

    if (!state) {
      return res.status(404).json({
        error: "State not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `State ${
        isActive ? "activated" : "deactivated"
      } successfully.`,
      data: state,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};


export const getStateDropdown = async (
  req: Request,
  res: Response
) => {
  try {
    const states = await StateModel.find({
      isDeleted: false,
      isActive: true,
    })
      .select("_id name code")
      .sort({
        name: 1,
      });

    return res.status(200).json({
      success: true,
      message: "State dropdown fetched successfully.",
      data: states,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};