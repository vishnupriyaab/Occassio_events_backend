import mongoose, { Schema } from "mongoose";
import { IPhoto } from "../interfaces/entities/photo.entity";

const photoSchema: Schema = new Schema<IPhoto>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    estimatedCost: {
      max: {
        type: Number,
        required: true,
      },
      min: {
        type: Number,
        required: true,
      },
    },
    list: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Photo = mongoose.model<IPhoto & Document>("Photo", photoSchema);
export default Photo;
