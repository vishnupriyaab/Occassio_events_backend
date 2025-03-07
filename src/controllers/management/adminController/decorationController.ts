import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IDecorServices from "../../../interfaces/services/admin/decoration.services";
import { adminDecorationServices } from "../../../services/business/adminServices/decorationServices";

export class decorationController {
  private _decorService: IDecorServices;
  constructor(decorService: IDecorServices) {
    this._decorService = decorService;
  }

  async getDecorations(req: Request, res: Response): Promise<void> {
    try {
      const decoration = await this._decorService.getDecorations();
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Decorations fetched successfully",
        decoration
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

  async addDecoration(req: Request, res: Response): Promise<void> {
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
      const newDecoration = await this._decorService.addDecoration({
        name,
        description,
        startingPrice,
        endingPrice,
        blocked,
      });
      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "New Decoration is Added",
        newDecoration
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AlreadyExists") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Decoration already exists");
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

  async updateDecoration(req: Request, res: Response): Promise<void> {
    try {
      const foodId = req.params.id;
      const { name, description, startingPrice, endingPrice } = req.body;
      const updatedData = { name, description, startingPrice, endingPrice };
      const updateDecoration = await this._decorService.updatedecoration(
        foodId,
        updatedData
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Decoration successfully updated",
        updateDecoration
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

  async deleteDecoration(req: Request, res: Response): Promise<void> {
    try {
      const decorId = req.params.id;
      await this._decorService.deletedecoration(decorId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Decoration successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "DecorationNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Decoration not found");
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
      const decorId = req.params.id;
      const { blocked } = req.body;
      console.log(decorId, blocked, "Received on backend");
      const updateFood = await this._decorService.isList(decorId, {
        list: blocked,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Decoration listing status updated successfully",
        updateFood
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name == "DecorationNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Decoration not found");
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

export const admindecorationController = new decorationController(adminDecorationServices);
