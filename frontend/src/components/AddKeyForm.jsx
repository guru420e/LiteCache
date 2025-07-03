import React, { useState } from 'react';

const AddKeyForm = ({ onAddKey }) => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [ttl, setTtl] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!key || !value || !ttl) return;

    const newKey = {
      key,
      value,
      ttl: parseInt(ttl),
      evictionStatus: 'Active'
    };

    onAddKey(newKey);
    setKey('');
    setValue('');
    setTtl('');
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Add Key</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter key"
            required
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter value"
            required
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">TTL (seconds)</label>
          <input
            type="number"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter TTL"
            required
          />
        </div>
        <div className="flex-1 min-w-[100px]">
          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default React.memo(AddKeyForm);
