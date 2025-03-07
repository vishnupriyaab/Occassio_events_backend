import mongoose, { Schema } from "mongoose";
import { IMiscellaneous } from "../interfaces/entities/miscellaneous.entity";

const miscellaneousSchema: Schema = new Schema<IMiscellaneous>(
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

const Miscellaneous = mongoose.model<IMiscellaneous & Document>("Miscellaneous", miscellaneousSchema);
export default Miscellaneous;