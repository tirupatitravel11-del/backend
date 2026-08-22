import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";

import PackageHubModel from "../../models/packagehub/packagehub.model";
import CabPageModel from "../../models/cabPage/cabPage.model";

export const createUpdatePackage = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      id,
      cab_page_id,
      title,
      shortDescription,
      description,
      featuredImage,
      gallery,
      days,
      nights,
      startingPrice,
      vehiclePricing,
      tags,
      highlights,
      inclusions,
      exclusions,
      itinerary,
      isFeatured,
      isPopular,
      status,
    } = req.body;

    // =====================================
    // Basic Validation
    // =====================================

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Package title is required.",
      });
    }

    if (!cab_page_id) {
      return res.status(400).json({
        success: false,
        message: "City is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(cab_page_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid city.",
      });
    }

    // =====================================
    // Check City
    // =====================================

    const cabPage = await CabPageModel.findOne({
      _id: cab_page_id,
      isDeleted: false,
    });

    if (!cabPage) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    // =====================================
    // Days / Nights
    // =====================================

    const finalDays = Number(days);

    const finalNights = Number(nights);

    if (!finalDays || finalDays < 1) {
      return res.status(400).json({
        success: false,
        message: "Days must be at least 1.",
      });
    }

    if (isNaN(finalNights) || finalNights < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid nights.",
      });
    }

    // =====================================
    // Starting Price
    // =====================================

    const finalStartingPrice =
      startingPrice !== undefined &&
      startingPrice !== ""
        ? Number(startingPrice)
        : 0;

    if (
      isNaN(finalStartingPrice) ||
      finalStartingPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid starting price.",
      });
    }

    // =====================================
    // Arrays
    // =====================================

    const finalGallery = Array.isArray(gallery)
      ? gallery
      : [];

    const finalTags = Array.isArray(tags)
      ? tags
      : [];

    const finalHighlights = Array.isArray(highlights)
      ? highlights
      : [];

    const finalInclusions = Array.isArray(inclusions)
      ? inclusions
      : [];

    const finalExclusions = Array.isArray(exclusions)
      ? exclusions
      : [];

    const finalVehiclePricing =
      Array.isArray(vehiclePricing)
        ? vehiclePricing
        : [];

    const finalItinerary =
      Array.isArray(itinerary)
        ? itinerary
        : [];

    // =====================================
    // Vehicle Pricing Validation
    // =====================================

    for (const vehicle of finalVehiclePricing) {
      if (!vehicle?.vehicleType?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Vehicle type is required.",
        });
      }

      if (
        vehicle.price === undefined ||
        vehicle.price === null ||
        vehicle.price === "" ||
        isNaN(Number(vehicle.price))
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${vehicle.vehicleType}.`,
        });
      }
    }

    // =====================================
    // Itinerary Validation
    // =====================================

    for (const item of finalItinerary) {
      if (
        item.day === undefined ||
        item.day === null
      ) {
        return res.status(400).json({
          success: false,
          message: "Itinerary day is required.",
        });
      }

      if (!item.title?.trim()) {
        return res.status(400).json({
          success: false,
          message: `Itinerary title is required for Day ${item.day}.`,
        });
      }

      if (!Array.isArray(item.activities)) {
        return res.status(400).json({
          success: false,
          message: `Activities must be an array for Day ${item.day}.`,
        });
      }
    }

    // =====================================
    // Generate Slug
    // =====================================

    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    });

    // =====================================
    // Duplicate Slug Check
    // =====================================

    const duplicate = await PackageHubModel.findOne({
      slug,
      isDeleted: false,

      ...(id
        ? {
            _id: {
              $ne: id,
            },
          }
        : {}),
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Package with this title already exists.",
      });
    }

    // =====================================
    // Payload
    // =====================================

    const payload = {
      title: title.trim(),

      slug,

      cab_page_id,

      shortDescription:
        shortDescription?.trim() || "",

      description:
        description?.trim() || "",

      featuredImage:
        featuredImage || "",

      gallery:
        finalGallery,

      days:
        finalDays,

      nights:
        finalNights,

      startingPrice:
        finalStartingPrice,

      vehiclePricing:
        finalVehiclePricing.map((vehicle: any) => ({
          vehicleType:
            vehicle.vehicleType.trim(),

          price:
            Number(vehicle.price),
        })),

      tags:
        finalTags,

      highlights:
        finalHighlights,

      inclusions:
        finalInclusions,

      exclusions:
        finalExclusions,

      itinerary:
        finalItinerary.map((item: any) => ({
          day: Number(item.day),

          title:
            item.title?.trim() || "",

          activities:
            Array.isArray(item.activities)
              ? item.activities
                  .map((activity: any) =>
                    String(activity).trim(),
                  )
                  .filter(Boolean)
              : [],
        })),

      isFeatured:
        isFeatured ?? false,

      isPopular:
        isPopular ?? false,

      status:
        status ?? true,
    };

    // =====================================
    // UPDATE
    // =====================================

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid package id.",
        });
      }

      const existingPackage =
        await PackageHubModel.findOne({
          _id: id,
          isDeleted: false,
        });

      if (!existingPackage) {
        return res.status(404).json({
          success: false,
          message: "Package not found.",
        });
      }

      const updatedPackage =
        await PackageHubModel.findByIdAndUpdate(
          id,
          {
            ...payload,

            updated_by:
              req.user?._id,
          },
          {
            new: true,
            runValidators: true,
          },
        );

      return res.status(200).json({
        success: true,
        message: "Package updated successfully.",
        data: updatedPackage,
      });
    }

    // =====================================
    // CREATE
    // =====================================

    const createdPackage =
      await PackageHubModel.create({
        ...payload,

        created_by:
          req.user?._id,
      });

    return res.status(201).json({
      success: true,
      message: "Package created successfully.",
      data: createdPackage,
    });
  } catch (error: any) {
    console.error(
      "createUpdatePackage error:",
      error,
    );

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Package with this slug already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error.",
    });
  }
};

export const getPackagesByCity = async (
  req: Request,
  res: Response,
) => {
  try {
    const { slug } = req.params;
console.log(slug, "sdf")
    // =========================
    // PAGINATION
    // =========================

    const page = Math.max(
      Number(req.query.page) || 1,
      1,
    );

    const limit = 9;

    const skip = (page - 1) * limit;

    // =========================
    // FIND CITY
    // =========================

    const cabPage = await CabPageModel.findOne({
      slug,
      isDeleted: false,
      isActive: true,
    }).select("_id cityName slug");

    if (!cabPage) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    // =========================
    // FIND PACKAGES
    // =========================

    const packages = await PackageHubModel.find({
      cab_page_id: cabPage._id,
      isDeleted: false,
      status: true,
    })
      .sort({
        isFeatured: -1,
        isPopular: -1,
        startingPrice: 1,
        title: 1,
      })
      .skip(skip)
      .limit(limit)
      .populate(
        "cab_page_id",
        "cityName slug",
      )
      .lean();

    // =========================
    // TOTAL COUNT
    // =========================

    const totalPackages =
      await PackageHubModel.countDocuments({
        cab_page_id: cabPage._id,
        isDeleted: false,
        status: true,
      });

    const totalPages = Math.ceil(
      totalPackages / limit,
    );

    // =========================
    // RESPONSE
    // =========================

    return res.status(200).json({
      success: true,

      city: {
        _id: cabPage._id,
        cityName: cabPage.cityName,
        slug: cabPage.slug,
      },

      data: packages,

      pagination: {
        currentPage: page,
        limit,
        totalPackages,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    });
  } catch (error: any) {
    console.error(
      "Get Packages By City Error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error.",
    });
  }
};
export const getSinglePackage = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;

    console.log("🔥 SINGLE PACKAGE SLUG:", slug);

    // Pehle sirf slug se check karo
    const packageData = await PackageHubModel.findOne({
      slug: slug,
    });

    console.log("🔥 PACKAGE FROM DB:", packageData);

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
        slug: slug,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Package fetched successfully",
      data: packageData,
    });
  } catch (error) {
    console.error("❌ GET SINGLE PACKAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: null,
    });
  }
};