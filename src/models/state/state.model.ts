import mongoose, { Schema } from "mongoose";

const stateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    code: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: Number,
      default: 13,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const StateModel = mongoose.model("states", stateSchema);

export default StateModel;