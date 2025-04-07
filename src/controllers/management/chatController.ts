import { Server } from "socket.io";
import IChatController from "../../interfaces/controller/chat.controller";
import IChatService from "../../interfaces/services/chat.services";
import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import { ErrorResponse, successResponse } from "../../integration/responseHandler";
import { HttpStatusCode } from "../../constant/httpStatusCodes";
import { chatServices } from "../../services/business/chatServices";
import { Request, Response } from "express";

export class ChatController implements IChatController {
    private _chatService: IChatService;
  
    constructor(chatService: IChatService) {
      this._chatService = chatService;
    }
  
    async handleNewUserMessage(socket: Server, conversationId: string, message: string): Promise<void> {
      try {
        console.log(111);
        
        await this._chatService.sendMessage(conversationId, message);
        socket.emit('userMessage', { conversationId, message });
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    }
  
    async handleEmplNewMessage(socket: Server, conversationId: string, message: string): Promise<void> {
      try {
        console.log(222);
        
        await this._chatService.employeeSendMessage(conversationId, message);
        socket.to(conversationId).emit('adminMessage', { conversationId, message });
      } catch (error) {
        console.error('Error handling admin message:', error);
      }
    }
  
    async getChats(req: AuthenticatedRequest, res: Response): Promise<void> {
      try {
        console.log(33333333);
        
        const userId = req.id;
        
        if (!userId) {
          return ErrorResponse(res, HttpStatusCode.FORBIDDEN, 'User ID not provided');
        }
        
        const conversation = await this._chatService.getChats(userId);
        return successResponse(res, HttpStatusCode.OK, 'Conversation fetched successfully', conversation);
      } catch (error) {
        console.error('Failed to get or create conversation:', error);
        return ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Failed to get or create conversation');
      }
    }
  
    async getConversationId(req: AuthenticatedRequest, res: Response): Promise<void> {
      try {
        console.log(4444444444);
        
        const userId = req.id;
        
        if (!userId) {
          return ErrorResponse(res, HttpStatusCode.FORBIDDEN, 'User ID not provided');
        }
        
        const conversationId = await this._chatService.getConversationId(userId);
        return successResponse(res, HttpStatusCode.OK, 'Conversation ID fetched successfully', conversationId);
      } catch (error: any) {
        if (error.name === 'ConversationNotFound') {
          return ErrorResponse(res, HttpStatusCode.NOT_FOUND, 'Conversation not found');
        }
        return ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error fetching conversation');
      }
    }
  
    async getConversationData(req: Request, res: Response): Promise<void> {
      try {
        console.log(5555555);
        
        const conversationData = await this._chatService.getConversationData();
        return successResponse(res, HttpStatusCode.OK, 'Conversation data fetched successfully', conversationData);
      } catch (error) {
        return ErrorResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, 'Error fetching conversation data');
      }
    }
  }
  
  export const chatController = new ChatController(chatServices);