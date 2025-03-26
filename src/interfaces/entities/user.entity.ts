import mongoose from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  password?: string;
  email: string;
  phone: number;
  assignedEmployee?: mongoose.Types.ObjectId;
  resetPasswordToken?: string;
}

export interface IUserReg{
    name:string;
    email:string;
    phone: number;
}