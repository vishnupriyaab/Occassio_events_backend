export interface IEmployee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  assigned: boolean;
  resetPasswordToken: string;
  isVerified: boolean
  isBlocked: boolean
}

export interface IEmplRegData {
  _id?: string;
  name: string;
  email: string;
  phone: string;
}
