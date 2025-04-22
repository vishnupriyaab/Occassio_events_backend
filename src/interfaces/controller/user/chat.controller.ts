import { Response } from "express";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { Server } from "socket.io";

export default interface IUserChatController {
  getChats(req: AuthenticatedRequest, res: Response): Promise<void>;
  getConversationId(req: AuthenticatedRequest, res: Response): Promise<void>;
  getConversationData(req: AuthenticatedRequest, res: Response): Promise<void>;
  handleNewUserMessage(
    socket: Server,
    conversationId: string,
    message: string,
    userId: string
  ): Promise<void>;
  saveImageMessage(
    socket:Server,
    base64Image: string,
    fileName: string,
    userId: string,
    conversationId: string
  ): Promise<void>;
}
