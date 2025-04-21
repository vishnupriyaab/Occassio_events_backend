import { Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IUserChatController from "../../../interfaces/controller/user/chat.controller";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { userChatService } from "../../../services/business/userServices/chatServices";
import IUserChatServices from "../../../interfaces/services/user/chat.services";
import { Server } from "socket.io";
import { IChatMessageModel } from "../../../interfaces/entities/chat.entity";
import mongoose from "mongoose";

export class UserChatController implements IUserChatController {
  private _chatService: IUserChatServices;
  constructor(chatService: IUserChatServices) {
    this._chatService = chatService;
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

  //notuse
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

    async handleNewUserMessage(
      socket: Server,
      conversationId: string,
      message: string,
      userId: string
    ): Promise<void> {
      try {
        const chatMessage: IChatMessageModel =await this._chatService.userSendMessage(conversationId, userId, message);
        socket.to(conversationId).emit("userMessage", chatMessage);
      } catch (error) {
        console.error("Error handling user message:", error);
      }
    }

    async deleteMessage(
      req: AuthenticatedRequest,
      res: Response
    ): Promise<void> {
      try {
        const userId = req.id;
        console.log(userId,"vishnuUserId");
        const { conversationId, messageId } = req.params;
        // const deleteType = req.query.deleteType as 'me' | 'everyone';
        
        if (!userId || !conversationId || !messageId ) {
          return ErrorResponse(
            res,
            HttpStatusCode.BAD_REQUEST,
            "Missing required parameters"
          );
        }
        
        const conversation = await this._chatService.chatMessage(new mongoose.Types.ObjectId(conversationId));
        if (!conversation) {
          return ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Conversation not found"
          );
        }
        
        
        const result = await this._chatService.deleteMessage(
          messageId,
          userId!,
          // deleteType
        );
        
        console.log(result,"resultttttttt")

        return successResponse(
          res,
          HttpStatusCode.OK,
          "Message deleted successfully",
          result
        );
      } catch (error: any) {
        console.error("Failed to delete message:", error);
        return ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          error.message || "Failed to delete message"
        );
      }
    }


}

export const userChatController = new UserChatController(userChatService);
