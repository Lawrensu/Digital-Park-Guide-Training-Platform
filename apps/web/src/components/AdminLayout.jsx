import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Training Modules', path: '/admin/modules', icon: '📚' },
    { name: 'Guide Management', path: '/admin/users', icon: '👥' },
    { name: 'AI Monitoring', path: '/admin/monitoring', icon: '🤖' },
    { name: 'System Security', path: '/admin/security', icon: '🛡️' },
    { name: 'Notifications', path: '/admin/notifications', icon: '🔔' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">🌿</div>
          {isSidebarOpen && <span className="font-serif font-bold text-xl tracking-tight">Admin CMS</span>}
        </div>

        <nav className="flex-grow mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-green-700 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-gray-400 hover:text-red-400 transition-colors"
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 text-xl">
            {isSidebarOpen ? '◀' : '▶'}
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 italic">Connected to FastAPI Backend</span>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold border border-green-200">
              AD
            </div>
          </div>
        </header>

        <div className="p-8 overflow-y-auto max-h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
