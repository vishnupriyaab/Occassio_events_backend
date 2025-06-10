import { Types } from "mongoose";
import * as fs from "fs";
import path from "path";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import {
  IChatMessageModel,
  IConversation,
} from "../../../interfaces/entities/chat.entity";
import IUserChatRepository from "../../../interfaces/repository/user/chat.repository";
import IUserChatServices from "../../../interfaces/services/user/chat.services";
import { AppError } from "../../../middleware/errorHandling";
import { userChatRepository } from "../../../repositories/entities/userRepositories/chatRepository";
import { ICloudinaryService } from "../../../interfaces/integration/IClaudinary";
import IHelperService from "../../../interfaces/integration/IHelper";
import { HelperService } from "../../../integration/helper";
import { CloudinaryService } from "../../../integration/claudinaryService";

export class UserChatServices implements IUserChatServices {
  private _chatRepository: IUserChatRepository;
  private _helperService: IHelperService;
  private _cloudinaryService: ICloudinaryService;
  constructor(
    chatRepository: IUserChatRepository,
    cloudinaryService: ICloudinaryService,
    helperService: IHelperService
  ) {
    this._chatRepository = chatRepository;
    this._helperService = helperService;
    this._cloudinaryService = cloudinaryService;
  }

  async getChats(userId: string): Promise<IConversation> {
    try {
      return await this._chatRepository.getChat(userId);
    } catch (error) {
      throw error;
    }
  }

  async getConversationId(userId: string): Promise<IConversation> {
    try {
      console.log(userId, "userId111111");
      const conversation = await this._chatRepository.getConversationId(userId);

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
      return await this._chatRepository.ChatMessage(conversationId);
    } catch (error) {
      throw error;
    }
  }

  async getConversationData(): Promise<IConversation[]> {
    try {
      console.log("wertyui");
      return await this._chatRepository.getConversationData();
    } catch (error) {
      throw error;
    }
  }

  async userSendMessage(
    conversationId: string,
    userId: string,
    message: string
  ): Promise<IChatMessageModel> {
    return this._chatRepository.sendMessage(
      conversationId,
      userId,
      message,
      "user"
    );
  }

  async deleteMessage(
    messageId: string,
    userId: string
  ): Promise<any> {
    try {
      const message = await this._chatRepository.getMessageById(messageId);

      console.log(message,"message", userId,"userId")

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

      return await this._chatRepository.markMessageDeletedForEveryone(
        messageId
      );
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
    userId: string,
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

      const savedMessage = await this._chatRepository.saveImageMessage(
        conversationId,
        userId,
        imageUrl,
        "user"
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

      const message = await this._chatRepository.getMessageById(messageId);

      if (!message) {
        throw new Error("Message not found");
      }

      const existingReactionIndex = message.reactions?.findIndex(
        (reaction) =>
          reaction.userId.toString() === userId && reaction.emoji === emoji
      );

      if (existingReactionIndex !== -1 && existingReactionIndex !== undefined) {
        const result = await this._chatRepository.removeReaction(
          messageId,
          userId,
          emoji
        );
        return result;
      } else {
        const result = await this._chatRepository.addReaction(
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
export const userChatService = new UserChatServices(
  userChatRepository,
  cloudinaryService,
  helperService
);
