import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AddKeyForm from "./components/AddKeyForm";
import KeyList from "./components/KeyList";
import EvictionLogPanel from "./components/EvictionLogPanel";
import CacheSizeWidget from "./components/CacheSizeWidget";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

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

  const handleAddKey = (newKey) => {
    setKeys((prevKeys) => [...prevKeys, newKey]);
    setCacheStats((prev) => ({
      ...prev,
      totalItems: prev.totalItems + 1,
    }));
    setLogs((prevLogs) => [
      ...prevLogs,
      `[${new Date().toLocaleTimeString()}] ✅ Key '${
        newKey.key
      }' added to cache`,
    ]);
  };

  const handleDeleteKey = (keyToDelete) => {
    setKeys((prevKeys) => prevKeys.filter((key) => key.key !== keyToDelete));
    setCacheStats((prev) => ({
      ...prev,
      totalItems: prev.totalItems - 1,
    }));
    setLogs((prevLogs) => [
      ...prevLogs,
      `[${new Date().toLocaleTimeString()}] ✅ Key '${keyToDelete}' manually deleted`,
    ]);
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
          {activeTab === "keys" && <h1>Hello world</h1>}
        </main>
      </div>
    </div>
  );
}

export default App;
