// controllers/web/search.controller.ts

import { Request, Response } from "express";
import CityModel from "../../models/city/city.model";
import RouteModel from "../../models/route/route.model";
import RouteFareModel from "../../models/routefare/routefare.model";

export const searchRoute = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "From and To city are required.",
      });
    }

    const fromCity = await CityModel.findOne({
      slug: from.toLowerCase(),
      isActive: true,
      isDeleted: false,
    });

    if (!fromCity) {
      return res.status(404).json({
        success: false,
        message: "From city not found.",
      });
    }

    const toCity = await CityModel.findOne({
      slug: to.toLowerCase(),
      isActive: true,
      isDeleted: false,
    });

    if (!toCity) {
      return res.status(404).json({
        success: false,
        message: "Destination city not found.",
      });
    }

    const route = await RouteModel.findOne({
      from_city_id: fromCity._id,
      to_city_id: toCity._id,
      isActive: true,
      isDeleted: false,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    return res.json({
      success: true,
      slug: route.slug,
      url: `/taxi/${route.slug}`,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// controllers/web/page.controller.ts
export const getRoutePage = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const route = await RouteModel.findOne({
      slug,
      isActive: true,
      isDeleted: false,
    })
      .populate("from_city_id")
      .populate("to_city_id");

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found.",
      });
    }

    const fares = await RouteFareModel.find({
      route_id: route._id,
      isActive: true,
      isDeleted: false,
    }).populate({
      path: "vehicle_id",
      populate: {
        path: "cab_type_id",
      },
    });

    const vehicles = fares.map((fare: any) => ({
      id: fare.vehicle_id._id,
      name: fare.vehicle_id.name,
      brand: fare.vehicle_id.brand,
      cabType: fare.vehicle_id.cab_type_id?.name,
      image: fare.vehicle_id.image,
      passengerCapacity: fare.vehicle_id.passengerCapacity,
      luggageCapacity: fare.vehicle_id.luggageCapacity,
      fuelType: fare.vehicle_id.fuelType,
      transmission: fare.vehicle_id.transmission,
      airCondition: fare.vehicle_id.airCondition,

      tripType: fare.tripType,
      baseFare: fare.baseFare,
      minimumKm: fare.minimumKm,
      pricePerKm: fare.pricePerKm,
      extraKmCharge: fare.extraKmCharge,
      driverAllowance: fare.driverAllowance,
      tollCharge: fare.tollCharge,
      parkingCharge: fare.parkingCharge,
      waitingCharge: fare.waitingCharge,
      nightCharge: fare.nightCharge,
    }));

    return res.json({
      success: true,

      route: {
        id: route._id,
        slug: route.slug,
        distance: route.distance,
        duration: route.duration,
        fromCity: (route as any).from_city_id.name,
        toCity: (route as any).to_city_id.name,
      },

      vehicles,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};