import { config } from "dotenv";
config();
import app from "./config/app";
import connectDB from "./config/db";
import { createServer } from "http";
import { Server } from "socket.io";
import { SocketManager } from "./integration/socket";

connectDB();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ["GET", "POST"],
    credentials: true
  }
});

new SocketManager(io);

const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log("Server is runninggg...");
// });
server.listen(PORT, () => {
  console.log("Server is runninggg...");
});