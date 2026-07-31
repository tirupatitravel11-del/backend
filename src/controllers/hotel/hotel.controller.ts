import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";

import HotelModel from "../../models/hotel/hotel.model";
import CabPageModel from "../../models/cabPage/cabPage.model";

export const createUpdateHotel = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      name,
      cab_page_id,

      categories,

      address,
      description,

      images,

      starRating,

      priceFrom,
      priceTo,

      amenities,

      contactNumber,
      website,
      email,

      checkInTime,
      checkOutTime,

      latitude,
      longitude,

      seo,

      isPopular,
      sortOrder,

      isActive,
    } = req.body;

    // -------------------------
    // Validation
    // -------------------------

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Hotel name is required.",
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

    const cabPage = await CabPageModel.findOne({
      _id: cab_page_id,
      isDeleted: false,
    });

    if (!cabPage) {
      return res.status(404).json({
        success: false,
        message: "Cab page not found.",
      });
    }

    if (categories && !Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: "Categories must be an array.",
      });
    }

    if (images && !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array.",
      });
    }

    if (amenities && !Array.isArray(amenities)) {
      return res.status(400).json({
        success: false,
        message: "Amenities must be an array.",
      });
    }

    if (
      priceFrom &&
      priceTo &&
      Number(priceFrom) > Number(priceTo)
    ) {
      return res.status(400).json({
        success: false,
        message: "Price From cannot be greater than Price To.",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // -------------------------
    // Duplicate Check
    // -------------------------

    const duplicate = await HotelModel.findOne({
      cab_page_id,
      slug,
      isDeleted: false,
      ...(id && {
        _id: {
          $ne: id,
        },
      }),
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Hotel already exists in this city.",
      });
    }

    // -------------------------
    // Payload
    // -------------------------

    const payload = {
      name: name.trim(),

      slug,

      cab_page_id,

      categories: categories || [],

      address,

      description,

      images: images || [],

      starRating: starRating || 0,

      priceFrom,

      priceTo,

      amenities: amenities || [],

      contactNumber,

      website,

      email,

      checkInTime,

      checkOutTime,

      latitude,

      longitude,

      seo: seo || {},

      isPopular: isPopular ?? false,

      sortOrder: sortOrder || 0,

      isActive: isActive ?? true,
    };
        // -------------------------
    // Update Hotel
    // -------------------------

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Hotel ID.",
        });
      }

      const hotel = await HotelModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found.",
        });
      }

      const updatedHotel = await HotelModel.findByIdAndUpdate(
        id,
        {
          ...payload,
          updated_by: req.user?._id,
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Hotel updated successfully.",
        data: updatedHotel,
      });
    }

    // -------------------------
    // Create Hotel
    // -------------------------

    const createdHotel = await HotelModel.create({
      ...payload,
      created_by: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Hotel created successfully.",
      data: createdHotel,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error.",
    });
  }
};