import mongoose, { Schema, Types } from "mongoose";

export interface ICabPage {
  title: string;
  slug: string;

  cityName: string;
  fromCity: string;
  toCity: string;

  startingFare: number;

  displayOrder: number;

  badgeText: string;
  heroHeading: string;
  heroDescription: string;

  sectionHeading: string;
  sectionDescription: string;

  overview: string;

  famousFor: string[];
  localCuisine: string[];
  bestToVisit: string;
  idealFor: string[];

  nearestAirport: string;
  nearestRailway: string;

  localFareDetail: string;
  startingFareDetail: string;
  oneWayFare: string;

  routeCondition: string;
  distance: string;
  travelTime: string;

  popularPlaces: string[];
  hotels: string[];
  restaurants: string[];

  fareHeading: string;

  faqHeading: string;
  faqDescription: string;

  routeHeading: string;
  routeDescription: string;

  seo: ISeo;

  vehicles: IVehicle[];

  fareDetails: IFareDetail[];

  faqs: IFaq[];

  routes: IRoute[];

  isActive: boolean;
  isDeleted: boolean;

  created_by?: Types.ObjectId;
  updated_by?: Types.ObjectId;

  created_at?: Date;
  updated_at?: Date;
}

interface ISeo {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  robots: string;
  schemaMarkup: string;
}

interface IVehicle {
  category: string;
  brand: string;
  name: string;
  seats: number;
  luggage: number;
  acType: string;
  fuelType: string;
  image: string;
  features: string;
  slug: string;
}

interface IFareDetail {
  vehicle: string;
  localFare: number;
  roundTripFare: number;
  oneWayFare: number;
}

interface IFaq {
  question: string;
  answer: string;
  displayOrder: number;
  status: boolean;
}

interface IRoute {
  fromCity: string;
  toCity: string;
  startingFare: number;
  slug: string;
  displayOrder: number;
  status: boolean;
}

/* ------------------------------------------------ */

const vehicleSchema = new Schema<IVehicle>(
  {
    category: String,
    brand: String,
    name: String,
    seats: Number,
    luggage: Number,
    acType: String,
    fuelType: String,
    image: String,
    features: String,
    slug: String,
  },
  {
    _id: false,
  }
);

const fareDetailSchema = new Schema<IFareDetail>(
  {
    // vehicle: String,
    localFare: Number,
    roundTripFare: Number,
    oneWayFare: Number,
  },
  {
    _id: false,
  }
);

const faqSchema = new Schema<IFaq>(
  {
    question: String,
    answer: String,
    displayOrder: Number,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const routeSchema = new Schema<IRoute>(
  {
    fromCity: String,
    toCity: String,
    startingFare: Number,
    slug: String,
    displayOrder: Number,
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

const seoSchema = new Schema<ISeo>(
  {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    robots: {
      type: String,
      default: "index,follow",
    },
    schemaMarkup: String,
  },
  {
    _id: false,
  }
);

const cabPageSchema = new Schema<ICabPage>(
  {
    // title: {
    //   type: String,
    //   trim: true,
    //   required: true,
    // },

    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    cityName: String,

    fromCity: {
      type: String,
      required: true,
    },

    toCity: {
      type: String,
      required: true,
    },

    startingFare: Number,

    displayOrder: {
      type: Number,
      default: 1,
    },

    badgeText: String,

    heroHeading: String,

    heroDescription: String,

    sectionHeading: String,

    sectionDescription: String,

    overview: String,

    famousFor: [String],

    localCuisine: [String],

    bestToVisit: String,

    idealFor: [String],

    nearestAirport: String,

    nearestRailway: String,

    localFareDetail: String,

    startingFareDetail: String,

    oneWayFare: String,

    routeCondition: String,

    distance: String,

    travelTime: String,

    popularPlaces: [String],

    hotels: [String],

    restaurants: [String],

    fareHeading: String,

    faqHeading: String,

    faqDescription: String,

    routeHeading: String,

    routeDescription: String,

    seo: seoSchema,

    vehicles: [vehicleSchema],

    fareDetails: [fareDetailSchema],

    faqs: [faqSchema],

    routes: [routeSchema],

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);



export default mongoose.model<ICabPage>(
  "cab_pages",
  cabPageSchema
);