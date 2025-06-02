import { Request, Response } from "express";

export default interface IDashboardController {
  getDashboardStats(req: Request, res: Response): Promise<void>;
  getDashboardStats(req: Request, res: Response): Promise<void>
}