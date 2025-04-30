import mongoose, { Document, Schema } from "mongoose";
import IEstimation from "../interfaces/entities/estimation.entity";

const estimationSchema: Schema = new Schema<IEstimation>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EntryRegForm",
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    venue: {
      details: { type: String },
      noOf: { type: Number },
      cost: { type: Number },
    },
    seating: {
      details: { type: String },
      noOf: { type: Number },
      cost: { type: Number },
    },
    food: {
      welcomeDrink: {
        details: { type: String },
        noOf: { type: Number },
        cost: { type: Number },
      },
      mainCourse: {
        details: { type: String },
        noOf: { type: Number },
        cost: { type: Number },
      },
      dessert: {
        details: { type: String },
        noOf: { type: Number },
        cost: { type: Number },
      },
    },
    soundSystem: {
      details: { type: String },
      noOf: { type: Number },
      cost: { type: Number },
    },
    PhotoAndVideo: {
      details: { type: String },
      noOf: { type: Number },
      cost: { type: Number },
    },
    Decoration: {
      details: { type: String },
      noOf: { type: Number },
      cost: { type: Number },
    },
    grandTotal: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Estimation = mongoose.model<IEstimation & Document>(
  "Estimation",
  estimationSchema
);
export default Estimation;
