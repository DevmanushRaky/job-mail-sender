require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const connectDb = require("./database/conn.js");
const mailRoute = require("./routes/MailRoute.js");
const hrEmailRoutes = require("./routes/HrMailRoute.js");

const app = express();
const server = http.createServer(app); // HTTP server for API & WebSockets

// ✅ Setup CORS for API & WebSockets
const corsOptions = {
  origin: ["https://jobmailsender.netlify.app", "http://localhost:5173"], // Allowed frontends
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware for Express API
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files

// ✅ Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Serve "index.html" on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Initialize Socket.io with the same CORS settings
const io = new Server(server, { cors: corsOptions });

// ✅ Store io instance globally so other files can use it
app.locals.io = io;
app.locals.stopMailSending = false;

// ✅ Handle WebSocket Connections
io.on("connection", (socket) => {
  console.log(`📡 New client connected: ${socket.id}`);

  socket.on("stopMailSending", () => {
    console.log("🚨 Stop signal received from frontend!");
    app.locals.stopMailSending = true; // ✅ Update stop flag in `app.locals`
    io.emit("progress", { message: "🚫 Email sending stopped.", status: "stopped" });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});



// ✅ API Routes
app.use("/api/v1/hr-emails", hrEmailRoutes);
app.use("/api/v1/user-emails", mailRoute);

// ✅ 404 Error Handler (For Undefined Routes)
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "error.html"));
});

// ✅ Global Error Handler (For Any Other Errors)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).sendFile(path.join(__dirname, "public", "error.html"));
});

const PORT = process.env.PORT;

// ✅ Connect to MongoDB and Start Server
connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ Database connection error:", error);
  });
