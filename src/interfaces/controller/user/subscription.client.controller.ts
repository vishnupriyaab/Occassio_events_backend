import { Request, Response } from "express"
import { AuthenticatedRequest } from "../../../middleware/authenticateToken"

export default interface ISubClientController{
    fetchSubClientData(
        req: AuthenticatedRequest,
        res: Response
      ): Promise<void>
    fetchBooking(req:Request, res:Response):Promise<void>
}