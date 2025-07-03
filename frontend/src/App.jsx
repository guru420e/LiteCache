import {
  Navbar,
  Sidebar,
  AddKeyForm,
  KeyList,
  EvictionLogPanel,
  CacheSizeWidget,
  useCacheStats,
  useKeys,
  handleAddKeyHandler,
  handleDeleteKeyHandler,
  keysAndLogsWrapper,
  useState,
  useCallback
} from "./imports";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // keep the dummy data for keys, logs, and cache stats
  // This will be replaced with data fetched from the server
  // or updated via socket events
  // This is just for initial rendering and testing purposes

  const {keys,setKeys,logs,setLogs} = useKeys([

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
  ],[
    "[12:04:33] ✅ Key 'user1' evicted due to TTL expiry",
    "[12:05:10] ✅ Key 'temp' manually deleted",
    "[12:06:45] ✅ Key 'session' evicted due to TTL expiry",
    "[12:07:20] ✅ Key 'cache' manually deleted",
  ])

  const [isSubscribed, setIsSubscribed] = useState(false);

  const cacheStats = useCacheStats();

  const handleAddKey = keysAndLogsWrapper(handleAddKeyHandler,{setKeys,setLogs,keys});
  const handleDeleteKey = keysAndLogsWrapper(handleDeleteKeyHandler,{setKeys,setLogs});

  // eviction panel may have 10000's of entries, so we should not re-render it
  const toggleSubscription = useCallback(()=>{
    setIsSubscribed((!isSubscribed));
  },[isSubscribed])

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
