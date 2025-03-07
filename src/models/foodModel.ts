import mongoose, { Schema } from "mongoose";
import { IFood } from "../interfaces/entities/food.entity";

const foodSchema: Schema = new Schema<IFood>(
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

const Food = mongoose.model<IFood & Document>("Food", foodSchema);
export default Food;
