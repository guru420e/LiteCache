const EvictionLogPanel = ({ logs, isSubscribed, onToggleSubscription }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 pb-4">
        <h2 className="text-xl font-semibold">Eviction Log Panel</h2>
        <div className="space-x-2">
          <button
            onClick={onToggleSubscription}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              !isSubscribed 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Subscribe to Logs
          </button>
          <button
            onClick={onToggleSubscription}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isSubscribed 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unsubscribe
          </button>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 font-mono text-sm space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="text-green-600">{log}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EvictionLogPanel;