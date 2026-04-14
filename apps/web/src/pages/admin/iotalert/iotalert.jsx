import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './iotalert.css'

const initialAlerts = [
  { id: 1,  title: 'Camera Trap Low Battery',         station: 'Station 4 - CT-004', desc: 'Battery level at 5%. Immediate replacement needed.',                                  severity: 'Critical', time: '10 min ago'  },
  { id: 2,  title: 'Unusual Animal Movement',          station: 'Station 2 - CT-002', desc: 'Detected large animal movement at unusual hours. Possible poacher activity.',         severity: 'Warning',  time: '1 hour ago'  },
  { id: 3,  title: 'New Species Detection',            station: 'Station 7 - CT-007', desc: 'AI detected possible Sunda Colugo. Confidence: 87%.',                                  severity: 'Info',     time: '3 hours ago' },
  { id: 4,  title: 'Sensor Offline',                   station: 'Station 1 - CT-001', desc: 'Motion sensor not responding. Last ping: 5 hours ago.',                               severity: 'Critical', time: '5 hours ago' },
  { id: 5,  title: 'High Humidity Warning',            station: 'Station 3 - ENV-003', desc: 'Humidity at 98%. Equipment may be affected.',                                        severity: 'Warning',  time: '6 hours ago' },
  { id: 6,  title: 'Wildlife Crossing Detected',       station: 'Station 5 - CT-005', desc: 'Multiple animals detected crossing patrol road near river.',                          severity: 'Info',     time: '8 hours ago' },
  { id: 7,  title: 'Solar Panel Power Drop',           station: 'Station 6 - PWR-006', desc: 'Power output dropped by 60%. Possible obstruction or damage.',                      severity: 'Warning',  time: '10 hours ago'},
  { id: 8,  title: 'Intrusion Alert',                  station: 'Station 9 - SEC-009', desc: 'Perimeter sensor triggered at sector B. Immediate verification required.',           severity: 'Critical', time: '12 hours ago'},
  { id: 9,  title: 'Temperature Anomaly',              station: 'Station 8 - ENV-008', desc: 'Temperature recorded at 42°C — 8°C above baseline. Possible fire risk.',            severity: 'Warning',  time: '14 hours ago'},
  { id: 10, title: 'Camera Feed Restored',             station: 'Station 2 - CT-002', desc: 'Camera feed back online after maintenance window.',                                   severity: 'Info',     time: '1 day ago'   },
]

const SEVERITY_STYLE = {
  Critical: { border: '#c53030', bg: '#fee2e2',   text: '#c53030' },
  Warning:  { border: '#d4920a', bg: '#fef3c7',   text: '#92400e' },
  Info:     { border: '#2b6cb0', bg: '#dbeafe',   text: '#2b6cb0' },
}

const TABS = ['All', 'Critical', 'Warning', 'Info']

export default function IoTAlert() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All'
    ? initialAlerts
    : initialAlerts.filter(a => a.severity === activeTab)

  return (
    <div className="iot-layout">
      <Navbar />

      <div className="iot-main">
        {/* ── Topbar ── */}
        <header className="iot-topbar">
          <h1 className="iot-topbar-title">IoT Alerts</h1>
          <div className="iot-topbar-right">
            <button className="iot-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="iot-avatar">AM</div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="iot-content">

          {/* Section title */}
          <h2 className="iot-section-title">Wildlife Monitoring Alerts</h2>

          {/* Filter tabs */}
          <div className="iot-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`iot-tab ${activeTab === tab ? 'iot-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Alert cards */}
          <div className="iot-cards">
            {filtered.length > 0 ? filtered.map(alert => {
              const style = SEVERITY_STYLE[alert.severity]
              return (
                <div key={alert.id} className="iot-card" style={{ borderLeftColor: style.border }}>
                  <div className="iot-card-top">
                    <h3 className="iot-card-title">{alert.title}</h3>
                    <div className="iot-card-top-right">
                      <span
                        className="iot-badge"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {alert.severity}
                      </span>
                      <span className="iot-card-time">{alert.time}</span>
                    </div>
                  </div>
                  <p className="iot-card-station">{alert.station}</p>
                  <div className="iot-card-bottom">
                    <p className="iot-card-desc">{alert.desc}</p>
                    <button
                      className="iot-btn-view"
                      onClick={() => navigate(`/iot-alerts/${alert.id}`)}
                    >
                      View
                    </button>
                  </div>
                </div>
              )
            }) : (
              <div className="iot-empty">No alerts found for this filter.</div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}
