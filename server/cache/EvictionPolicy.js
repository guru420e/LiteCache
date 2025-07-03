import LiteCache from "./LiteCache.js";
import {cleanerThrottler} from "./CleanerThrottler.js";

const cache = new LiteCache();

const throttledCleaner = cleanerThrottler(cache);
throttledCleaner();

export default cache;
