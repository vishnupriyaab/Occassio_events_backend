import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { ErrorResponse, successResponse } from "../../../integration/responseHandler";
import { adminMiscellaneouServices } from "../../../services/business/adminServices/miscellaneousServices";
import IMiscellaneousServices from "../../../interfaces/services/admin/miscellaneous.services";

export class miscellaneousController {
  private _miscellaneousService: IMiscellaneousServices;
  constructor(miscellaneousService: IMiscellaneousServices) {
    this._miscellaneousService = miscellaneousService;
  }

  async getMiscellaneous(req: Request, res: Response): Promise<void> {
    try {
      const miscellaneous = await this._miscellaneousService.getMiscellaneous();
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Miscellaneous fetched successfully",
        miscellaneous
      );
    } catch (error: unknown) {
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

  async addMiscellaneous(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, startingPrice, endingPrice, blocked } =
        req.body;
      console.log(
        name,
        description,
        startingPrice,
        endingPrice,
        blocked,
        "1234567890"
      );
      const newMiscellaneous = await this._miscellaneousService.addMiscellaneous({
        name,
        description,
        startingPrice,
        endingPrice,
        blocked,
      });
      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "New Miscellaneous is Added",
        newMiscellaneous
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AlreadyExists") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Miscellaneous already exists");
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

  async updateMiscellaneous(req: Request, res: Response): Promise<void> {
    try {
      const miscellaneousId = req.params.id;
      const { name, description, startingPrice, endingPrice } = req.body;
      const updatedData = { name, description, startingPrice, endingPrice };
      const updateMiscellaneous = await this._miscellaneousService.updateMiscellaneous(
        miscellaneousId,
        updatedData
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Miscellaneous successfully updated",
        updateMiscellaneous
      );
    } catch (error: unknown) {
      ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
      return;
    }
  }

  async deleteMiscellaneous(req: Request, res: Response): Promise<void> {
    try {
      const miscellaneousId = req.params.id;
      await this._miscellaneousService.deleteMiscellaneous( miscellaneousId );

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Miscellaneous successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "MiscellaneousNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Miscellaneous not found");
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

  async isList(req: Request, res: Response): Promise<void> {
    try {
      const miscellaneousId = req.params.id;
      const { blocked } = req.body;
      console.log(miscellaneousId, blocked, "Received on backend");
      const updateMiscellaneous = await this._miscellaneousService.isList(miscellaneousId, {
        list: blocked,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Miscellaneous listing status updated successfully",
        updateMiscellaneous
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name == "MiscellaneousNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Miscellaneous not found");
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

export const adminMiscellaneousController = new miscellaneousController(adminMiscellaneouServices);