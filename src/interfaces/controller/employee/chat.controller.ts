import { Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { Server } from "socket.io";

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
      deleteMessage(
        req: AuthenticatedRequest,
        res: Response
      ): Promise<void>
      handleEmployeeMessage(
          socket: Server,
          conversationId: string,
          message: string,
          employeeId: string
        ): Promise<IChatMessageModel>
}