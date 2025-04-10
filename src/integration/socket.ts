import { Server } from "socket.io";
import { chatController } from "../controllers/management/chatController";

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
        console.log(`Message from user ${data.user}: ${data.message}, ${data.userId}, ${data.conversationId}`);
        await chatController.handleNewUserMessage(
          this.io,
          data.conversationId,
          data.message,
          data.userId
        );

        // this.io.in(data.conversationId).emit("userMessage", {
        //   senderId: data.userId,
        //   senderType: "user",
        //   message: data.message,
        //   timestamp: new Date(), 
        // });
      });

      client.on("employee-message", async (data) => {
        console.log(`Employee message from ${data.user}: ${data.message}`);
        await chatController.handleEmployeeMessage(
          this.io,
          data.conversationId,
          data.message,
          data.employeeId
        );

        this.io.to(data.conversationId).emit("employeeMessage", {
          //   user: data.user,
          //   message: data.message,
          //   timestamp: new Date(),
          senderId: data.employeeId,
          senderType: "employee",
          message: data.message,
          timestamp: new Date(),
        });
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

      client.on("disconnect", () => {
        console.log("User disconnected", client.id);
      });
    });
  }
}
