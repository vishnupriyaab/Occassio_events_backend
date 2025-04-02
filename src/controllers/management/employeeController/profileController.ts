import { Response } from "express";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IEmplProfileController from "../../../interfaces/controller/employee/profile.controller";
import IEmplProfileService from "../../../interfaces/services/employee/profile.services";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { emplProfileService } from "../../../services/business/employeeServices/profileService";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { AppError } from "../../../middleware/errorHandling";

export class EmplProfileController implements IEmplProfileController {
  private _emplService: IEmplProfileService;
  constructor(emplService: IEmplProfileService) {
    this._emplService = emplService;
  }
  //showProfile
  async showProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log(req.id, "Vishnu12345"); //editProfile
      const employeeId = req.id;
      if (!employeeId) {
        throw new AppError(
          "Employee ID is required",
          HttpStatusCode.BAD_REQUEST,
          "EmployeeIDIsRequired"
        );
      }

      const profile = await this._emplService.showProfile(employeeId);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Profile fetched successfully",
        profile
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "EmployeeIDIsRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Employee ID is required"
          );
          return;
        }
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Employee not found");
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

  //updateProfile
  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId: string = req.id || "";
      const { name, email, password, confirmPassword } = req.body;
      console.log(name, email, password, confirmPassword, "1111111111111");
      if (!name || !email || !password || !confirmPassword) {
        throw new AppError(
          "All fields are required",
          HttpStatusCode.BAD_REQUEST,
          "AllFieldsAreRequired"
        );
      }

      if (password !== confirmPassword) {
        throw new AppError(
          "Passwords do not match",
          HttpStatusCode.BAD_REQUEST,
          "PasswordsDoNotMatch"
        );
      }
      const updatedUser = await this._emplService.updateProfile(employeeId, {
        name,
        email,
        password,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Profile updated successfully",
        updatedUser
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AllFieldsAreRequired") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "All fields are required"
          );
          return;
        }
        if (error.name === "PasswordsDoNotMatch") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Passwords do not match"
          );
          return;
        }
        if (error.name === "EmailAlreadyUse") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Email already in use by another user"
          );
          return;
        }
        if (error.name === "UserNotFound") {
          ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "User not found or update failed"
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

  //updateProfileImg
  async updateProfileImage(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      const employeeId: string = req.id!;
      const image = req.file?.path;

      if (!image) {
        throw new AppError(
          "Image is required",
          HttpStatusCode.BAD_REQUEST,
          "ImageIsRequired"
        );
      }

      const updatedUser = await this._emplService.updateProfileImage(
        image,
        employeeId
      );
      successResponse(
        res,
        HttpStatusCode.OK,
        "Profile image upadted",
        updatedUser
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "ImageIsRequired") {
          ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Image is required");
          return;
        }
        if (error.name === "EmployeeNotFound") {
          ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Employee not found or update failed"
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

export const emplProfileController = new EmplProfileController(
  emplProfileService
);
