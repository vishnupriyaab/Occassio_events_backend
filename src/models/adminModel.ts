import mongoose, { Document, Schema } from "mongoose";
import { IAdmin } from "../interfaces/entities/admin.entity";

const adminSchema: Schema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin & Document>("Admin", adminSchema);

export default Admin;