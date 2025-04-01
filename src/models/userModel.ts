import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "../interfaces/entities/user.entity";

const userSchema: Schema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    entryId:{
      type: String,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    phone: {
      type: Number,
      required: true,
    },
    isVerified:{
      type: Boolean,
      default: false,
    },
    isBlocked:{
      type: Boolean,
      default: false,
    },
    assignedEmployee: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Employee',
      default: null
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser & Document>("User", userSchema);
export default User;
