import mongoose, { Schema } from "mongoose";
import { ISound } from "../interfaces/entities/sound.entity";

const photoSchema: Schema = new Schema<ISound>(
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

const Sound = mongoose.model<ISound & Document>("Photo", photoSchema);
export default Sound;
