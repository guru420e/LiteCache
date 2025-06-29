const CacheSizeWidget = ({ stats }) => {
  return (
    <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-medium text-gray-700">Cache Size</div>
      <div className="mt-1">
        <div className="text-lg font-semibold">{stats.totalItems} items</div>
        <div className="text-sm text-gray-500">{stats.memoryUsed}</div>
      </div>
    </div>
  );
};

export default CacheSizeWidget;