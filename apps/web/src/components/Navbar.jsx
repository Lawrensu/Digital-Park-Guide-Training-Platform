import { Link, NavLink, useNavigate } from 'react-router-dom';

// Navigation bar component displayed at the top
export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    const confirmSignOut = window.confirm('Are you sure you want to sign out?');
    if (confirmSignOut) {
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">🌿</span>
            </div>
            <span className="font-serif font-bold text-xl text-green-700 hidden sm:inline">
              Park Guide Academy
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `font-medium py-2 px-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-green-700 border-green-700'
                    : 'text-gray-700 border-transparent hover:text-green-700'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `font-medium py-2 px-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-green-700 border-green-700'
                    : 'text-gray-700 border-transparent hover:text-green-700'
                }`
              }
            >
              Courses
            </NavLink>
            <NavLink
              to="/certificates"
              className={({ isActive }) =>
                `font-medium py-2 px-1 border-b-2 transition-colors ${
                  isActive
                    ? 'text-green-700 border-green-700'
                    : 'text-gray-700 border-transparent hover:text-green-700'
                }`
              }
            >
              Certificates
            </NavLink>
          </div>

          {/* Notification and User Profile */}
          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <span className="text-gray-600 text-xl text-center">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
              {/* Tooltip on hover */}
              <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-100 rounded-lg shadow-soft p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in duration-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-2">Recent Notifications</p>
                <div className="space-y-1">
                  <div className="text-[11px] p-2 hover:bg-gray-50 rounded italic text-gray-600">You completed "Flora Classification"!</div>
                  <div className="text-[11px] p-2 hover:bg-gray-50 rounded italic text-gray-600">New module available: Eco-Tourism</div>
                </div>
              </div>
            </button>
            
            <div className="flex items-center space-x-2 bg-gray-50 py-1 pl-1 pr-3 rounded-full border border-gray-100">
              <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white text-xs font-bold">
                JS
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden lg:inline">John Smith</span>
            </div>

            <button 
              onClick={handleSignOut}
              className="btn-primary text-sm px-4 py-2"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
