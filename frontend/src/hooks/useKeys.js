import {useEffect, useState} from "react";
import axios from "axios";
import {NETWORK_URL, socket} from "../constants/network.js";

export function useKeys(initailKeys = [],initialLogs = []) {
    const [keys, setKeys] = useState(initailKeys);
    const [logs, setLogs] = useState(initialLogs);


    // initial fetching of keys
    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const response = await axios.get(NETWORK_URL + "/cache");
                console.log("Fetched keys from server:", response.data);

                // setKeys(response.data);

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


    useEffect(() => {

        const handleConnect = () => {
            console.log("Connected to server via socket.io");
        };

        const handleEvictions = (info) => {
            console.log("Eviction event received:", info);

            const set = new Set(info.data.map((val) => val.key));

            const newLogs = info.data.map(
                (data) =>
                    `[${new Date().toLocaleTimeString()}] ❌ Key '${
                        data.key
                    }' Evicted due to ${data.reason}`
            );

            setKeys((prevKeys) => prevKeys.filter((key) => !set.has(key.key)));
            setLogs((prevLogs) => [...prevLogs, ...newLogs]);
        };

        const handleEviction = (info) => {
            console.log("Eviction event received:", info);

            setKeys((prevKeys) =>
                prevKeys.filter((key) => key.key !== info.data.key)
            );
            setLogs((prevLogs) => [
                ...prevLogs,
                `[${new Date().toLocaleTimeString()}] ❌ Key '${
                    info.data.key
                }' Evicted due to ${info.data.reason}`,
            ]);
        };
        socket.on("connect", handleConnect);
        socket.on("evictions", handleEvictions);
        socket.on("eviction", handleEviction);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("evictions", handleEvictions);
            socket.off("eviction", handleEviction);
        };
    }, []);


    // Update the keys every seconds for TTL countdown
    useEffect(() => {
        console.log("Setting up TTL countdown for keys...");
        const interval = setInterval(() => {
            setKeys((prevKeys) =>
                prevKeys.map((key) => {
                    if (key.ttl > 0) {
                        return { ...key, ttl: key.ttl - 1 };
                    }
                    return key;
                })
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    return {keys, setKeys,logs, setLogs};
}