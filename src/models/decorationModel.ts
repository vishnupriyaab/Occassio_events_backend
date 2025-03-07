import mongoose, { Schema } from "mongoose";
import { IDecoration } from "../interfaces/entities/decoration.entity";

const decorSchema: Schema = new Schema<IDecoration>(
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

const Decoration = mongoose.model<IDecoration & Document>("Decoration", decorSchema);
export default Decoration;
