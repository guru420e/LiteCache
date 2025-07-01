import { describe, it, expect } from "vitest";
import Heap from "../cache/Heap.js";

describe("Heap", () => {
  it("adds and peeks correctly", () => {
    const heap = new Heap();
    heap.add({ key: "a", expiresAt: 5000 });
    heap.add({ key: "b", expiresAt: 3000 });
    heap.add({ key: "c", expiresAt: 4000 });

    expect(heap.peek().key).toBe("b");
  });

  it("removes correctly", () => {
    const heap = new Heap();
    heap.add({ key: "a", expiresAt: 5000 });
    heap.add({ key: "b", expiresAt: 3000 });
    heap.remove({
      key: "b",
      expiresAt: 3000,
    });

    expect(heap.peek().key).toBe("a");
  });

  it("pops in correct order", () => {
    const heap = new Heap();
    heap.add({ key: "a", expiresAt: 5000 });
    heap.add({ key: "b", expiresAt: 3000 });
    heap.add({ key: "c", expiresAt: 4000 });

    expect(heap.pop().key).toBe("b");
    expect(heap.pop().key).toBe("c");
    expect(heap.pop().key).toBe("a");
    expect(heap.pop()).toBe(null);
  });
});
