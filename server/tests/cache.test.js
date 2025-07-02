import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import cache from "../cache/Cache.js"; // adjust path if needed

let io, httpServer, clientSocket;
let evictionEvents = [];

describe("LiteCache with TTL, LRU, Socket, and Integrity", () => {
  beforeAll(async () => {
    const app = express();
    httpServer = createServer(app);
    io = new Server(httpServer, { cors: { origin: "*" } });

    await new Promise((res) => {
      httpServer.listen(3001, () => {
        cache.setSocket(io);
        cache.setLimit(3);
        res();
      });
    });

    evictionEvents = [];
    clientSocket = new Client("http://localhost:3001");
    clientSocket.on("eviction", (data) => evictionEvents.push(data));
  });

  afterAll(() => {
    clientSocket?.disconnect();
    io?.close();
    httpServer?.close();
  });

  test("✅ TTL expiry", async () => {
    cache.set("ttlKey", "value", 500); // 0.5s TTL
    expect(cache.get("ttlKey")?.value).toBe("value");

    await new Promise((res) => setTimeout(res, 600));
    expect(cache.get("ttlKey")).toBe(null);

    const evicted = evictionEvents.find((e) => e.data.key === "ttlKey");
    expect(evicted?.data.reason).toBe("TTL Expiration");
  });

  test("✅ LRU eviction", async () => {
    evictionEvents = [];

    cache.set("a", "alpha", 5000);
    cache.set("b", "beta", 5000);
    cache.set("c", "gamma", 5000);
    cache.get("a"); // 'a' becomes MRU
    cache.set("d", "delta", 5000); // should evict 'b'

    await new Promise((res) => setTimeout(res, 300)); // allow event to emit

    expect(cache.get("b")).toBe(null);
    expect(evictionEvents.some((e) => e.data.key === "b")).toBe(true);
  });

  test("✅ Socket emission", async () => {
    evictionEvents = [];

    cache.set("e", "echo", 300); // expires quickly
    await new Promise((res) => setTimeout(res, 2000));
    console.log("Eviction events:", evictionEvents);

    const evicted = evictionEvents.find((e) => e.data.key === "e");
    expect(evicted).toBeTruthy();
    expect(evicted.data.reason).toBe("TTL Expiration");
  });

  test("✅ Map integrity", () => {
    cache.set("x", "one", 1000);
    const node = cache.get("x");

    expect(node).not.toBeNull();
    expect(node.key).toBe("x");
    expect(node.value).toBe("one");
    expect(cache.map.has("x")).toBe(true);
  });

  test("✅ Race condition (concurrent set on same key)", async () => {
    evictionEvents = [];

    const p1 = Promise.resolve().then(() => cache.set("race", "v1", 2000));
    const p2 = Promise.resolve().then(() => cache.set("race", "v2", 2000));
    await Promise.all([p1, p2]);

    const node = cache.get("race");
    expect(["v1", "v2"]).toContain(node.value);
  });
});
