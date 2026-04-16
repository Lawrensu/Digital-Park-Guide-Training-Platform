import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './module.css'

const initialModules = [
  { id: 1,  title: 'Rainforest Biodiversity & Ecology',  status: 'Published', enrolled: 124, items: 8,  created: '15 Jan 2024' },
  { id: 2,  title: 'Visitor Safety Protocols',           status: 'Published', enrolled: 85,  items: 5,  created: '20 Jan 2024' },
  { id: 3,  title: 'Guided Tour Best Practices',         status: 'Draft',     enrolled: 0,   items: 3,  created: '05 Feb 2024' },
  { id: 4,  title: 'Wildlife Conservation Efforts',      status: 'Published', enrolled: 200, items: 12, created: '10 Feb 2024' },
  { id: 5,  title: 'Emergency Response Training',        status: 'Archived',  enrolled: 40,  items: 6,  created: '01 Dec 2023' },
  { id: 6,  title: 'Flora Identification Guide',         status: 'Published', enrolled: 95,  items: 10, created: '15 Feb 2024' },
  { id: 7,  title: 'Park History & Heritage',            status: 'Published', enrolled: 110, items: 4,  created: '20 Feb 2024' },
  { id: 8,  title: 'Sustainable Tourism Practices',      status: 'Draft',     enrolled: 0,   items: 2,  created: '22 Feb 2024' },
  { id: 9,  title: 'Night Safari Operations',            status: 'Published', enrolled: 60,  items: 7,  created: '01 Mar 2024' },
  { id: 10, title: 'Equipment Maintenance',              status: 'Published', enrolled: 45,  items: 3,  created: '05 Mar 2024' },
  { id: 11, title: 'Guest Relations Training',           status: 'Published', enrolled: 78,  items: 5,  created: '10 Mar 2024' },
]

const TABS = ['All', 'Draft', 'Published', 'Archived']

export default function ModulesPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('All')

  const counts = {
    All:       initialModules.length,
    Published: initialModules.filter(m => m.status === 'Published').length,
    Draft:     initialModules.filter(m => m.status === 'Draft').length,
    Archived:  initialModules.filter(m => m.status === 'Archived').length,
  }

  const filtered = activeTab === 'All'
    ? initialModules
    : initialModules.filter(m => m.status === activeTab)

  return (
    <div className="mod-layout">
      <Navbar />

      <div className="mod-main">
        {/* ── Topbar ── */}
        <header className="mod-topbar">
          <h1 className="mod-topbar-title">Modules</h1>
          <div className="mod-topbar-right">
            <button className="mod-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="mod-avatar">AM</div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="mod-content">

          {/* Stats */}
          <section className="mod-stats">
            {[
              { key: 'All',       label: 'Total Modules', colorClass: 'mod-stat--total'     },
              { key: 'Published', label: 'Published',     colorClass: 'mod-stat--published' },
              { key: 'Draft',     label: 'Draft',         colorClass: 'mod-stat--draft'     },
              { key: 'Archived',  label: 'Archived',      colorClass: 'mod-stat--archived'  },
            ].map(({ key, label, colorClass }) => (
              <button
                key={key}
                className={`mod-stat ${colorClass} ${activeTab === key ? 'mod-stat--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <span className="mod-stat-label">{label}</span>
                <span className="mod-stat-value">{counts[key]}</span>
              </button>
            ))}
          </section>

          {/* Header row */}
          <div className="mod-header-row">
            <div>
              <h2 className="mod-section-title">Training Modules</h2>
            </div>
            <button className="mod-btn-new" onClick={() => navigate('/modules/new')}>
              + New Module
            </button>
          </div>

          {/* Tabs */}
          <div className="mod-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`mod-tab ${activeTab === tab ? 'mod-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Card grid */}
          {filtered.length > 0 ? (
            <div className="mod-grid">
              {filtered.map(m => (
                <div key={m.id} className="mod-card">
                  <div className="mod-card-header">
                    <span className={`mod-badge mod-badge--${m.status.toLowerCase()}`}>{m.status}</span>
                  </div>
                  <h3 className="mod-card-title">{m.title}</h3>
                  <div className="mod-card-footer">
                    <button
                      className="mod-btn-edit"
                      onClick={() => navigate(`/modules/edit/${m.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="mod-btn-content"
                      onClick={() => navigate(`/modules/content/${m.id}`)}
                    >
                      Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mod-empty">No modules found.</div>
          )}

        </main>
      </div>
    </div>
  )
}
