import {useEffect, useState} from "react";
import axios from "axios";
import {NETWORK_URL, socket} from "../constants/network.js";
import {useKeyTTL} from "./usekeyTTL.js";
import {useSocket} from "./useSocket.js";

export function useKeys(initailKeys = [],initialLogs = []) {
    const [keys, setKeys] = useState(initailKeys);
    const [logs, setLogs] = useState(initialLogs);


    // initial fetching of keys
    // Will add the pagination and search bar in future
    // move this code to its separate hook
    // The hook will fetch the data optimally and This effect will
    // run when the keys update
    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const response = await axios.get(NETWORK_URL + "/cache");
                console.log("Fetched keys from server:", response.data);


                const newKeys = response.data.values.map((data) => ({
                    key: data.key,
                    value: data.value,
                    ttl: data.ttl,
                    evictionStatus: data.evictionStatus || "Active", // Default to "Active" if not provided
                }));

                setKeys(newKeys);
            } catch (error) {
                console.error("Error fetching keys:", error);
            }
        };

        fetchKeys();
    }, []);

    // Listen for socket events to update keys and logs
    useSocket({setKeys,setLogs});
    // Update the keys every second for TTL countdown
    useKeyTTL({keys, setKeys});

    return {keys, setKeys,logs, setLogs};
}