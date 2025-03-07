import mongoose, { Schema } from "mongoose";
import { ISeating } from "../interfaces/entities/seating.entity";

const seatingSchema: Schema = new Schema<ISeating>(
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

const Seating = mongoose.model<ISeating & Document>("Seating", seatingSchema);
export default Seating;
