import express from "express"
import {deleteKey, getAllKeys, getCacheStats, getKey, setCache} from "../controllers/cacheController.js";

const router = express.Router();

//This route will get All the keys in cache
router.get("/", getAllKeys);

// This set the Cache
router.post("/set", setCache);

// This will get a particular key in cache
router.get("/get/:key", getKey);

router.delete("/delete/:key", deleteKey);

// This route will get the the stats of the cache
router.get("/stats", getCacheStats);


export default router;
