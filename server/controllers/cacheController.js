import cache from "../cache/EvictionPolicy.js";
import { memoryUsage } from "../cache/MemoryUsage.js";

export const getAllKeys = (req, res) => {
    const values = cache.getAll();

    res.json({
        values,
    });
}

export const setCache = (req, res) => {

    const { key, value, ttl } = req.body;
    if (!key || !value || !ttl) {
        return res.status(400).json({ error: "Key, value, and TTL are required." });
    }

    cache.set(key, value, ttl);
    res.json({ message: `Key "${key}" set with TTL ${ttl} seconds.` });
}

export const getKey = (req, res) => {
    const { key } = req.params;
    const result = cache.get(key);
    if (result) {
        return res.json({
            result,
            found: true,
        });
    }

    res.json({
        found: false,
    });
}


export const deleteKey = (req, res) => {
    const { key } = req.params;
    const result = cache.delete(key);
    if (result) {
        return res.json({
            message: `Key "${key}" deleted successfully.`,
        });
    }
    res.status(404).json({
        error: `Key "${key}" not found.`,
    });
}

export const getCacheStats = (req, res) => {
    res.json(memoryUsage());
}




