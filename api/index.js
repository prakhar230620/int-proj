require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const rateLimit = require("express-rate-limit");

const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app);

// Setup Socket.io for Real-time Collaboration
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? true
      : ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("join-note", (noteId) => {
    socket.join(noteId);
    console.log(`User joined note room: ${noteId}`);
  });

  socket.on("send-changes", (noteId, changes) => {
    socket.to(noteId).emit("receive-changes", changes);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// Connect Database
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Rate Limiting (Security)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

// Init Middleware
app.use(express.json({ extended: false }));

// CORS - allow requests from frontend
app.use(cors({
  origin: process.env.NODE_ENV === "production"
    ? true
    : ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

// Define Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/folders", require("./routes/folders"));
app.use("/api/ai", require("./routes/ai"));

const PORT = process.env.SERVER_PORT || 5000;

if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
