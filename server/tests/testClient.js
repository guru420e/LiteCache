import { io } from "socket.io-client";

console.log("🛰 Connecting to server...");
const socket = io("http://localhost:3000");

let batchEvictions = [];
let singleEvictions = [];

socket.on("connect", () => {
  console.log("✅ Connected with ID:", socket.id);

  // TTL Expiry Test (batched)
  console.log("⏳ [TTL Test] Setting multiple keys with TTL = 1000ms...");
  socket.emit("set", { key: "a", value: "alpha", ttl: 1000 });
  socket.emit("set", { key: "b", value: "bravo", ttl: 1000 });
  socket.emit("set", { key: "c", value: "charlie", ttl: 1000 });
  socket.emit("set", { key: "d", value: "delta", ttl: 1000 });

  // Race condition test (rapid overwrites)
  setTimeout(() => {
    console.log("🚦 [Race Test] Performing rapid updates on key 'race-key'...");
    socket.emit("set", { key: "race-key", value: "one", ttl: 5000 });
    socket.emit("set", { key: "race-key", value: "two", ttl: 5000 });
    socket.emit("set", { key: "race-key", value: "three", ttl: 5000 });
  }, 200);

  // LRU test (limited to 3)
  setTimeout(() => {
    console.log("📦 [LRU Test] Filling cache to exceed limit...");
    socket.emit("set", { key: "x", value: "x-ray", ttl: 5000 });
    socket.emit("set", { key: "y", value: "yankee", ttl: 5000 });
    socket.emit("set", { key: "z", value: "zulu", ttl: 5000 });
    socket.emit("set", { key: "extra", value: "overflow", ttl: 5000 }); // should evict LRU
  }, 1500);

  // Get snapshot after everything
  setTimeout(() => {
    console.log("📦 Requesting final snapshot...");
    socket.emit("snapshot");
  }, 4000);

  // Disconnect after results
  setTimeout(() => {
    console.log("❌ Disconnecting client...");
    socket.disconnect();
  }, 5000);
});

// Catch TTL batch eviction
socket.on("evictions", (batch) => {
  console.log("🚨 TTL Batch Evictions:");
  batch.data.forEach(({ key, reason }) => {
    batchEvictions.push(key);
    console.log(`   🔥 Key: "${key}", Reason: ${reason}`);
  });
});

// Catch LRU/Single eviction
socket.on("eviction", (ev) => {
  singleEvictions.push(ev.data.key);
  console.log(`🚨 LRU/Single Eviction: 🔥 "${ev.data.key}" - ${ev.data.reason}`);
});

// Get final map snapshot
socket.on("snapshot", (state) => {
  console.log("\n📊 Final Cache State:");
  for (const key in state.data) {
    const { value, expiresAt } = state.data[key];
    console.log(`🧩 ${key} = "${value}" (expires in ${Math.ceil((expiresAt - Date.now()) / 1000)}s)`);
  }

  console.log("\n📦 Final Evicted Keys:");
  console.log(" - Batches:", batchEvictions);
  console.log(" - Singles:", singleEvictions);
});
