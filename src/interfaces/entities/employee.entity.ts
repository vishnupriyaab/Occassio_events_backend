export interface IEmployee {
    _id:string;
  name: string;
  email: string;
  phone: string;
  password: string;
  assigned: boolean;
  resetPasswordToken: string;
}

export interface IEmplRegData {
    name: string;
    email: string;
    phone: string;
  }
  