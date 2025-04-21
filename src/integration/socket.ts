import { Server } from "socket.io";
import { emplChatController } from "../controllers/management/employeeController/chatController";
import { userChatController } from "../controllers/management/userController/chatController";
import User from "../models/userModel";
import Employee from "../models/employeeModel";

export class SocketManager {
  private io: Server;
  private onlineUsers: Map<string, string> = new Map();

  constructor(io: Server) {
    this.io = io;
    this.initializeEvents();
  }

  private initializeEvents() {
    this.io.on("connection", (client) => {
      console.log("A new user has connected", client.id);

      client.on("user-message", async (data) => {
        console.log(
          `Message from user ${data.user}: ${data.message}, ${data.userId}, ${data.conversationId}`
        );
        await userChatController.handleNewUserMessage(
          this.io,
          data.conversationId,
          data.message,
          data.userId
        );
      });

      client.on("employee-message", async (data) => {
        console.log(`Employee message from ${data.user}: ${data.message}`);
        await emplChatController.handleEmployeeMessage(
          this.io,
          data.conversationId,
          data.message,
          data.employeeId
        );
      });

      client.on("join-conversation", (data) => {
        const conversationId = data.conversationId;
        console.log(`${client.id} joined conversation ${conversationId}`);
        client.join(conversationId);

        client.emit("joined-conversation", {
          status: "success",
          message: `Joined conversation ${conversationId}`,
        });
      });

      client.on("exit-conversation", (conversationId: string) => {
        client.leave(conversationId);
        console.log(`${client.id} exited conversation ${conversationId}`);

        client.emit("exited-conversation", {
          status: "success",
          message: `exited conversation ${conversationId}`,
        });
      });

      client.on("user-online", async (data: { userId: string }) => {
        console.log(data,"234567890")
        this.onlineUsers.set(data.userId, client.id);
        console.log(`${data.userId} is online`);
        const { userId } = data;
        // client.broadcast.emit("user-status-change", {
        //   userId: data.userId,
        //   status: "online",
        // });
        await User.findByIdAndUpdate(userId, { isOnline: true });
        this.io.emit("user-status-change", { userId, status: "online" });
      });
      client.on("employee-online", async (data: { employeeId: string }) => {
        console.log(data,"234567890")
        this.onlineUsers.set(data.employeeId, client.id);
        console.log(`${data.employeeId} is online`);
        const { employeeId } = data;
        // client.broadcast.emit("user-status-change", {
        //   userId: data.userId,
        //   status: "online",
        // });
        await Employee.findByIdAndUpdate(employeeId, { isOnline: true });
        this.io.emit("employee-status-change", { employeeId, status: "online" });
      });
      
      client.on("user-offline",async (data: { userId: string }) => {
        this.onlineUsers.delete(data.userId);
        const { userId } = data;
        // client.broadcast.emit("user-status-change", {
          //   userId: data.userId,
          //   status: "offline",
          // });
          await User.findByIdAndUpdate(userId, {isOnline: false});
          this.io.emit("user-status-change", { userId, status: "offline" });
      });
      client.on("employee-offline",async (data: { employeeId: string }) => {
        this.onlineUsers.delete(data.employeeId);
        const { employeeId } = data;
        // client.broadcast.emit("user-status-change", {
          //   employeeId: data.employeeId,
          //   status: "offline",
          // });
          await Employee.findByIdAndUpdate(employeeId, {isOnline: false});
          this.io.emit("employee-status-change", { employeeId, status: "offline" });
      });

      client.on("disconnect", () => {
        console.log("User disconnected", client.id);
        const disconnectedUser = [...this.onlineUsers.entries()].find(
          ([_, socketId]) => socketId === client.id
        );

        if (disconnectedUser) {
          const [userId] = disconnectedUser;
          this.onlineUsers.delete(userId);
          client.broadcast.emit("user-status-change", {
            userId,
            status: "offline",
          });
        }
      });

      client.on("delete-message", (data) => {
        console.log(
          `Delete message request: ${data.messageId}, type: ${data.deleteType}`
        );

        // if (data.deleteType === "everyone") {
        this.io.to(data.conversationId).emit("messageDeleted", {
          messageId: data.messageId,
          deleteType: data.deleteType,
        });
        // }

        client.emit("delete-message-response", {
          status: "success",
          message: `Message deletion processed`,
        });
      });
    });
  }
}
