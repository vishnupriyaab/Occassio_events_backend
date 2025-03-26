import { Request, Response } from "express";
import IUserAuthController from "../../../interfaces/controller/user/user.auth.controller";
import IUserAuthService from "../../../interfaces/services/user/auth.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { userAuthService } from "../../../services/business/userServices/authServices";

export class UserAuthController implements IUserAuthController {
  private _userService: IUserAuthService;
  constructor(userService: IUserAuthService) {
    this._userService = userService;
  }
  //resetPassword
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { password, token } = req.body;
      console.log(password, token, "req.bodyyy");
      const result = await this._userService.resetPassword(token, password);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Password has been reset",
        result
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "InvalidResetToken") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid reset token");
          return;
        }
        if (error.name === "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User not found");
          return;
        }
        if (error.name === "InvalidOrExpiredResetToken") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Invalid or expired reset token"
          );
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

   //forgotPassword
   async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email, "emailgot itttt");
      const result = await this._userService.forgotPassword(email);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Password reset link sent to your email",
        result
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Employee not found");
          return;
        }
      }
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }
}

export const userAuthController = new UserAuthController(
  userAuthService
);
