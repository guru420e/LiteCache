import { log } from "console";
import Heap from "./Heap.js";
import List from "./List.js";
import Node from "./Node.js";

class LiteCache {
  constructor(io = null) {
    this.map = new Map(); // Map to store key-value pairs
    this.heap = new Heap(); // Min-heap to manage expiration times
    this.list = new List();
    this.limit = 1000; // Default limit, can be adjusted
    this.io = io; // Socket.io instance for emitting events
  }

  config(options) {
    if (options.limit) {
      this.setLimit(options.limit);
    }
    if (options.io) {
      this.setSocket(options.io);
    }
  }

  getSize() {
    return this.map.size;
  }

  getAll() {
    const allEntries = [];
    for (const [key, node] of this.map.entries()) {
      if (node.expiresAt > Date.now()) {
        allEntries.push({
          key: key,
          value: node.value,
          ttl: Math.floor((node.expiresAt - Date.now()) / 1000), // Convert ms to seconds
          evictionStatus: "active",
        });
      }
    }
    return allEntries;
  }

  delete(key) {
    if (!this.map.has(key)) {
      return null;
    }
    const node = this.map.get(key);
    this.remove(key, node);
    return node;
  }

  // call only when the node is present in the list and heap
  remove(key, node) {
    if (!this.map.has(key) || !node) {
      return;
    }
    this.map.delete(key);
    this.heap.remove(node);
    this.list.remove(node);
  }

  emitEviction(key, reason) {
    if (this.io) {
      console.log(
        `from emitEviction Emitting eviction for key: ${key}, reason: ${reason}`
      );
      this.io.emit("eviction", {
        type: "eviction",
        data: {
          key: key,
          reason: reason || "",
        },
      });
    }
  }

  emitBatchEviction(batch) {
    if (this.io) {
      console.log(`from emitBatchEviction Emitting batch eviction`);
      this.io.emit("evictions", {
        type: "evictions",
        data: batch,
      });
    }
  }

  addNode(node) {
    this.map.set(node.key, node);
    this.heap.add(node);
    this.list.addToHead(node);
  }

  set(key, value, ttl = 0) {
    if (ttl <= 0) return;
    if (this.map.has(key)) {
      this.remove(key, this.map.get(key));

      this.set(key, value, ttl);
    }

    if (this.limit <= this.map.size) {
      const evictedNode = this.list.removeLast();

      if (evictedNode) {
        // Will not work as node is deleted from the list
        // list doesn't have map reference it just delete node
        // this.remove(evictedNode.key, evictedNode);

        this.map.delete(evictedNode.key);
        this.heap.remove(evictedNode);

        this.emitEviction(evictedNode.key, "LRU Eviction");

        // Emit the evicted node to the frontend through socket
        // socket.emit('evicted', { key: evictedNode.key, value: ev
      }
    }

    this.addNode(
      new Node({
        key: key,
        value: value,
        expiresAt: Date.now() + ttl * 1000, // Convert seconds to milliseconds
      })
    );
  }

  get(key) {
    if (!this.map.has(key)) {
      return null;
    }

    const node = this.map.get(key);

    if (node.expiresAt < Date.now()) {
      // clean up code responsibility is of cleaner
      return null;
    }

    this.list.remove(node);
    this.list.addToHead(node);

    return {
      key: key,
      value: node.value,
      expiresAt: node.expiresAt,
    };
  }

  setSocket(io) {
    this.io = io;
  }

  setLimit(limit) {
    this.limit = limit;
  }
}

const cache = new LiteCache();
const batch = [];

function cleanerThrottler(cache) {
  let interval = 500;

  return () => {
    setTimeout(function fun() {
      while (
        batch.length <= 100 &&
        cache.heap.getSize() > 0 &&
        cache.heap.peek().expiresAt < Date.now()
      ) {
        const node = cache.heap.pop();
        cache.remove(node.key, node);
        batch.push({
          key: node.key,
          reason: "TTL Expiration",
        });
      }

      const top = cache.heap.peek();
      console.log(batch);

      if (batch.length > 0) {
        console.log(
          `from cleanerThrottler Emitting batch eviction for ${batch.length} items`
        );
        cache.emitBatchEviction(batch);
        batch.length = 0;
      } else if (top && top.expiresAt > Date.now()) {
        interval = Math.max(500, top.expiresAt - Date.now());
      } else interval += 500;

      interval = Math.min(interval, 5000);
      setTimeout(fun, interval);
    }, interval);
  };
}

const throttledCleaner = cleanerThrottler(cache);
throttledCleaner();

export default cache;
