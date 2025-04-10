import { Server } from "socket.io";
import IChatController from "../../interfaces/controller/chat.controller";
import IChatService from "../../interfaces/services/chat.services";
import { AuthenticatedRequest } from "../../middleware/authenticateToken";
import {
  ErrorResponse,
  successResponse,
} from "../../integration/responseHandler";
import { HttpStatusCode } from "../../constant/httpStatusCodes";
import { chatServices } from "../../services/business/chatServices";
import { Response } from "express";
import { IChatMessageModel } from "../../interfaces/entities/chat.entity";

export class ChatController implements IChatController {
  private _chatService: IChatService;

  constructor(chatService: IChatService) {
    this._chatService = chatService;
  }

  async handleNewUserMessage(
    socket: Server,
    conversationId: string,
    message: string,
    userId: string
  ): Promise<void> {
    try {
      // console.log(conversationId, message, userId,"00000000000000")
      const chatMessage: IChatMessageModel =await this._chatService.userSendMessage(conversationId, userId, message);
      socket.to(conversationId).emit("employeeMessage", chatMessage);
    } catch (error) {
      console.error("Error handling user message:", error);
    }
  }

  async handleEmployeeMessage(
    socket: Server,
    conversationId: string,
    message: string,
    employeeId: string
  ): Promise<void> {
    try {
      // await this._chatService.employeeSendMessage(
      //   conversationId,
      //   employeeId,
      //   message
      // );
      socket.to(conversationId).emit("userMessage", {
        conversationId,
        message,
        senderId: employeeId,
        senderType: "employee",
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error handling employee message:", error);
    }
  }

  async getChats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log(33333333);

      const userId = req.id;

      if (!userId) {
        return ErrorResponse(
          res,
          HttpStatusCode.FORBIDDEN,
          "User ID not provided"
        );
      }

      const conversation = await this._chatService.getChats(userId);
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Conversation fetched successfully",
        conversation
      );
    } catch (error) {
      console.error("Failed to get or create conversation:", error);
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to get or create conversation"
      );
    }
  }

  async getConversationId(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      console.log(4444444444);

      const userId = req.id;
      console.log(typeof userId, "userId");

      if (!userId) {
        return ErrorResponse(
          res,
          HttpStatusCode.FORBIDDEN,
          "User ID not provided"
        );
      }

      const conversation = await this._chatService.getConversationId(userId);
      const chatMessages = await this._chatService.chatMessage(
        conversation.conversationid
      );
      console.log(chatMessages, "chatmessagessss");
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Conversation ID fetched successfully",
        { conversation, chatMessages }
      );
    } catch (error: any) {
      if (error.name === "ConversationNotFound") {
        return ErrorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          "Conversation not found"
        );
      }
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Error fetching conversation"
      );
    }
  }

  async getConversationData(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      console.log(5555555);
      const employeeId = req.id;
      console.log(employeeId, "employeeId");

      const conversationData = await this._chatService.getConversationData();
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Conversation data fetched successfully",
        conversationData
      );
    } catch (error) {
      return ErrorResponse(
        res,
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        "Error fetching conversation data"
      );
    }
  }
}

export const chatController = new ChatController(chatServices);
