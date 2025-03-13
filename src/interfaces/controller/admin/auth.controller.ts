import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";

export default interface IAuthConrtoller{
    adminLogin(req: Request, res: Response): Promise<void>
    logOut(req: AuthenticatedRequest, res: Response): Promise<void>
}