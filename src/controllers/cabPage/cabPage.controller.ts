import { Request, Response } from "express";
import slugify from "slugify";
import CabPageModel from "../../models/cabPage/cabPage.model";

export const createUpdateCabPage = async (req: Request, res: Response) => {
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
        },
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

export const getCabPageBySlug = async (req: Request, res: Response) => {
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

export const getCabPageData = async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
console.log(req.body,"fhjdhfdh");

    if (!cityName) {
      return res.status(400).json({
        success: false,
        message: "City Name is required.",
      });
    }

    const cabPage = await CabPageModel.findOne({
      slug: {
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

export const createBulkCabPages = async (req: Request, res: Response) => {
  try {
    const { pages } = req.body;

    if (!pages || !Array.isArray(pages)) {
      return res.status(400).json({
        success: false,
        message: "Pages must be an array.",
      });
    }

    if (!pages.length) {
      return res.status(400).json({
        success: false,
        message: "No pages found.",
      });
    }

    const createdPages = [];
    const errors = [];

    for (let i = 0; i < pages.length; i++) {
      try {
        const page = pages[i];

        const {
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
          isActive,
        } = page;

        if (!cityName) {
          errors.push({
            row: i + 1,
            cityName: "",
            message: "City name is required.",
          });
          continue;
        }

        if (fareDetails && !Array.isArray(fareDetails)) {
          errors.push({
            row: i + 1,
            cityName,
            message: "Fare Details must be an array.",
          });
          continue;
        }

        if (faqs && !Array.isArray(faqs)) {
          errors.push({
            row: i + 1,
            cityName,
            message: "FAQs must be an array.",
          });
          continue;
        }

        if (routes && !Array.isArray(routes)) {
          errors.push({
            row: i + 1,
            cityName,
            message: "Routes must be an array.",
          });
          continue;
        }

        if (fareDetails?.length) {
          let invalidFare = false;

          for (const fare of fareDetails) {
            if (!fare.vehicle) {
              errors.push({
                row: i + 1,
                cityName,
                message: "Vehicle is required in fare details.",
              });

              invalidFare = true;
              break;
            }
          }

          if (invalidFare) continue;
        }

        if (faqs?.length) {
          let invalidFaq = false;

          for (const faq of faqs) {
            if (!faq.question || !faq.answer) {
              errors.push({
                row: i + 1,
                cityName,
                message: "FAQ question and answer are required.",
              });

              invalidFaq = true;
              break;
            }
          }

          if (invalidFaq) continue;
        }

        if (routes?.length) {
          let invalidRoute = false;

          for (const route of routes) {
            if (!route.toCity) {
              errors.push({
                row: i + 1,
                cityName,
                message: "To City is required in routes.",
              });

              invalidRoute = true;
              break;
            }
          }

          if (invalidRoute) continue;
        }

        const slug = slugify(cityName, {
          lower: true,
          strict: true,
          trim: true,
        });

        const duplicate = await CabPageModel.findOne({
          slug,
          isDeleted: false,
        });

        if (duplicate) {
          errors.push({
            row: i + 1,
            cityName,
            message: "Cab Page already exists.",
          });

          continue;
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
        };

        const createdPage = await CabPageModel.create({
          ...payload,
          created_by: req.user?._id,
        });

        createdPages.push(createdPage);
      } catch (error: any) {
        errors.push({
          row: i + 1,
          cityName: pages[i]?.cityName || "",
          message: error.message || "Failed to create page.",
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `${createdPages.length} cab page${
        createdPages.length > 1 ? "s" : ""
      } created successfully.`,
      createdCount: createdPages.length,
      failedCount: errors.length,
      createdPages,
      errors,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Bulk upload failed.",
    });
  }
};

export const getCabPageDropdown = async (
  req: Request,
  res: Response
) => {
    console.log("Dropdown API Hit");
  try {
    const {
      search = "",
      page = 1,
      limit = 5,
    } = req.body;

    const query: any = {
      isDeleted: false,
      isActive: true,
    };

    if (search) {
      query.cityName = {
        $regex: search,
        $options: "i",
      };
    }

    const currentPage = Number(page);
    const pageSize = Number(limit);

    const total = await CabPageModel.countDocuments(query);

    const cities = await CabPageModel.find(
      query,
      {
        cityName: 1,
        slug: 1,
      }
    )
      .sort({ cityName: 1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      total,
      page: currentPage,
      limit: pageSize,
      data: cities,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};