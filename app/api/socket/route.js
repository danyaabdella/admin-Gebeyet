import { Server } from "socket.io";
import { createServer } from "http";

export default function handler(res) {
  if (res.socket.server.io) {
    console.log("Socket.IO server already running");
  } else {
    const httpServer = createServer();
    const io = new Server(httpServer, {
      path: "/api/socket",
      cors: {
        origin: "*", // Adjust based on your frontend URL
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}