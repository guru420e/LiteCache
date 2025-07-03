import cache from "./Cache.js";

export function memoryUsage() {
  const memoryUsage = process.memoryUsage();
  const totalMemoryMB = (memoryUsage.rss / 1024 / 1024).toFixed(2) + " MB";

  return {
    memoryUsage: totalMemoryMB,
    items: cache.getSize(),
  };
}
