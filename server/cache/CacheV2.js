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

  emitAll(data, reason = "") {
    if (this.io) {
      console.log(`Emitting all data with reason: ${reason}`);
      this.io.emit("cacheDump", {
        type: "cacheDump",
        data: data,
        reason: reason,
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
        expiresAt: Date.now() + ttl,
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

const producer = new List();

function cleaner(cache) {
  const node = cache.heap.pop();
  cache.remove(node.key, node);
  producer.addToTail(node);
}

function cleanerThrottler(cache) {
  let interval = 500;

  return () => {
    setTimeout(function fun() {
      let start = Date.now();
      while (
        Date.now() - start < 500 &&
        cache.heap.size > 0 &&
        cache.heap.peek().expiresAt <= Date.now()
      ) {
        try {
          cleaner(cache);
          interval = 500; // Reset on cleanup
        } catch (e) {
          console.error("Cleaner failed:", e);
        }
      }

      const top = cache.heap.peek();

      if (top && top.expiresAt > Date.now()) {
        interval = top.expiresAt - Date.now();
      } else if (top) {
        interval = 500; // Reset to default if no valid top node
      } else interval += 500;

      setTimeout(fun, interval);
    }, interval);
  };
}

const throttledCleaner = cleanerThrottler(cache);
throttledCleaner();

const TTLEmitter = setInterval(() => {
  let start = Date.now();
  const consumer = [];
  while (Date.now() - start < 500 && producer.getSize() > 0) {
    const node = producer.removeFirst();
    if (node) {
      consumer.push({ key: node.key, reason: "TTL Expiration" });
    }
  }
  if (consumer.length > 0) cache.emitAll(consumer, "ttl Cache dump");
}, 1000);

export default cache;
