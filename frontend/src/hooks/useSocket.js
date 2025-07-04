import {socket} from "../constants/network.js";
import {useEffect} from "react";

export function useSocket({setKeys, setLogs }) {
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
    }, [setKeys, setLogs]);


}