import { Request, Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import ISoundServices from "../../../interfaces/services/admin/sound.services";
import { adminSoundServices } from "../../../services/business/adminServices/soundServices";

export class soundController {
  private _soundService: ISoundServices;
  constructor(soundService: ISoundServices) {
    this._soundService = soundService;
  }

  async getSounds(req: Request, res: Response): Promise<void> {
    try {
      const sound = await this._soundService.getSounds();
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Sounds fetched successfully",
        sound
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

  async addSound(req: Request, res: Response): Promise<void> {
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
      const newSound = await this._soundService.addSound({
        name,
        description,
        startingPrice,
        endingPrice,
        blocked,
      });
      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "New Sound is Added",
        newSound
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AlreadyExists") {
          ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Sound already exists");
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

  async updateSound(req: Request, res: Response): Promise<void> {
    try {
      const soundId = req.params.id;
      const { name, description, startingPrice, endingPrice } = req.body;
      const updatedData = { name, description, startingPrice, endingPrice };
      const updatedSound = await this._soundService.updateSound(
        soundId,
        updatedData
      );
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Sound successfully updated",
        updatedSound
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

  async deleteSound(req: Request, res: Response): Promise<void> {
    try {
      const soundId = req.params.id;
      await this._soundService.deleteSound(soundId);

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Sound successfully deleted"
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "SoundNotFound") {
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

  async isList(req: Request, res: Response): Promise<void> {
    try {
      const soundId = req.params.id;
      const { blocked } = req.body;
      console.log(soundId, blocked, "Received on backend");
      const updateSound = await this._soundService.isList(soundId, {
        list: blocked,
      });

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Sound listing status updated successfully",
        updateSound
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

export const adminSoundController = new soundController(adminSoundServices);
