import { Request, Response } from "express";

export default interface IUserAuthController{
    resetPassword(req: Request, res: Response): Promise<void>
    forgotPassword(req: Request, res: Response): Promise<void>
}