import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import LiteCache from "./cache/Cache.js"; // your cache class

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // adjust in production
  },
});

const cache = new LiteCache(io); // pass socket to cache
cache.limit = 2;

io.on("connection", (socket) => {
  console.log("⚡ A client connected:", socket.id);

  // Put eviction-producing logic inside connection block
  setTimeout(() => {
    cache.set("a", "apple", 5000);
    cache.set("b", "banana", 5000);
    cache.get("a"); // Make 'a' most recently used
    cache.set("c", "cherry", 5000); // Should evict 'b'

    console.log("🍒 Final cache:", cache.get("b")); // This should return null
  }, 1000); // Add delay to ensure connection is stable
});

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
