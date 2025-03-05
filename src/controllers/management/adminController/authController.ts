import { Request, Response } from "express";
import IAuthService from "../../../interfaces/services/admin/auth.services";
import { adminAuthServices } from "../../../services/business/adminServices/authServices";
import { ErrorResponse, successResponse } from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";

export class authController {
  private _authService: IAuthService;

  constructor(authService: IAuthService) {
    this._authService = authService;
  }
  //Admin-Login
   async adminLogin(req: Request, res: Response): Promise<any> {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      if (!email || !password) {
        const error = new Error("Email and password are required");
        error.name = "FieldsAreRequired";
        throw error;
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
      if(error instanceof Error){
        if (error.name === "FieldsAreRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Email and password are required"
          );
          return;
        }
        if (error.name === "AdminNotFound") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Admin not found"
          );
          return;
        }
        if (error.name === "InvalidCredentials") {
          ErrorResponse(
            res,
            HttpStatusCode.UNAUTHORIZED,
            "Invalid credentials"
          );
          return;
        }
      }
    }
  }

  
}

export const adminAuthController = new authController(adminAuthServices);
