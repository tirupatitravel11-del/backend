import { Request, Response } from "express";
import mongoose from "mongoose";
import slugify from "slugify";

import CabPageModel from "../../models/cabPage/cabPage.model";
import HotelModel from "../../models/hotel/hotel.model";

export const createUpdateHotel = async (req: Request, res: Response) => {
  try {
    const {
      id,
      name,
      cab_page_id,
      address,
      description,
      categories,
      amenities,
      images,
      starRating,
      priceFrom,
      priceTo,
      rooms,
      contactNumber,
      email,
      website,
      priority,
      isPopular,
      isActive,
    } = req.body;

    // ---------------- Validation ----------------
    const finalCategories =
      typeof categories === "string"
        ? categories.split(",").map((v: string) => v.trim())
        : categories || [];

    const finalAmenities =
      typeof amenities === "string"
        ? amenities.split(",").map((v: string) => v.trim())
        : amenities || [];

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
        message: "City not found.",
      });
    }

    if (!Array.isArray(finalCategories)) {
      return res.status(400).json({
        success: false,
        message: "Categories must be an array.",
      });
    }
    if (!Array.isArray(finalAmenities)) {
      return res.status(400).json({
        success: false,
        message: "Amenities must be an array.",
      });
    }

    if (images && !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array.",
      });
    }

    if (priceFrom && priceTo && Number(priceFrom) > Number(priceTo)) {
      return res.status(400).json({
        success: false,
        message: "Price From cannot be greater than Price To.",
      });
    }
    if (rooms && !Array.isArray(rooms)) {
      return res.status(400).json({
        success: false,
        message: "Rooms must be an array.",
      });
    }

    if (rooms?.length) {
      for (const room of rooms) {
        if (!room.roomName?.trim()) {
          return res.status(400).json({
            success: false,
            message: "Room name is required.",
          });
        }

        if (
          room.price === undefined ||
          room.price === null ||
          isNaN(Number(room.price))
        ) {
          return res.status(400).json({
            success: false,
            message: "Room price is invalid.",
          });
        }
        if (!room.image?.trim()) {
  return res.status(400).json({
    success: false,
    message: "Room image is required.",
  });
}
      }
    }
    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // ---------------- Duplicate Check ----------------

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

    const payload = {
      name: name.trim(),

      slug,

      cab_page_id,

      address,

      description,

      categories: finalCategories,

      amenities: finalAmenities,

      images: images || [],
      rooms: rooms || [],
      starRating: starRating || 0,

      priceFrom: priceFrom || 0,

      priceTo: priceTo || 0,

      contactNumber,

      email,

      website,

      priority: priority || 1,

      isPopular: isPopular ?? false,

      isActive: isActive ?? true,
    };
    // -------------------------
    // Update Hotel
    // -------------------------

    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid hotel id.",
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
        },
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

export const getHotelsByCity = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
console.log(slug, "check")
    // Find City
    const cabPage = await CabPageModel.findOne({
      slug,
      isDeleted: false,
      isActive: true,
    });

    if (!cabPage) {
      return res.status(404).json({
        success: false,
        message: "City not found.",
      });
    }

    // Find Hotels
    const hotels = await HotelModel.find({
      cab_page_id: cabPage._id,
      isDeleted: false,
      isActive: true,
    }).sort({
      priority: 1,
      isPopular: -1,
      name: 1,
    });

    return res.status(200).json({
      success: true,
      city: cabPage.cityName,
      hotels,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
