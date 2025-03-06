import mongoose, { Schema } from "mongoose";
import { IVenue } from "../interfaces/entities/venue.entity";

const venueSchema: Schema = new Schema<IVenue>(
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

const Venue = mongoose.model<IVenue & Document>("Venue", venueSchema);
export default Venue;
