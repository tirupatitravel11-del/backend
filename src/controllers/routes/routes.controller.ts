import { Request, Response } from "express";
import Routes from "../../models/routes/routes.model.js";

// ===============================
// CREATE ROUTE
// ===============================

const createRoutes = async (req: Request, res: Response) => {
  try {
    const {
      fromCity,
      toCity,
      distance,
      duration,
    } = req.body;

    if (!fromCity || !toCity || !distance || !duration) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const slug = `${fromCity}-${toCity}`
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");

    const existingRoute = await Routes.findOne({
      slug,
    });

    if (existingRoute) {
      return res.status(409).json({
        success: false,
        message: "Route already exists",
      });
    }

    const route = await Routes.create({
      fromCity,
      toCity,
      slug,
      distance,
      duration,
    });

    return res.status(201).json({
      success: true,
      message: "Route created successfully",
      route,
    });
  } catch (error) {
    console.error("Create route error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// GET ALL ROUTES
// ===============================

const getAllRoutess = async (req: Request, res: Response) => {
  console.log("🔥 NEW ROUTE API HIT");
  
  try {
    const routes = await Routes.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      routes,
    });
  } catch (error) {
    console.error("Get routes error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// GET SINGLE ROUTE
// ===============================

const getSingleRoutes = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const route = await Routes.findOne({
      slug,
      active: true,
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.status(200).json({
      success: true,
      route,
    });
  } catch (error) {
    console.error("Get single route error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// UPDATE ROUTE
// ===============================

const updateRoutes = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const route = await Routes.findOneAndUpdate(
      { slug },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Route updated successfully",
      route,
    });
  } catch (error) {
    console.error("Update route error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// DELETE ROUTE
// ===============================

const deleteRoutes = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (typeof slug !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid slug",
      });
    }

    const route = await Routes.findOneAndDelete({
      slug: slug.toLowerCase().trim(),
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Route deleted successfully",
      route,
    });
  } catch (error) {
    console.error("Delete route error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// ===============================
// bulk create ROUTE
// ===============================

const bulkCreateRoutes = async (req: Request, res: Response) => {
  try {
    const { routes } = req.body;
console.log("1")
    if (!Array.isArray(routes) || routes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Routes array is required",
      });
    }
console.log("11")

    const formattedRoutes = routes.map((route) => ({
      fromCity: route.fromCity,
      toCity: route.toCity,

      slug: `${route.fromCity}-${route.toCity}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-"),

      distance: route.distance,
      duration: route.duration,
    }));
console.log("111")

    const createdRoutes = await Routes.insertMany(
      formattedRoutes,
      {
        ordered: false,
      }
    );
console.log("1111")

    return res.status(201).json({
      success: true,
      message: `${createdRoutes.length} routes created successfully`,
      routes: createdRoutes,
    });
console.log("11111")

  } catch (error) {
    console.error("Bulk route error:", error);
console.log("66")

    return res.status(500).json({
      success: false,
      message: "Bulk route creation failed",
    });
  }
};
// ===============================
// EXPORTS
// ===============================

export {
  createRoutes,
  getAllRoutess,
  getSingleRoutes,
  updateRoutes,
  deleteRoutes,
  bulkCreateRoutes
};