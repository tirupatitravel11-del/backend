import { Request, Response } from "express";
import BookingCab from "../../models/bookingcab/bookingcab.model";

// export const createBookingcab = async (req: Request, res: Response) => {
//   try {
//     const {
//       name,
//       phoneNo,
//       serviceType,
//       pickup,
//       drop,
//       trip,
//       date,
//       from,
//       to,
//       fare,
//       vehicle,
//     } = req.body;
// console.log(req.body)
//     // Required fields validation
//     if (
//         !name||
//       !phoneNo ||
//       !serviceType ||
//       !pickup ||
//       !drop ||
//       !date ||
//       !from ||
//       !to ||
//       fare === undefined ||
//       !vehicle
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All booking fields are required",
//       });
//     }

//     // Phone validation
//     if (!/^[6-9]\d{9}$/.test(phoneNo)) {
//       return res.status(400).json({
//         success: false,
//         message: "Please enter a valid 10 digit mobile number",
//       });
//     }

//     // Service type validation
//     const allowedServices = ["cab", "tour", "hotel", "boat"];

//     if (!allowedServices.includes(serviceType)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid service type",
//       });
//     }

//     // Pickup and drop same nahi hone chahiye
//     if (
//       pickup.trim().toLowerCase() === drop.trim().toLowerCase()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Pickup and drop location cannot be the same",
//       });
//     }

//     // Fare validation
//     if (Number(fare) < 0 || Number.isNaN(Number(fare))) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid fare",
//       });
//     }

//     // Booking create
//     const booking = await BookingCab.create({
//         name:name.trim(),
//       phoneNo: phoneNo.trim(),
//       serviceType,
//       pickup: pickup.trim(),
//       drop: drop.trim(),
//       trip: trip || "one-way",
//       date,
//       from: from.trim(),
//       to: to.trim(),
//       fare: Number(fare),
//       vehicle: vehicle.trim(),
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Booking created successfully",
//       data: booking,
//     });
//   } catch (error:any) {
//     console.error("Create booking error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


export const createBookingcab = async (req: Request, res: Response) => {
  try {
    const {
      name,
      phoneNo,
      serviceType,
      pickup,
      drop,
      trip,
      date,
      from,
      to,
      fare,
      vehicle,
    } = req.body;

    console.log(req.body);

    // Required fields validation
    if (
      !name ||
      !phoneNo ||
      !serviceType ||
      !pickup ||
      !drop ||
      !date ||
      !vehicle
    ) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    // Phone validation
    if (!/^[6-9]\d{9}$/.test(phoneNo)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10 digit mobile number",
      });
    }

    // Service type validation
    const allowedServices = ["cab", "tour", "hotel", "boat"];

    if (!allowedServices.includes(serviceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
    }

    // Pickup and drop same nahi hone chahiye
    if (
      pickup.trim().toLowerCase() === drop.trim().toLowerCase()
    ) {
      return res.status(400).json({
        success: false,
        message: "Pickup and drop location cannot be the same",
      });
    }

    // Fare validation - sirf tab check hoga jab fare diya gaya ho
    if (
      fare !== undefined &&
      fare !== null &&
      fare !== "" &&
      (Number(fare) < 0 || Number.isNaN(Number(fare)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid fare",
      });
    }

    // Booking create
    const booking = await BookingCab.create({
      name: name.trim(),
      phoneNo: phoneNo.trim(),
      serviceType,
      pickup: pickup.trim(),
      drop: drop.trim(),
      trip: trip || "one-way",
      date,

      // Optional fields
      from: from ? from.trim() : undefined,
      to: to ? to.trim() : undefined,
      fare:
        fare !== undefined && fare !== null && fare !== ""
          ? Number(fare)
          : undefined,

      vehicle: vehicle.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    console.error("Create booking error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getCabBookings = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      order = {},
    } = req.body;

    const skip = (page - 1) * limit;

    const { col = "createdAt", order: sortOrder = -1 } = order;

    const sortObj: any = {};
    sortObj[col] = sortOrder;

    let filter: any = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { serviceType: { $regex: search, $options: "i" } },
      ];
    }

    const data = await BookingCab.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const count = await BookingCab.countDocuments(filter);

    return res.status(200).json({
      message: "Cab bookings fetched successfully",
      data: data,
      count: count,
    });
  } catch (error) {
    console.error("Error fetching cab bookings:", error);

    return res.status(500).json({
      message: "Error fetching cab bookings",
    });
  }
};