import axios from "axios";
import {useEffect, useState} from "react";
import {NETWORK_URL} from "../constants/network.js";

export default function useCacheStats() {

    const [cacheStats, setCacheStats] = useState({
        totalItems: 0,
        memoryUsed: "0MB",
    });

   useEffect(() => {
       let intervalId;
       async function fetchStats() {
           console.log("Fetching cache stats...");
           try {
               const { data } = await axios.get(NETWORK_URL + "/cache/stats");
               setCacheStats({
                   totalItems: data.items,
                   memoryUsed: data.memoryUsage,
               });
           } catch (err) {
               console.error("Error fetching stats:", err);
           }
       }

        intervalId = setInterval(fetchStats, 5000);

       return ()=> clearInterval(intervalId);

   },[]) ;
    return cacheStats;
}