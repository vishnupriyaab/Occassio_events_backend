import { Request, Response } from "express";
import IUserController from "../../../interfaces/controller/admin/user.controller";
import IUserService from "../../../interfaces/services/admin/user.services";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { adminUserService } from "../../../services/business/adminServices/userService";

export class UserController implements IUserController {
  private _userService: IUserService;
  constructor(userService: IUserService) {
    this._userService = userService;
  }
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const searchTerm = (req.query.searchTerm as string | undefined) || "";
      const filterStatus = req.query.filterStatus as string | undefined;

      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      console.log(searchTerm, filterStatus, page, limit, "qwertyuio");

      const result = await this._userService.fetchUser(
        searchTerm,
        filterStatus,
        page,
        limit
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Users fetched successfully",
        result
      );
    } catch (error) {
      console.log(error, "errorrrrrr");
      if (error instanceof Error) {
        if (error.name === "InvalidPageOrLimit") {
          ErrorResponse(res, 401, "InvalidPageOrLimit");
          return;
        }
      }
      ErrorResponse(res, 500, "Internal Server Error");
      return;
    }
  }

  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      console.log(userId, "userId");
      const result = await this._userService.blockClient(userId);

      const response = result?.isBlocked
        ? "Client blocked successfully"
        : "Client unblocked successfully";

      return successResponse(res, HttpStatusCode.OK, response, result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "ClientNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Client not found");
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

}

export const adminUserController = new UserController(adminUserService)