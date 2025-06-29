const EvictionLogPanel = ({ logs, isSubscribed, onToggleSubscription }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-6 pb-0">
        <h2 className="text-xl font-semibold">Eviction Logs</h2>
        <div className="space-x-2">
          {isSubscribed ? (
            <button
              onClick={onToggleSubscription}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Unsubscribe
            </button>
          ) : (
            <button
              onClick={onToggleSubscription}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Subscribe to Logs
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs available</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="py-1">
                {log.includes('🔥') || log.includes('❌') ? (
                  <span className="text-red-600">{log}</span>
                ) : log.includes('✅') ? (
                  <span className="text-green-600">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default EvictionLogPanel;