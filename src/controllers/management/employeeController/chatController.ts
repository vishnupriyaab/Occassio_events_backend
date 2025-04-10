import { Response } from "express";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import IEmplChatController from "../../../interfaces/controller/employee/chat.controller";
import IEmplChatServices from "../../../interfaces/services/employee/chat.services";
import { AuthenticatedRequest } from "../../../middleware/authenticateToken";
import { emplChatService } from "../../../services/business/employeeServices/chatServices";

export class EmplChatController implements IEmplChatController {
  private _chatService: IEmplChatServices;
  constructor(chatService: IEmplChatServices) {
    this._chatService = chatService;
  }
  async getChats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      console.log(33333333);

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

      const conversation = await this._chatService.getConversationId(conversationId);
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
  
        const conversationData = await this._chatService.getConversationData(employeeId!);
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

export const emplChatController = new EmplChatController(emplChatService);
