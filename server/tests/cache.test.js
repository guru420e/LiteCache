import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import LiteCache from "../cache/Cache.js"; // adjust path if needed

describe("LiteCache", () => {
  let cache;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new LiteCache();
    cache.limit = 2; // set small limit to test eviction
  });

  it("adds and retrieves a key", () => {
    cache.set("a", "apple", 5000);
    const result = cache.get("a");
    expect(result.value).toBe("apple");
  });

  it("returns null if key expired", () => {
    cache.set("a", "apple", 1000);
    vi.advanceTimersByTime(1500);
    const result = cache.get("a");
    expect(result).toBeNull();
  });

  it("updates value and TTL on re-set", () => {
    cache.set("a", "apple", 1000);
    vi.advanceTimersByTime(500);
    cache.set("a", "avocado", 2000);
    const result = cache.get("a");
    expect(result.value).toBe("avocado");
    expect(result.expiresAt - Date.now()).toBeGreaterThan(1400); // updated TTL
  });

  it("evicts least recently used key when limit exceeded", () => {
    cache.set("a", "apple", 5000);
    cache.set("b", "banana", 5000);
    cache.get("a"); // make 'a' most recently used
    cache.set("c", "cherry", 5000); // should evict 'b'

    expect(cache.get("a").value).toBe("apple");
    expect(cache.get("b")).toBeNull(); // evicted
    expect(cache.get("c").value).toBe("cherry");
  });

  it("does not add a key with ttl <= 0", () => {
    cache.set("invalid", "zero", 0);
    expect(cache.get("invalid")).toBeNull();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
