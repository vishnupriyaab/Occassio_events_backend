import { NextFunction, Request, Response } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { HttpStatusCode } from "../constant/httpStatusCodes";
import User from "../models/userModel";
import Employee from "../models/employeeModel";
import { AppError } from "./errorHandling";

export interface AuthenticatedRequest extends Request {
  id?: string;
}

export default class AuthMiddleware {
  constructor(role: string, private _jwtService: IJWTService) {
    this.role = role;
  }
  role: string;

  //role-based Authentication
  async authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.cookies, "0000000000000000000000");
      const token = req.cookies.access_token;
      console.log(token, "qwertyuiodfghjk");
      if (!token) {
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ message: "Unauthorized: No token provided" });
        return;
      }
      const decode = this._jwtService.verifyAccessToken(token);
      console.log(decode.role, "decode111111111111111111111111111111111111", this.role);
      if (decode.role !== this.role) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          message:
            "Unauthorized: You do not have permission to access this resource",
        });
        return;
      }

      if (decode.role === "employee") {
        const employee = await Employee.findById(decode.id);
        if (!employee) {
          throw new AppError(
            "Employee not found",
            HttpStatusCode.NOT_FOUND,
            "EmployeeNotFound"
          );
        }
        if (employee.isBlocked) {
          throw new AppError(
            "Admin has blocked you, please contact our team!",
            HttpStatusCode.FORBIDDEN,
            "AdminIsBlocked",
            { role: "employee" }
          );
        }
      } else if (decode.role === "user") {
        const user = await User.findById(decode.id);
        if (!user) {
          throw new AppError(
            "User not found",
            HttpStatusCode.NOT_FOUND,
            "UserNotFound"
          );
        }
        if (user.isBlocked) {
          throw new AppError(
            "Admin has blocked you, please contact our team!",
            HttpStatusCode.FORBIDDEN,
            "AdminIsBlocked",
            { role: "user" }
          );
        }
      }

      req.id = decode.id;
      next();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.status).json({
          message: error.message,
          metadata: error.metadata || {},
        });
      } else {
        res
          .status(HttpStatusCode.FORBIDDEN)
          .json({ message: "Forbidden: Invalid token" });
      }
      return;
    }
  }
}
