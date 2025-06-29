const CacheSizeWidget = ({ stats }) => {
  return (
    <div className="fixed bottom-6 right-6 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-medium text-gray-700 mb-1">Cache Size</div>
      <div className="text-lg font-semibold">
        Total Items: {stats.totalItems}
      </div>
      <div className="text-sm text-gray-700">
        Memory Used: {stats.memoryUsed}
      </div>
    </div>
  );
};

export default CacheSizeWidget;
