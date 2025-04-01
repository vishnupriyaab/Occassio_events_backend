import mongoose, { Document, Schema, Types } from "mongoose";
import { IEmployee } from "../interfaces/entities/employee.entity";

const employeeSchema: Schema = new Schema<IEmployee>({
  name: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  phone:{
    type:String,
    required: true,
  },
  password:{
    type: String,
  },
  isBlocked:{
    type: Boolean,
    default: false,
  },
  imageUrl:{
    type: String,
  },
  isVerified:{
    type: Boolean,
    default: false,
  },
  assignedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: [],
  }],
  assignedUsersCount:{
    type: Number,
    default: 0
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
}, {timestamps: true});

const Employee = mongoose.model<IEmployee & Document>("Employee", employeeSchema);
export default Employee;