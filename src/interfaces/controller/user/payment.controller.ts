import { Request, Response } from "express";

export default interface IPaymentController{
    oneByThirdPayment(req: Request, res: Response): Promise<void>
    handlePaymentWebhook(req: Request, res: Response): Promise<void>
}