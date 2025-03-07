import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { adminFoodServices } from "../../../services/business/adminServices/foodServices";
import IFoodServices from "../../../interfaces/services/admin/food.services";

export class foodController {
  private _seatingService: IFoodServices;
  constructor(seatingService: IFoodServices) {
    this._seatingService = seatingService;
  }

  async getFood(req: Request, res: Response): Promise<void> {
    try {
      const foods = await this._seatingService.getFoods();
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Foods fetched successfully",
        foods
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

  async addFood(req: Request, res: Response): Promise<void> {
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
      const newFood = await this._seatingService.addFood({
        name,
        description,
        startingPrice,
        endingPrice,
        blocked,
      });
      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "New Food is Added",
        newFood
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AlreadyExists") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Food already exists");
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

  async updateFood(req: Request, res: Response): Promise<void> {
    try {
      const foodId = req.params.id;
      const { name, description, startingPrice, endingPrice } = req.body;
      const updatedData = { name, description, startingPrice, endingPrice };
      const updateFood = await this._seatingService.updateFood(
        foodId,
        updatedData
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Food successfully updated",
        updateFood
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

  async deleteFood(req: Request, res: Response): Promise<void> {
    try {
      const FoodId = req.params.id;
      await this._seatingService.deleteFood(FoodId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Food successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "FoodNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Food not found");
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
      const foodId = req.params.id;
      const { blocked } = req.body;
      console.log(foodId, blocked, "Received on backend");
      const updateFood = await this._seatingService.isList(foodId, {
        list: blocked,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Food listing status updated successfully",
        updateFood
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name == "FoodNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Food not found");
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

export const adminFoodController = new foodController(adminFoodServices);
