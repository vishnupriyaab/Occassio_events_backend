import { Types } from "mongoose";
import * as fs from "fs";
import path from "path";
import {
  IChatMessageModel,
  IConverationModel,
  IConversation,
} from "../../../interfaces/entities/chat.entity";
import IEmplChatRepository from "../../../interfaces/repository/employee/chat.repository";
import IEmplChatServices from "../../../interfaces/services/employee/chat.services";
import { emplChatRepository } from "../../../repositories/entities/employeeRepository/chatRepository";
import { AppError } from "../../../middleware/errorHandling";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import IHelperService from "../../../interfaces/integration/IHelper";
import { ICloudinaryService } from "../../../interfaces/integration/IClaudinary";
import { HelperService } from "../../../integration/helper";
import { CloudinaryService } from "../../../integration/claudinaryService";

export class EmplChatServices implements IEmplChatServices {
  private _emplChatRepo: IEmplChatRepository;
  private _helperService: IHelperService;
  private _cloudinaryService: ICloudinaryService;
  constructor(
    emplChatRepo: IEmplChatRepository,
    cloudinaryService: ICloudinaryService,
    helperService: IHelperService
  ) {
    this._emplChatRepo = emplChatRepo;
    this._helperService = helperService;
    this._cloudinaryService = cloudinaryService;
  }

  async getChats(conversationId: string): Promise<IConverationModel> {
    try {
      return await this._emplChatRepo.getChat(conversationId);
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(conversationId: string): Promise<IConversation> {
    try {
      console.log(conversationId, "conversationId");
      const conversation = await this._emplChatRepo.getConversationId(
        conversationId
      );

      console.log(conversation, "hry i'm there");

      if (!conversation) {
        throw new AppError(
          "Conversation not found",
          HttpStatusCode.NOT_FOUND,
          "ConversationNotFound"
        );
      }

      return conversation;
    } catch (error) {
      throw error;
    }
  }

  async chatMessage(
    conversationId: Types.ObjectId
  ): Promise<IChatMessageModel[]> {
    try {
      return await this._emplChatRepo.ChatMessage(conversationId);
    } catch (error) {
      throw error;
    }
  }

  async getConversationData(employeeId: string): Promise<IConversation[]> {
    try {
      console.log("wertyui");
      return await this._emplChatRepo.getConversationData(employeeId);
    } catch (error) {
      throw error;
    }
  }

  async employeeSendMessage(
    conversationId: string,
    employeeId: string,
    message: string
  ): Promise<IChatMessageModel> {
    try {
      return this._emplChatRepo.sendMessage(
        conversationId,
        employeeId,
        message,
        "employee"
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(messageId: string, userId: string): Promise<any> {
    try {
      const message = await this._emplChatRepo.getMessageById(messageId);

      if (!message) {
        throw new AppError(
          "Message not found",
          HttpStatusCode.NOT_FOUND,
          "MessageNotFound"
        );
      }

      // if (deleteType === "everyone") {
      if (message.senderId!.toString() !== userId) {
        throw new AppError(
          "Only the sender can delete messages for everyone",
          HttpStatusCode.FORBIDDEN,
          "UnauthorizedDeletion"
        );
      }

      return await this._emplChatRepo.markMessageDeletedForEveryone(messageId);
      // } else {
      //   return await this._chatRepository.markMessageDeletedForUser(
      //     messageId,
      //     userId
      //   );
      // }
    } catch (error) {
      throw error;
    }
  }

  async saveImageMessage(
    base64Image: string,
    fileName: string,
    employeeId: string,
    conversationId: string
  ): Promise<IChatMessageModel> {
    try {
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

      const tempDir = path.join(__dirname, "../../../temp-uploads");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      const uniqueFilename = `${Date.now()}-${fileName}`;
      const filePath = path.join(tempDir, uniqueFilename);

      fs.writeFileSync(filePath, base64Data, { encoding: "base64" });

      const file: Express.Multer.File = {
        fieldname: "image",
        originalname: fileName,
        encoding: "7bit",
        mimetype: this._helperService.getMimeType(fileName),
        destination: tempDir,
        filename: uniqueFilename,
        path: filePath,
        size: fs.statSync(filePath).size,
        stream: fs.createReadStream(filePath),
        buffer: Buffer.from(base64Data, "base64"),
      } as unknown as Express.Multer.File;

      const uploadedUrls = await this._cloudinaryService.uploadMultipleImages([
        file,
      ]);
      const imageUrl: string = uploadedUrls[0];

      fs.unlinkSync(filePath);

      const savedMessage = await this._emplChatRepo.saveImageMessage(
        conversationId,
        employeeId,
        imageUrl,
        "employee"
      );

      console.log("qwertyu");
      return savedMessage;
    } catch (error) {
      throw error;
    }
  }

  async handleMessageReaction(
    conversationId: string,
    messageId: string,
    emoji: string,
    userId: string,
    userType: string
  ): Promise<IChatMessageModel> {
    try {
      console.log(
        conversationId,
        messageId,
        emoji,
        userId,
        userType,
        "1234567890"
      );

      const message = await this._emplChatRepo.getMessageById(messageId);

      if (!message) {
        throw new Error("Message not found");
      }

      const existingReactionIndex = message.reactions?.findIndex(
        (reaction) =>
          reaction.userId.toString() === userId && reaction.emoji === emoji
      );

      if (existingReactionIndex !== -1 && existingReactionIndex !== undefined) {
        const result = await this._emplChatRepo.removeReaction(
          messageId,
          userId,
          emoji
        );
        return result;
      } else {
        const result = await this._emplChatRepo.addReaction(
          messageId,
          userId,
          emoji
        );
        return result;
      }
    } catch (error) {
      throw error;
    }
  } 
}

const cloudinaryService = new CloudinaryService();
const helperService = new HelperService();
export const emplChatService = new EmplChatServices(
  emplChatRepository,
  cloudinaryService,
  helperService
);
