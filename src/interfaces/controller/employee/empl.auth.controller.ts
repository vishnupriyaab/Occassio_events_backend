import { Request, Response } from "express";

export default interface IEmplAuthController{
    forgotPassword(req: Request, res: Response): Promise<void>
    resetPassword(req: Request, res: Response): Promise<void>

}