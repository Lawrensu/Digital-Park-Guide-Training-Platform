import AdminLayout from '../components/AdminLayout';

export default function AdminDashboardOverview() {
  const stats = [
    { label: 'Active Guides', value: '142', growth: '+12%', color: 'blue' },
    { label: 'Pending Apps', value: '18', growth: '4 New', color: 'orange' },
    { label: 'Certifications Issued', value: '286', growth: '+5.4%', color: 'green' },
    { label: 'Security Alerts', value: '0', growth: 'Stable', color: 'slate' },
  ];

  const recentAlerts = [
    { time: '2 mins ago', type: 'System', msg: 'Backup completed successfully.' },
    { time: '1 hour ago', type: 'AI Monitor', msg: 'Abnormal activity detected in North Sector: CCTV-04 (False alert - Staff maintenance).' },
    { time: '3 hours ago', type: 'User', msg: 'Lawrence Tan (Guide-2607) completed Advanced Flora Module.' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-500 mt-2 italic flex items-center">
            Last data update from FastAPI Service: Just now
            <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-6 bg-white border border-gray-100 flex flex-col items-center text-center shadow-soft hover:shadow-lg transition-transform hover:-translate-y-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</span>
              <span className="text-4xl font-serif font-black text-gray-900">{stat.value}</span>
              <span className={`text-xs mt-3 font-semibold px-2 py-1 rounded-full ${
                stat.growth.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>{stat.growth}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Progress Chart Placeholder */}
          <div className="lg:col-span-2 card p-8 bg-white shadow-soft min-h-[400px]">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-serif text-xl font-bold">Training Completion Trends</h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-500">Completed</span>
                <span className="w-3 h-3 bg-gray-300 rounded-full ml-4"></span>
                <span className="text-gray-500">In Progress</span>
              </div>
            </div>
            {/* Visual representation of a chart (Mock) */}
            <div className="w-full h-64 bg-gray-50 rounded-xl flex items-end justify-between px-10 pb-4 border border-dashed border-gray-200">
              {[60, 45, 80, 55, 90, 75, 85].map((h, i) => (
                <div key={i} className="w-8 rounded-t-lg bg-green-500 transition-all hover:bg-green-600" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card p-8 bg-white shadow-soft">
            <h3 className="font-serif text-xl font-bold mb-6">Security & Systems Feed</h3>
            <div className="space-y-6">
              {recentAlerts.map((log, i) => (
                <div key={i} className="border-l-2 border-gray-100 pl-4 py-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{log.time} • {log.type}</p>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">{log.msg}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-sm font-bold text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-100">
              View Detailed Logs
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
