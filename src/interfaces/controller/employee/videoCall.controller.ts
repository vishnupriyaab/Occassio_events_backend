import { Request, Response } from "express";

export default interface IVideoCallController{
    initiateCall(req: Request, res: Response): Promise<void>
    updateCallStatus(req: Request, res: Response): Promise<void>
    getCallHistory(req: Request, res: Response): Promise<void>
}