const KeyList = ({ keys, onDeleteKey }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm overflow-hidden">
      <h2 className="text-xl font-semibold p-6 pb-4">Key List</h2>
      <div className="overflow-x-auto px-6 pb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining TTL</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eviction Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keys.map((item) => (
              <tr key={item.key}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.key}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.value}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.ttl}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.evictionStatus.toLowerCase() === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.evictionStatus.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => onDeleteKey(item.key)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default KeyList;