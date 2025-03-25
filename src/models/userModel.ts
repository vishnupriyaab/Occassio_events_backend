import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/entities/user.entity";

const userSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model<IUser & Document>("User", userSchema);
export default User;