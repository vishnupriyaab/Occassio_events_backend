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
    origin: 'https://api.occasio.sbs',
    methods: ["GET", "POST"],
    credentials: true
  }
});

new SocketManager(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server is runninggg...");
});