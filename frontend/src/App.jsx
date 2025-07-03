import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AddKeyForm from "./components/AddKeyForm";
import KeyList from "./components/KeyList";
import EvictionLogPanel from "./components/EvictionLogPanel";
import CacheSizeWidget from "./components/CacheSizeWidget";
import axios from "axios";
import { NETWORK_URL } from "./constants/network";
import { socket } from "./constants/network";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // keep the dummy data for keys, logs, and cache stats
  // This will be replaced with data fetched from the server
  // or updated via socket events
  // This is just for initial rendering and testing purposes
  const [keys, setKeys] = useState([
    { key: "user1", value: "John Doe", ttl: 455, evictionStatus: "Active" },
    {
      key: "temp",
      value: "Temporary Data",
      ttl: 758,
      evictionStatus: "Pending",
    },
    {
      key: "session",
      value: "Session Data",
      ttl: 205,
      evictionStatus: "Active",
    },
  ]);

  const [logs, setLogs] = useState([
    "[12:04:33] ✅ Key 'user1' evicted due to TTL expiry",
    "[12:05:10] ✅ Key 'temp' manually deleted",
    "[12:06:45] ✅ Key 'session' evicted due to TTL expiry",
    "[12:07:20] ✅ Key 'cache' manually deleted",
  ]);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    totalItems: 120,
    memoryUsed: "256MB",
  });

  useEffect(() => {
    async function setMemoryUseage() {
      try {
        const response = await axios.get(NETWORK_URL + "/cache/stats");
        const data = response.data;
        setCacheStats({
          totalItems: data.items,
          memoryUsed: data.memoryUsage,
        });
      } catch (err) {
        console.error("Error setting memory usage:", err);
      }
    }

    setInterval(setMemoryUseage, 5000);
  }, []);

  useEffect(() => {
    // Fetch initial keys from the server
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

  // Mock TTL countdown
  useEffect(() => {
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

  const updateKey = (updatedKey, value, ttl) => {
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

  const addKey = (newKey) => {
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

  const handleAddKey = async (newKey) => {
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

        updateKey(newKey.key, newKey.value, newKey.ttl);
      } // If the key does not exist, add it
      else if (!existingKey) {
        addKey(newKey);
      }

    } catch (err) {
      console.log("Error adding key:", keys, err);
    }
  };

  const handleDeleteKey = async (keyToDelete) => {
    console.log(keyToDelete);
    try {
      const res = await axios.delete(
        NETWORK_URL + "/cache/delete/" + keyToDelete
      );
      console.log("Response from server:", res);

      setKeys((prevKeys) => prevKeys.filter((key) => key.key !== keyToDelete));
      setCacheStats((prev) => ({
        ...prev,
        totalItems: prev.totalItems - 1,
      }));
      setLogs((prevLogs) => [
        ...prevLogs,
        `[${new Date().toLocaleTimeString()}] ✅ Key '${keyToDelete}' manually deleted`,
      ]);
    } catch (err) {
      console.error("Error deleting key:", err);
    }
  };

  const toggleSubscription = () => {
    setIsSubscribed(!isSubscribed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 space-y-6">
          {activeTab === "dashboard" && (
            <>
              <AddKeyForm onAddKey={handleAddKey} />
              <KeyList keys={keys} onDeleteKey={handleDeleteKey} />
              <EvictionLogPanel
                logs={logs}
                isSubscribed={isSubscribed}
                onToggleSubscription={toggleSubscription}
              />
              <CacheSizeWidget stats={cacheStats} />
            </>
          )}
          {activeTab === "keys" && <h1>...(Upcoming)</h1>}
        </main>
      </div>
    </div>
  );
}

export default App;
