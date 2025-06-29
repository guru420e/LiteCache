import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AddKeyForm from './components/AddKeyForm';
import KeyList from './components/KeyList';
import EvictionLogPanel from './components/EvictionLogPanel';
import CacheSizeWidget from './components/CacheSizeWidget';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [keys, setKeys] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    totalItems: 0,
    memoryUsed: '0 KB'
  });

  // Mock data for initial state
  useEffect(() => {
    // TODO: Replace with actual API call to fetch initial data
    const mockKeys = [
      { key: 'user:1', value: '{"name":"John"}', ttl: 300, evictionStatus: 'active' },
      { key: 'config:theme', value: 'light', ttl: 1800, evictionStatus: 'active' },
      { key: 'temp:session', value: 'abc123', ttl: 60, evictionStatus: 'expiring' }
    ];
    
    const mockLogs = [
      '[12:04:33] 🔥 Key \'user1\' evicted due to TTL expiry',
      '[12:05:10] ❌ Key \'temp\' manually deleted'
    ];
    
    setKeys(mockKeys);
    setLogs(mockLogs);
    setCacheStats({ totalItems: mockKeys.length, memoryUsed: '2.4 KB' });
  }, []);

  // Mock TTL countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setKeys(prevKeys => prevKeys.map(key => {
        if (key.ttl > 0) {
          return { ...key, ttl: key.ttl - 1 };
        }
        return key;
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleAddKey = (newKey) => {
    // TODO: Replace with API call to add key to cache
    setKeys(prevKeys => [...prevKeys, newKey]);
    setCacheStats(prev => ({
      ...prev,
      totalItems: prev.totalItems + 1
    }));
    setLogs(prevLogs => [
      ...prevLogs,
      `[${new Date().toLocaleTimeString()}] ✅ Key '${newKey.key}' added to cache`
    ]);
  };

  const handleDeleteKey = (keyToDelete) => {
    // TODO: Replace with API call to delete key from cache
    setKeys(prevKeys => prevKeys.filter(key => key.key !== keyToDelete));
    setCacheStats(prev => ({
      ...prev,
      totalItems: prev.totalItems - 1
    }));
    setLogs(prevLogs => [
      ...prevLogs,
      `[${new Date().toLocaleTimeString()}] ❌ Key '${keyToDelete}' manually deleted`
    ]);
  };

  const toggleSubscription = () => {
    // TODO: Implement actual WebSocket subscription/unsubscription
    setIsSubscribed(!isSubscribed);
    setLogs(prevLogs => [
      ...prevLogs,
      `[${new Date().toLocaleTimeString()}] ${!isSubscribed ? '🔔 Subscribed to logs' : '🔕 Unsubscribed from logs'}`
    ]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
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
          {/* Other tabs can be added here */}
        </main>
      </div>
    </div>
  );
}

export default App;