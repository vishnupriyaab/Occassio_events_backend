import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IEmplAuthService from "../../../interfaces/services/employee/empl.auth.services";
import IEmplAuthController from "../../../interfaces/controller/employee/empl.auth.controller";
import { adminAuthServices } from "../../../services/business/employeeServices/authServices";

export class EmplAuthController implements IEmplAuthController{
  private _emplService: IEmplAuthService;
  constructor(emplService: IEmplAuthService) {
    this._emplService = emplService;
  }

    //login
    async employeeLogin(req: Request, res: Response): Promise<void> {
      const { email, password } = req.body;
      console.log(email, password, "employeelogin");
      try {
        const { accessToken, refreshToken } =
          await this._emplService.loginEmployee(email, password);
        res
          .cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          })
          .cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
          });
        return successResponse(
          res,
          HttpStatusCode.OK,
          "Employee logged in successfully",
          { accessToken, refreshToken }
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          if (error.name === "EmployeeNotFound") {
            ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
            return;
          }
          if (error.name === "AccountIsBlocked") {
            ErrorResponse(
              res,
              HttpStatusCode.BAD_REQUEST,
              "Your account is blocked"
            );
            return;
          }
        }
        return ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Internal Server Error"
        );
      }
    }

  //forgotPassword
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email, "emailgot itttt");
      const result = await this._emplService.forgotPassword(email);
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

  //resetPassword
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { password, token } = req.body;
      console.log(password, token, "req.bodyyy");
      const result = await this._emplService.resetPassword(token, password);
      return successResponse(res, HttpStatusCode.OK, "Password has been reset");
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "InvalidResetToken") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid reset token");
          return;
        }
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
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
}

export const emplAuthController = new EmplAuthController(adminAuthServices);
