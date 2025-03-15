import { Request, Response } from "express";
import IEntryRegController from "../../../interfaces/controller/user/entryReg.controller";
import IEntryRegService from "../../../interfaces/services/user/entryReg.services";
import IEntryRegFormData from "../../../interfaces/entities/IEntryFormReg.entity";
import { userEntryRegService } from "../../../services/business/userServices/entryRegServices";

export class EntryRegController implements IEntryRegController {
  private _entryRegService: IEntryRegService;
  constructor(entryRegService: IEntryRegService) {
    this._entryRegService = entryRegService;
  }
  async entryReg(
    req: Request<{}, {}, IEntryRegFormData>,
    res: Response
  ): Promise<void> {
    try {
      console.log(req.body, "qwertyuiopsdfghjklcvbnmasdfghj");
      
      const savedEntry = await this._entryRegService.registerEntry(req.body);
      res.status(201).json({ success: true, data: savedEntry });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
      }
    }
  }
}

export const userEntryRegController = new EntryRegController(userEntryRegService);
