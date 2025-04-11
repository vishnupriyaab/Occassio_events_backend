import { Server } from "socket.io";
import { emplChatController } from "../controllers/management/employeeController/chatController";
import { userChatController } from "../controllers/management/userController/chatController";

export class SocketManager {
  private io: Server;

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

      client.on("disconnect", () => {
        console.log("User disconnected", client.id);
      });
    });
  }
}
