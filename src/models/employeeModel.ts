import mongoose, { Document, Schema } from "mongoose";
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
  assigned:{
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
}, {timestamps: true});

const Employee = mongoose.model<IEmployee & Document>("Employee", employeeSchema);
export default Employee;