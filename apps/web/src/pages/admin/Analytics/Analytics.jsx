import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Navbar from '../../../components/Navbar/Navbar';

const PARTICIPATION_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];
const OUTCOMES_COLORS = ['#38945e', '#c53030'];

const MOCK_DATA = {
  participation: [
    { name: 'Completed', value: 45 },
    { name: 'In Progress', value: 32 },
    { name: 'Not Started', value: 12 }
  ],
  outcomes: [
    { name: 'Passed', value: 78 },
    { name: 'Needs Retake', value: 11 }
  ],
  modulePassRates: [
    { name: 'Safety', rate: 92 },
    { name: 'Navigation', rate: 85 },
    { name: 'Equipment', rate: 88 },
    { name: 'First Aid', rate: 95 },
    { name: 'Flora/Fauna', rate: 80 }
  ],
  guideProgress: [
    { id: 1, name: 'John Doe', status: 'Certified', score: 92, date: '2024-05-15' },
    { id: 2, name: 'Jane Smith', status: 'In Progress', score: 88, date: '2024-05-18' },
    { id: 3, name: 'Bob Johnson', status: 'Certified', score: 95, date: '2024-05-10' },
    { id: 4, name: 'Alice Brown', status: 'Warning', score: 65, date: '2024-05-19' }
  ]
};

export default function Analytics() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f3f4f6', overflowY: 'auto' }}>
        <div className="max-w-7xl" style={{ margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827' }}>Analytics Dashboard</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Training metrics and performance data</p>
        </div>
        
        {/* KPI Cards */}
        <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Total Guides</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>124</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Active Learners</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>89</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Completion Rate</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>76%</p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#4b5563', fontSize: '14px' }}>Avg Score</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>84%</p>
          </div>
        </div>

        {/* Charts Row 1: Pie Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', marginBottom: '32px' }}>
          {/* Participation Pie Chart */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Participation Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={MOCK_DATA.participation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {MOCK_DATA.participation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PARTICIPATION_COLORS[index % PARTICIPATION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Outcomes Pie Chart */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Training Outcomes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={MOCK_DATA.outcomes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {MOCK_DATA.outcomes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={OUTCOMES_COLORS[index % OUTCOMES_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>Module Pass Rates (%)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_DATA.modulePassRates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="rate" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Guide Progress Tracking</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Name</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Score</th>
                  <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DATA.guideProgress.map((guide) => (
                  <tr key={guide.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 24px', fontSize: '14px', color: '#111827' }}>{guide.name}</td>
                    <td style={{ padding: '12px 24px', fontSize: '14px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: guide.status === 'Certified' ? '#dcfce7' : guide.status === 'In Progress' ? '#dbeafe' : '#fee2e2',
                        color: guide.status === 'Certified' ? '#166534' : guide.status === 'In Progress' ? '#1e40af' : '#991b1b'
                      }}>
                        {guide.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 24px', fontSize: '14px', color: '#4b5563' }}>{guide.score}%</td>
                    <td style={{ padding: '12px 24px', fontSize: '14px', color: '#6b7280' }}>{guide.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

