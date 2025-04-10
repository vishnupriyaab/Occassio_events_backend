import { Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";

export default interface IEmplChatController{
    getChats(req: AuthenticatedRequest, res: Response): Promise<void>
    getConversationId(
        req: AuthenticatedRequest,
        res: Response
      ): Promise<void>
      getConversationData(
        req: AuthenticatedRequest,
        res: Response
      ): Promise<void>
}