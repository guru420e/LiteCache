import { useState } from 'react';

const AddKeyForm = ({ onAddKey }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [ttl, setTtl] = useState(300); // Default 5 minutes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key || !value) return;
    
    const newKey = {
      key,
      value,
      ttl,
      evictionStatus: 'active'
    };
    
    onAddKey(newKey);
    setKey('');
    setValue('');
    setTtl(300);
  };

  return (
    <section className="mb-8 bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add Key</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Enter key"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Enter value"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TTL (seconds)</label>
            <select
              value={ttl}
              onChange={(e) => setTtl(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="60">1 minute</option>
              <option value="300">5 minutes</option>
              <option value="1800">30 minutes</option>
              <option value="3600">1 hour</option>
              <option value="86400">1 day</option>
              <option value="0">No expiration</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Key
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddKeyForm;