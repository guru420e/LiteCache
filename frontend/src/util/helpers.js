import axios from "axios";
import {NETWORK_URL} from "../constants/network.js";

export function keysAndLogsWrapper(handlerFn,context){
   return (data)=>{
       handlerFn(data,context);
   }
}

const addKey = (newKey,setKeys,setLogs) => {
  setKeys((prevKeys) => [
    ...prevKeys,
    {
      key: newKey.key,
      value: newKey.value,
      ttl: newKey.ttl,
      evictionStatus: "Active",
    },
  ]);
  setLogs((prevLogs) => [
    ...prevLogs,
    `[${new Date().toLocaleTimeString()}] ✅ Key '${
      newKey.key
    }' added to cache with value '${newKey.value}' and TTL ${newKey.ttl}`,
  ]);
};

const updateKey = (updatedKey, value, ttl,setKeys,setLogs) => {
    setKeys((prevKeys) =>
        prevKeys.map((key) =>
            key.key === updatedKey
                ? {
                    ...key,
                    value: value,
                    ttl: ttl,
                    evictionStatus: "Active",
                }
                : key
        )
    );
    setLogs((prevLogs) => [
        ...prevLogs,
        `[${new Date().toLocaleTimeString()}] ✅ Key '${updatedKey}' updated to value '${value}' with TTL ${ttl}`,
    ]);
};



export const handleAddKeyHandler = async (newKey,{setKeys,setLogs,keys}) => {
    try {
        const res = await axios.post(NETWORK_URL + "/cache/set", {
            key: newKey.key,
            value: newKey.value,
            ttl: newKey.ttl,
        });

        console.log("Response from server:", res);

        const checkResponse = await axios.get(
            NETWORK_URL + "/cache/get/" + newKey.key
        );

        console.log("Check response from server:", checkResponse);

        // Check if the key already exists in the local state
        const existingKey = keys.find((key) => key.key === newKey.key);
        if (existingKey) {
            // Update the existing key
            console.log(
                "updataing the value" + newKey.key,
                newKey.value,
                newKey.ttl
            );

            updateKey(newKey.key, newKey.value, newKey.ttl,setKeys,setLogs);
        } // If the key does not exist, add it
        else if (!existingKey) {
            addKey(newKey,setKeys,setLogs);
        }

    } catch (err) {
        console.log("Error adding key:", keys, err);
    }
}

export const handleDeleteKeyHandler = async (keyToDelete,{setKeys,setLogs}) => {
    console.log(keyToDelete);
    try {
        const res = await axios.delete(
            NETWORK_URL + "/cache/delete/" + keyToDelete
        );
        console.log("Response from server:", res);

        setKeys((prevKeys) => prevKeys.filter((key) => key.key !== keyToDelete));
        setLogs((prevLogs) => [
            ...prevLogs,
            `[${new Date().toLocaleTimeString()}] ✅ Key '${keyToDelete}' manually deleted`,
        ]);
    } catch (err) {
        console.error("Error deleting key:", err);
    }
};
