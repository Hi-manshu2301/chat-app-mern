require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

const app = express();
const httpServer = createServer(app);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", ({ to, from, message }) => {
    const recipientSocketId = onlineUsers.get(to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("msg-receive", { from, message });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
