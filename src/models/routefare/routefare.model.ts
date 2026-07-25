import mongoose, { Schema, Types } from "mongoose";

export interface IRouteFare {
  route_id: Types.ObjectId;

  vehicle_id: Types.ObjectId;

  tripType:
    | "ONEWAY"
    | "ROUNDTRIP"
    | "LOCAL"
    | "AIRPORT"
    | "RENTAL";

  baseFare: number;

  minimumKm: number;

  pricePerKm: number;

  extraKmCharge: number;

  driverAllowance: number;

  tollCharge: number;

  parkingCharge: number;

  nightCharge: number;

  waitingCharge: number;

  isActive: boolean;

  isDeleted: boolean;

  created_by?: Types.ObjectId;

  updated_by?: Types.ObjectId;

  created_at?: Date;

  updated_at?: Date;
}

const routeFareSchema = new Schema<IRouteFare>(
  {
    route_id: {
      type: Schema.Types.ObjectId,
      ref: "routes",
      required: true,
    },

    vehicle_id: {
      type: Schema.Types.ObjectId,
      ref: "vehicles",
      required: true,
    },

    tripType: {
      type: String,
      enum: [
        "ONEWAY",
        "ROUNDTRIP",
        "LOCAL",
        "AIRPORT",
        "RENTAL",
      ],
      required: true,
    },

    baseFare: {
      type: Number,
      required: true,
      default: 0,
    },

    minimumKm: {
      type: Number,
      default: 0,
    },

    pricePerKm: {
      type: Number,
      default: 0,
    },

    extraKmCharge: {
      type: Number,
      default: 0,
    },

    driverAllowance: {
      type: Number,
      default: 0,
    },

    tollCharge: {
      type: Number,
      default: 0,
    },

    parkingCharge: {
      type: Number,
      default: 0,
    },

    nightCharge: {
      type: Number,
      default: 0,
    },

    waitingCharge: {
      type: Number,
      default: 0,
    },

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
      default: null,
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

routeFareSchema.index(
  {
    route_id: 1,
    vehicle_id: 1,
    tripType: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model<IRouteFare>(
  "routefares",
  routeFareSchema
);