import { Request, Response } from "express";
import IUserAuthController from "../../../interfaces/controller/user/user.auth.controller";
import IUserAuthService from "../../../interfaces/services/user/auth.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { userAuthService } from "../../../services/business/userServices/authServices";
import { AppError } from "../../../middleware/errorHandling";

export class UserAuthController implements IUserAuthController {
  private _userService: IUserAuthService;
  constructor(userService: IUserAuthService) {
    this._userService = userService;
  }

  //User-Login
  async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const { accessToken, refreshToken } = await this._userService.loginUser(
        email,
        password
      );
      res
        .cookie("refresh_token", refreshToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })
        .cookie("access_token", accessToken, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
      return successResponse(
        res,
        HttpStatusCode.OK,
        "User logged in successfully",
        { accessToken, refreshToken }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "User not found");
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
        if (error.name === "InvalidPassword") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid password");
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

  //googleLogin
  async googleLogin(req: Request, res: Response): Promise<void> {
    try {
      const { credential } = req.body;
      const jwtToken = credential.credential;

      if (!jwtToken) {
        throw new AppError(
          "Google credential is required",
          HttpStatusCode.BAD_REQUEST,
          "GoogleCredentialIsRequired"
        );
      }

      const { accessToken, refreshToken } = await this._userService.googleLogin(
        jwtToken
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
        "User logged in successfully",
        { accessToken, refreshToken }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "GoogleCredentialIsRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Google credential is required"
          );
          return;
        }
        if (error.name === "InvalidToken") {
          ErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "Invalid token");
          return;
        }
        if (error.name === "UserIsBlocked") {
          ErrorResponse(
            res,
            HttpStatusCode.FORBIDDEN,
            "User is blocked. Please contact support"
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
        if (error.name === "UserNotFound") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "User not found");
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

export const userAuthController = new UserAuthController(userAuthService);
