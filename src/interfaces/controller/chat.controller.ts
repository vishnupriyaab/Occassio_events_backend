import { Server } from "socket.io";
import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { Request, Response } from "express";

export default interface IChatController {
    handleNewUserMessage(socket: Server, conversationId: string, message: string, userId: string): Promise<void> 
    handleEmployeeMessage(socket: Server, conversationId: string, message: string, employeeId: string): Promise<void>
    getChats(req: AuthenticatedRequest, res: Response<any, Record<string, any>>): Promise<void>;
    getConversationId(req: AuthenticatedRequest, res: Response<any, Record<string, any>>): Promise<void>;
    getConversationData(req: Request, res: Response<any, Record<string, any>>): Promise<void>;
}