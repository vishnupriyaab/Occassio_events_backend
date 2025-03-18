import { Request, Response } from "express";
import IEntryRegFormData from "../../entities/IEntryFormReg.entity";

export default interface IEntryRegController {
  entryReg(
    req: Request<{}, {}, IEntryRegFormData>,
    res: Response
  ): Promise<void>;
  entryPayment(req: Request, res: Response): Promise<void>;
}
