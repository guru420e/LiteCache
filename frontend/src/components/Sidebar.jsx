const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'keys', name: 'Keys', icon: '🔑' },
    { id: 'stats', name: 'Stats', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm p-4">
      <nav>
        <ul className="space-y-2">
          {tabs.map(tab => (
            <li key={tab.id}>
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100'}`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;