import mongoose, { Schema } from "mongoose";
import { ISound } from "../interfaces/entities/sound.entity";

const soundSchema: Schema = new Schema<ISound>(
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

const Sound = mongoose.model<ISound & Document>("Sound", soundSchema);
export default Sound;
