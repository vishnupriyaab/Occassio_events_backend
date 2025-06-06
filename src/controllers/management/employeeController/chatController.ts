import { Request, Response } from "express";

import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IEmplChatController from "../../../interfaces/controller/employee/chat.controller";
import IEmplChatServices from "../../../interfaces/services/employee/chat.services";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { emplChatService } from "../../../services/business/employeeServices/chatServices";
import { Server } from "socket.io";
import { IChatMessageModel } from "../../../interfaces/entities/chat.entity";
import mongoose from "mongoose";

export class EmplChatController implements IEmplChatController {
  private _chatService: IEmplChatServices;
  constructor(chatService: IEmplChatServices) {
    this._chatService = chatService;
  }
  async getChats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const employeeId = req.id;

      if (!employeeId) {
        return ErrorResponse(
          res,
          HttpStatusCode.FORBIDDEN,
          "User ID not provided"
        );
      }

      const conversation = await this._chatService.getChats(employeeId);
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

  async getLastMessage(req:Request, res:Response): Promise<void> {
    try {
      const conversationId = req.params.conversationId;
      console.log(conversationId, "conversationId");
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> {
    try {
      console.log(4444444444);
      const conversationId = req.params.conversationId;
      console.log(conversationId, "conversationId");

      if (!conversationId) {
        return ErrorResponse(
          res,
          HttpStatusCode.FORBIDDEN,
          "User ID not provided"
        );
      }

      const conversation = await this._chatService.getConversationId(
        conversationId
      );
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
    } catch (error: unknown) {
      if(error instanceof Error){
        if (error.name === "ConversationNotFound") {
          return ErrorResponse(
            res,
            HttpStatusCode.NOT_FOUND,
            "Conversation not found"
          );
        }
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

      const conversationData = await this._chatService.getConversationData(
        employeeId!
      );
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

  //chat with client
  async handleEmployeeMessage(
    socket: Server,
    conversationId: string,
    message: string,
    employeeId: string
  ): Promise<IChatMessageModel> {
    try {
      const chatMessage: IChatMessageModel =
        await this._chatService.employeeSendMessage(
          conversationId,
          employeeId,
          message
        );
      socket.to(conversationId).emit("employeeMessage", chatMessage);
      return chatMessage;
    } catch (error) {
      console.error("Error handling employee message:", error);
      throw error;
    }
  }

  async deleteMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.id;
      console.log(userId, "vishnuUserId");
      const { conversationId, messageId } = req.params;

      if (!userId || !conversationId || !messageId) {
        return ErrorResponse(
          res,
          HttpStatusCode.BAD_REQUEST,
          "Missing required parameters"
        );
      }

      const conversation = await this._chatService.chatMessage(
        new mongoose.Types.ObjectId(conversationId)
      );
      if (!conversation) {
        return ErrorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          "Conversation not found"
        );
      }

      const result = await this._chatService.deleteMessage(
        messageId,
        userId!
        // deleteType
      );

      console.log(result, "resultttttttt");

      return successResponse(
        res,
        HttpStatusCode.OK,
        "Message deleted successfully",
        result
      );
    } catch (error: unknown) {
      console.error("Failed to delete message:", error);
      if(error instanceof Error){
        return ErrorResponse(
          res,
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          error.message || "Failed to delete message"
        );
      }
    }
  }

  async saveImageMessage(
    socket: Server,
    base64Image: string,
    fileName: string,
    employeeId: string,
    conversationId: string
  ): Promise<void> {
    try {
      const chatMessage = await this._chatService.saveImageMessage(
        base64Image,
        fileName,
        employeeId,
        conversationId
      );
      socket.to(conversationId).emit("employeeMessage", chatMessage);
    } catch (error) {
      console.log(error);
    }
  }

  async messageReaction(
    socket: Server,
    conversationId: string,
    messageId: string,
    emoji: string,
    userId: string,
    userType: string
  ): Promise<void> {
    try {
      const messageReaction: IChatMessageModel =
        await this._chatService.handleMessageReaction(
          conversationId,
          messageId,
          emoji,
          userId,
          userType
        );
      console.log(messageReaction, "11111111111111111111111111");
      socket
        .to(conversationId)
        .emit("message-reaction-update", messageReaction);
    } catch (error) {
      throw error;
    }
  }
}

export const emplChatController = new EmplChatController(emplChatService);
