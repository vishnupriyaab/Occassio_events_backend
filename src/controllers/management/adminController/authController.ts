import { Request, Response } from "express";
import IAuthService from "../../../interfaces/services/admin/auth.services";
import { adminAuthServices } from "../../../services/business/adminServices/authServices";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import IAuthConrtoller from "../../../interfaces/controller/admin/admin.auth.controller";
import { AppError } from "../../../middleware/errorHandling";

export class AuthController implements IAuthConrtoller {
  private _authService: IAuthService;

  constructor(authService: IAuthService) {
    this._authService = authService;
  }
  //Admin-Login
  async adminLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !password) {
        throw new AppError(
          "Email and password are required",
          HttpStatusCode.BAD_REQUEST,
          "FieldsAreRequired"
        );
      }

      const { accessToken, refreshToken } = await this._authService.adminLogin(
        email,
        password
      );

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
        "Admin logged in successfully"
      );
    } catch (error: unknown) {
      console.log(error, "error");
      if (error instanceof Error) {
        if (error.name === "AdminNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Admin not found");
          return;
        }
        if (error.name === "PasswordIsIncorrect") {
          ErrorResponse(
            res,
            HttpStatusCode.UNAUTHORIZED,
            "Password is Incorrect"
          );
          return;
        }
        return ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "An unexpected error occurred"
        );
      }
    }
  }

  //Admin-Logout
  async logOut(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      res
        .clearCookie("refresh_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .clearCookie("access_token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      console.log(123);
      return successResponse(res, HttpStatusCode.OK, "Logout successful");
    } catch (error: unknown) {
      console.error(error, "Error during logout");
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Logout failed. Please try again."
      );
    }
  }
}

export const adminAuthController = new AuthController(adminAuthServices);
