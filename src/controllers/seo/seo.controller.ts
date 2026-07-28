import { Request, Response } from "express";
import RouteModel from "../../models/route/route.model";
import RouteSeoModel from "../../models/seo/seo.model";

export const createUpdateRouteSeo = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      route_id,
      metaTitle,
      metaDescription,
      metaKeywords = [],
      canonicalUrl = "",
      ogTitle = "",
      ogDescription = "",
      ogImage = "",
      schemaMarkup = "",
      robots = "index,follow",
    } = req.body;

    const userId = req.user?._id;

    if (!route_id) {
      return res.status(400).json({
        success: false,
        message: "Route is required.",
      });
    }

    if (!metaTitle) {
      return res.status(400).json({
        success: false,
        message: "Meta title is required.",
      });
    }

    if (!metaDescription) {
      return res.status(400).json({
        success: false,
        message: "Meta description is required.",
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

    // ================= UPDATE =================

    if (id) {
      const seo = await RouteSeoModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!seo) {
        return res.status(404).json({
          success: false,
          message: "SEO not found.",
        });
      }

      const duplicate = await RouteSeoModel.findOne({
        route_id,
        isDeleted: false,
        _id: {
          $ne: id,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: "SEO already exists for this route.",
        });
      }

      seo.route_id = route_id;
      seo.metaTitle = metaTitle;
      seo.metaDescription = metaDescription;
      seo.metaKeywords = metaKeywords;
      seo.canonicalUrl = canonicalUrl;
      seo.ogTitle = ogTitle;
      seo.ogDescription = ogDescription;
      seo.ogImage = ogImage;
      seo.schemaMarkup = schemaMarkup;
      seo.robots = robots;
      seo.updated_by = userId;

      await seo.save();

      return res.status(200).json({
        success: true,
        message: "SEO updated successfully.",
        data: seo,
      });
    }

    // ================= CREATE =================

    const duplicate = await RouteSeoModel.findOne({
      route_id,
      isDeleted: false,
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "SEO already exists for this route.",
      });
    }

    const seo = await RouteSeoModel.create({
      route_id,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage,
      schemaMarkup,
      robots,
      created_by: userId,
      updated_by: userId,
    });

    return res.status(201).json({
      success: true,
      message: "SEO created successfully.",
      data: seo,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


export const getAllRouteSeo = async (
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
      filter.$or = [
        {
          metaTitle: {
            $regex: search,
            $options: "i",
          },
        },
        {
          metaDescription: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const seo = await RouteSeoModel.find(filter)
      .populate({
        path: "route_id",
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

    const total = await RouteSeoModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "SEO fetched successfully.",
      data: seo,
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

export const getSingleRouteSeo = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "SEO id is required.",
      });
    }

    const seo = await RouteSeoModel.findById(id)
      .populate({
        path: "route_id",
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

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SEO fetched successfully.",
      data: seo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  }
};


export const deleteRouteSeo = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "SEO id is required.",
      });
    }

    const seo = await RouteSeoModel.findOneAndUpdate(
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

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SEO deleted successfully.",
      data: seo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  }
};

export const restoreRouteSeo = async (
  req: Request,
  res: Response
) => {
  try {

    const { id } = req.body;

    const seo = await RouteSeoModel.findOneAndUpdate(
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

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SEO restored successfully.",
      data: seo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  }
};


export const changeRouteSeoStatus = async (
  req: Request,
  res: Response
) => {
  try {

    const { id, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "SEO id is required.",
      });
    }

    const seo = await RouteSeoModel.findOneAndUpdate(
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

    if (!seo) {
      return res.status(404).json({
        success: false,
        message: "SEO not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "SEO status updated successfully.",
      data: seo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  }
};

export const getRouteSeoDropdown = async (
  req: Request,
  res: Response
) => {
  try {

    const seo = await RouteSeoModel.find({
      isActive: true,
      isDeleted: false,
    })
      .select("_id route_id metaTitle")
      .populate({
        path: "route_id",
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
        metaTitle: 1,
      });

    return res.status(200).json({
      success: true,
      message: "SEO fetched successfully.",
      data: seo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });

  }
};