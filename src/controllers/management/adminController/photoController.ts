import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IPhotoServices from "../../../interfaces/services/admin/photo.services";
import { adminPhotoServices } from "../../../services/business/adminServices/photoServices";

export class soundController {
  private _photoService: IPhotoServices;
  constructor(photoService: IPhotoServices) {
    this._photoService = photoService;
  }

  async getPhotos(req: Request, res: Response): Promise<void> {
    try {
      const photo = await this._photoService.getPhotos();
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Photo & Video features fetched successfully",
        photo
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

  async addPhoto(req: Request, res: Response): Promise<void> {
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
      const newPhoto = await this._photoService.addPhoto({
        name,
        description,
        startingPrice,
        endingPrice,
        blocked,
      });
      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "New Photo & Video features is Added",
        newPhoto
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AlreadyExists") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "this Photo & Video features already exists");
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

  async updatePhoto(req: Request, res: Response): Promise<void> {
    try {
      const photoId = req.params.id;
      const { name, description, startingPrice, endingPrice } = req.body;
      const updatedData = { name, description, startingPrice, endingPrice };
      const updatedPhoto = await this._photoService.updatePhoto(
        photoId,
        updatedData
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Photo & Video features successfully updated",
        updatedPhoto
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

  async deletePhoto(req: Request, res: Response): Promise<void> {
    try {
      const photoId = req.params.id;
      await this._photoService.deletePhoto(photoId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Photo & Video features successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "PhotoNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Photo not found");
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
      const photoId = req.params.id;
      const { blocked } = req.body;
      console.log(photoId, blocked, "Received on backend");
      const updatePhoto = await this._photoService.isList(photoId, {
        list: blocked,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Photo & Video features listing status updated successfully",
        updatePhoto
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name == "SoundNotFound") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Sound not found");
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

export const adminPhotoController = new soundController(adminPhotoServices);
