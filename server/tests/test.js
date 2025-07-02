import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cache from "../cache/Cache.js"; // Your LiteCache instance

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all for test purposes
  },
});

// Attach socket to cache and set a low limit for LRU testing
cache.setSocket(io);
cache.setLimit(3); // Small limit for LRU demonstration

// Setup socket handlers
io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Handle client SET request
  socket.on("set", ({ key, value, ttl }) => {
    console.log(`📥 Setting key: "${key}", TTL: ${ttl}ms`);
    cache.set(key, value, ttl);
  });

  // Handle client request for snapshot
  socket.on("snapshot", () => {
    const snapshot = {};
    for (const [key, node] of cache.map.entries()) {
      snapshot[key] = {
        value: node.value,
        expiresAt: node.expiresAt,
      };
    }

    socket.emit("snapshot", {
      type: "snapshot",
      data: snapshot,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// Start server
httpServer.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
});
