import { io } from "socket.io-client";

// Replace with your backend URL
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("✅ Connected to server with ID:", socket.id);
});

// Listen for eviction event from the server
socket.on("eviction", (data) => {
  console.log("🚨 Evicted key:", data);
});

// Optional: emit an event if your server listens for any
// socket.emit("someEvent", payload);

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
