import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './iotalertdetail.css'

// --- Icons ---
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const CameraIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
)

export default function IoTAlertDetailPage() {
  const navigate = useNavigate()

  // Mock Data
  const alertData = {
    title: 'Proboscis Monkey Detection',
    deviceId: 'BAKO - S3',
    detectionType: 'Proboscis Monkey',
    confidence: 94,
    level: 'High',
    timestamp: '13 Apr, 14:22',
    location: 'Zone A - River Bank'
  }

  const historyData = [
    { id: 1, type: 'Proboscis Monkey', date: '13 Apr, 14:22', confidence: '94%', status: 'Pending' },
    { id: 2, type: 'Proboscis Monkey', date: '12 Apr, 09:15', confidence: '88%', status: 'Confirmed' },
    { id: 3, type: 'Human Intruder', date: '10 Apr, 18:30', confidence: '65%', status: 'False Detection' },
    { id: 4, type: 'Proboscis Monkey', date: '08 Apr, 11:45', confidence: '91%', status: 'Confirmed' },
    { id: 5, type: 'Unknown Movement', date: '05 Apr, 03:20', confidence: '40%', status: 'False Detection' },
  ]

  return (
    <div className="iad-page-container">
      <Navbar />

      <div className="iad-main-wrapper">
        
        {/* Topbar */}
        <header className="iad-topbar">
          <h1 className="iad-title">IoT Alerts</h1>

          <div className="iad-search-box">
            <SearchIcon />
            <input type="text" placeholder="Search alerts..." />
          </div>

          <div className="iad-user-actions">
            <button className="iad-icon-btn">
              <BellIcon />
              <span className="iad-notification-dot"></span>
            </button>
            <div className="iad-avatar">AM</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="iad-content-area">
          
          <button className="iad-back-btn" onClick={() => navigate('/iot-alerts')}>
            ← Back to IoT Alerts
          </button>

          {/* Alert Details Section */}
          <div className="iad-details-section">
            <h2 className="iad-page-heading">{alertData.title}</h2>

            <div className="iad-details-grid">
              
              {/* Evidence Frame */}
              <div className="iad-evidence-container">
                <div className="iad-evidence-frame">
                  <div className="iad-camera-overlay">
                    <CameraIcon />
                  </div>
                  {/* Placeholder for actual image */}
                  <div className="iad-image-placeholder"></div>
                </div>
              </div>

              {/* Metadata & Actions */}
              <div className="iad-info-card">
                <h3 className="iad-card-title">Detection Metadata</h3>
                
                <div className="iad-info-row">
                  <span className="iad-label">Device ID</span>
                  <span className="iad-value">{alertData.deviceId}</span>
                </div>

                <div className="iad-info-row">
                  <span className="iad-label">Detection Type</span>
                  <span className="iad-value">{alertData.detectionType}</span>
                </div>

                <div className="iad-info-row">
                  <span className="iad-label">Confidence</span>
                  <span className="iad-value">
                    <span className="iad-confidence-badge iad-high">
                      {alertData.confidence}% - {alertData.level}
                    </span>
                  </span>
                </div>

                <div className="iad-info-row">
                  <span className="iad-label">Date & Time</span>
                  <span className="iad-value">{alertData.timestamp}</span>
                </div>

                <div className="iad-info-row">
                  <span className="iad-label">Location</span>
                  <span className="iad-value">{alertData.location}</span>
                </div>

                <div className="iad-actions-divider"></div>

                <div className="iad-action-buttons">
                  <button className="iad-btn-confirm">Confirm Detection</button>
                  <button className="iad-btn-false">Mark False Detection</button>
                </div>

              </div>
            </div>
          </div>

          {/* History Section */}
          <div className="iad-history-section">
            <h3 className="iad-section-title">Alert History — {alertData.deviceId}</h3>
            
            <div className="iad-table-container">
              <table className="iad-table">
                <thead>
                  <tr>
                    <th>Detection Type</th>
                    <th>Date & Time</th>
                    <th>Confidence</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((row) => (
                    <tr key={row.id}>
                      <td className="iad-type-cell">
                        <span className="iad-dot"></span>
                        {row.type}
                      </td>
                      <td>{row.date}</td>
                      <td>{row.confidence}</td>
                      <td>
                        <span className={`iad-status-badge ${row.status === 'Confirmed' ? 'iad-confirmed' : row.status === 'Pending' ? 'iad-pending' : 'iad-false'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}