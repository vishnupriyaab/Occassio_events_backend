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
      const accessToken = req.cookies.access_token;
      console.log(accessToken, "qwertyuiodfghjk");
      if (!accessToken) {
        return this.handleRefreshToken(req, res, next);
      }
      try {
        const decode = this._jwtService.verifyAccessToken(accessToken);
        console.log(
          decode.role,
          "decode111111111111111111111111111111111111",
          this.role
        );
        if (decode.role !== this.role) {
          res.status(HttpStatusCode.UNAUTHORIZED).json({
            message:
              "Unauthorized: You do not have permission to access this resource",
          });
          return;
        }

        await this.verifyUserOrEmployee(decode.id, decode.role);

        req.id = decode.id;
        next();
      } catch (tokenError) {
        return this.handleRefreshToken(req, res, next);
      }
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

   private async handleRefreshToken(
    req: AuthenticatedRequest, 
    res: Response, 
    next: NextFunction
  ): Promise<void> {
    const refreshToken = req.cookies.refresh_token;
    
    if (!refreshToken) {
      res
        .status(HttpStatusCode.UNAUTHORIZED)
        .json({ message: "Unauthorized: No token provided" });
      return;
    }

    try {
      const decode = this._jwtService.verifyRefreshToken(refreshToken);
      
      if (decode.role !== this.role) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
          message: "Unauthorized: You do not have permission to access this resource",
        });
        return;
      }

      await this.verifyUserOrEmployee(decode.id, decode.role);
      
      const newAccessToken = this._jwtService.generateAccessToken({
        id: decode.id,
        role: decode.role
      });
      
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 
      });
      
      req.id = decode.id;
      next();
      
    } catch (error) {
      res.status(HttpStatusCode.UNAUTHORIZED).json({ 
        message: "Session expired. Please login again." 
      });
      return;
    }
  }

  private async verifyUserOrEmployee(id: string, role: string): Promise<void> {
    if (role === "employee") {
      const employee = await Employee.findById(id);
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
    } else if (role === "user") {
      const user = await User.findById(id);
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
  }

}
