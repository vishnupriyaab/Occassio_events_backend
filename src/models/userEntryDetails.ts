import mongoose, { Schema } from "mongoose";

const userEntrySchema: Schema = new Schema<IAdmin>(
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

const Admin = mongoose.model<IAdmin & Document>("UserEntry", userEntrySchema);

export default Admin;
