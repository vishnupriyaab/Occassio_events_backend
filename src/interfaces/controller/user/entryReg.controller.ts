import { Request, Response } from "express";

export default interface IEntryRegController{
    entryReg(req: Request, res: Response): Promise<void>
}