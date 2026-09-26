import { Request, Response } from "express";

interface Coordinate {
  lat: number;
  lng: number;
}

export const calculateDistance = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      from,
      to,
    }: {
      from: Coordinate;
      to: Coordinate;
    } = req.body;

    if (
      typeof from?.lat !== "number" ||
      typeof from?.lng !== "number" ||
      typeof to?.lat !== "number" ||
      typeof to?.lng !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid pickup and drop coordinates are required",
      });
    }

    const osrmUrl =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${from.lng},${from.lat};` +
      `${to.lng},${to.lat}` +
      `?overview=false`;

    const response = await fetch(osrmUrl);

    if (!response.ok) {
      throw new Error(
        `OSRM HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    if (
      data.code !== "Ok" ||
      !data.routes ||
      data.routes.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Route not found",
      });
    }

    const route = data.routes[0];

    const distanceKm =
      route.distance / 1000;

    const durationMinutes =
      route.duration / 60;

    return res.status(200).json({
      success: true,

      distanceKm: Number(
        distanceKm.toFixed(2)
      ),

      distanceMeter: Math.round(
        route.distance
      ),

      durationMinutes: Math.round(
        durationMinutes
      ),
    });
  } catch (error) {
    console.error(
      "Calculate distance error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to calculate distance",
    });
  }
};