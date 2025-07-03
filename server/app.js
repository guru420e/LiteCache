import express from "express";
import cors from "cors";
import cache from "./cache/Cache.js";
import { Server as socketIOserver } from "socket.io";
import http from "http";
import { memoryUsage } from "./cache/MemoryUsage.js";

const app = express();

const server = http.createServer(app);

const io = new socketIOserver(server, {
  cors: {
    origin: "*", // Allow all origins for testing purposes
  },
});

// Setting the initail configuration for the cache
// Other wise default values will be used limit : 1000 and io: null

cache.config({
  limit: 5, // Set a small limit for testing LRU eviction
  io,
});

io.on("connection", (socket) => {
  console.log("📡 A client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

app.use(
  cors({
    origin: "*", // Allow all origins for testing purposes
  })
);

app.use(express.json());

app.get("/cache", (req, res) => {
  const values = cache.getAll();

  res.json({
    values,
  });
});

app.post("/cache/set", (req, res) => {
  const { key, value, ttl } = req.body;
  if (!key || !value || !ttl) {
    return res.status(400).json({ error: "Key, value, and TTL are required." });
  }

  cache.set(key, value, ttl);
  res.json({ message: `Key "${key}" set with TTL ${ttl} seconds.` });
});

app.get("/cache/get/:key", (req, res) => {
  const { key } = req.params;
  const result = cache.get(key);
  if (result) {
    return res.json({
      result,
      found: true,
    });
  }

  res.json({
    found: false,
  });
});

app.delete("/cache/delete/:key", (req, res) => {
  const { key } = req.params;
  const result = cache.delete(key);
  if (result) {
    return res.json({
      message: `Key "${key}" deleted successfully.`,
    });
  }
  res.status(404).json({
    error: `Key "${key}" not found.`,
  });
});

app.get("/cache/stats", (req, res) => {
  res.json(memoryUsage());
});

server.listen(3000, () => {
  console.log("🚀 Server is running at http://localhost:3000");
});
