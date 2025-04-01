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
        const error = new Error("Employee ID is required");
        error.name = "EmployeeIDIsRequired";
        throw error;
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
        const error = new Error("All fields are required");
        error.name = "AllFieldsAreRequired";
        throw error;
      }

      if (password !== confirmPassword) {
        const error = new Error("Passwords do not match");
        error.name = "PasswordsDoNotMatch";
        throw error;
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
        const error = new Error("Image is required");
        error.name = "ImageIsRequired";
        throw error;
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
      }
    }
  }
}

export const emplProfileController = new EmplProfileController(
  emplProfileService
);
