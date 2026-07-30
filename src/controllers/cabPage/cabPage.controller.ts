import { Request, Response } from "express";
import slugify from "slugify";
import CabPageModel from "../../models/cabPage/cabPage.model";

export const createUpdateCabPage = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      id,
      cityName,
      startingFare,
      overview,
      famousFor,
      localCuisine,
      bestToVisit,
      idealFor,
      nearestAirport,
      nearestRailway,
      popularPlaces,
      hotels,
      restaurants,
      fareHeading,
      seo,
      fareDetails,
      faqs,
      routes,
    //   title,
    //   badgeText,
    //   heroHeading,
    //   heroDescription,
      // sectionHeading,
      // sectionDescription,
      // fromCity,
      // toCity,
      // localFareDetail,
      // startingFareDetail,
      // oneWayFare,
      // routeCondition,
      // distance,
      // travelTime,
      // faqHeading,
      // faqDescription,
      // routeHeading,
      // routeDescription,
      // vehicles,
      // displayOrder,
      isActive,
    } = req.body;
    //     if (!title) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Title is required.",
    //   });
    // }

    // if (!fromCity) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "From City is required.",
    //   });
    // }

    // if (!toCity) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "To City is required.",
    //   });
    // }

    // ================= Array Validation =================

// if (vehicles && !Array.isArray(vehicles)) {
//   return res.status(400).json({
//     success: false,
//     message: "Vehicles must be an array.",
//   });
// }

if (fareDetails && !Array.isArray(fareDetails)) {
  return res.status(400).json({
    success: false,
    message: "Fare Details must be an array.",
  });
}

if (faqs && !Array.isArray(faqs)) {
  return res.status(400).json({
    success: false,
    message: "FAQs must be an array.",
  });
}

if (routes && !Array.isArray(routes)) {
  return res.status(400).json({
    success: false,
    message: "Routes must be an array.",
  });
}

// ================= Vehicle Validation =================

// if (vehicles?.length) {
//   for (const vehicle of vehicles) {
//     if (!vehicle.name) {
//       return res.status(400).json({
//         success: false,
//         message: "Vehicle name is required.",
//       });
//     }
//   }
// }
if (fareDetails?.length) {
  for (const fare of fareDetails) {
    if (!fare.vehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle is required in fare details.",
      });
    }
  }
}
if (faqs?.length) {
  for (const faq of faqs) {
    if (!faq.question || !faq.answer) {
      return res.status(400).json({
        success: false,
        message: "FAQ question and answer are required.",
      });
    }
  }
}
if (routes?.length) {
  for (const route of routes) {
    if (!route.toCity) {
      return res.status(400).json({
        success: false,
        message: "To City are required in routes.",
      });
    }
  }
}
     const slug = slugify(cityName, {
  lower: true,
  strict: true,
  trim: true,
});
        const duplicate = await CabPageModel.findOne({
      slug,
      isDeleted: false,
      ...(id ? { _id: { $ne: id } } : {}),
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Cab Page already exists.",
      });
    }
        const payload = {
      cityName,
      startingFare,
      overview,
      famousFor: famousFor || [],
      localCuisine: localCuisine || [],
      bestToVisit,
      idealFor: idealFor || [],
      nearestAirport,
      nearestRailway,
      popularPlaces: popularPlaces || [],
      hotels: hotels || [],
      restaurants: restaurants || [],
      fareHeading,
      seo: seo || {},
      fareDetails: fareDetails || [],
      faqs: faqs || [],
      routes: routes || [],
      isActive: isActive ?? true,
      slug,
      // title: title.trim(),
      // fromCity,
      // toCity,
      // badgeText,
      // heroHeading,
      // heroDescription,
      // sectionHeading,
      // sectionDescription,
      // localFareDetail,
      // startingFareDetail,
      // oneWayFare,
      // routeCondition,
      // distance,
      // travelTime,
      // faqHeading,
      // faqDescription,
      // routeHeading,
      // routeDescription,
      // vehicles: vehicles || [],
      // displayOrder: displayOrder || 1,
    };

        if (id) {
      const cabPage = await CabPageModel.findById(id);

      if (!cabPage) {
        return res.status(404).json({
          success: false,
          message: "Cab Page not found.",
        });
      }

      await CabPageModel.findByIdAndUpdate(
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
        message: "Cab Page updated successfully.",
      });
    }

        await CabPageModel.create({
      ...payload,
      created_by: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Cab Page created successfully.",
    });
      } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};



export const getCabPageBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required.",
      });
    }

    const cabPage = await CabPageModel.findOne({
      slug,
      isActive: true,
      isDeleted: false,
    });

    if (!cabPage) {
      return res.status(404).json({
        success: false,
        message: "Cab Page not found.",
      });
    }
        return res.status(200).json({
      success: true,
      message: "Cab Page fetched successfully.",

      data: {
        id: cabPage._id,
        slug: cabPage.slug,
        cityName: cabPage.cityName,
        startingFare: cabPage.startingFare,
        // title: cabPage.title,
        // fromCity: cabPage.fromCity,
        // toCity: cabPage.toCity,
        // displayOrder: cabPage.displayOrder,
        // hero: {
        //   badgeText: cabPage.badgeText,
        //   heroHeading: cabPage.heroHeading,
        //   heroDescription: cabPage.heroDescription,
        // },
        // cityIntroduction: {
        //   sectionHeading: cabPage.sectionHeading,
        //   sectionDescription: cabPage.sectionDescription,
        // },

        aboutLocation: {
          overview: cabPage.overview,
          famousFor: cabPage.famousFor,
          localCuisine: cabPage.localCuisine,
          bestToVisit: cabPage.bestToVisit,
          idealFor: cabPage.idealFor,
          nearestAirport: cabPage.nearestAirport,
          nearestRailway: cabPage.nearestRailway,
        },

        routeInformation: {
          popularPlaces: cabPage.popularPlaces,
          hotels: cabPage.hotels,
          restaurants: cabPage.restaurants,
          // localFareDetail: cabPage.localFareDetail,
          // startingFareDetail:
          //   cabPage.startingFareDetail,
          // oneWayFare: cabPage.oneWayFare,
          // distance: cabPage.distance,
          // travelTime: cabPage.travelTime,
          // routeCondition: cabPage.routeCondition,
        },

        fareHeading: cabPage.fareHeading,
        fareDetails: cabPage.fareDetails,
        faqs: cabPage.faqs,
        routes: cabPage.routes,
        seo: cabPage.seo,
        // faqHeading: cabPage.faqHeading,
        // faqDescription: cabPage.faqDescription,
        // routeHeading: cabPage.routeHeading,
        // routeDescription: cabPage.routeDescription,
        // vehicles: cabPage.vehicles,
      },
    });
      } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};


export const getCabPageData = async (
  req: Request,
  res: Response
) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({
        success: false,
        message: "City Name is required.",
      });
    }

    const cabPage = await CabPageModel.findOne({
      cityName: {
        $regex: `^${cityName}$`,
        $options: "i",
      },
      isActive: true,
      isDeleted: false,
    });

    if (!cabPage) {
      return res.status(404).json({
        success: false,
        message: "Cab Page not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cab Page fetched successfully.",
      data: cabPage,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};