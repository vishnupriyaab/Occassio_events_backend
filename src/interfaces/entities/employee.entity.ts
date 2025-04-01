import { Types } from "mongoose";

export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  assignedUsers: Types.ObjectId[]
  assignedUsersCount:number
  resetPasswordToken: string;
  isVerified: boolean;
  isBlocked: boolean;
  imageUrl: string;
}

export interface IEmplRegData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
}
