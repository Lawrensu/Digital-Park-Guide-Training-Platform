import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './certification.css'

const initialCerts = [
  { id: 1,  guideName: 'Siti Nurhaliza binti Tarudin', module: 'Wildlife First Aid',        certId: 'CERT-2024-001', issued: '10 Apr 2024', expires: '10 Apr 2026' },
  { id: 2,  guideName: 'Nurul Izzah binti Razak',      module: 'Visitor Safety Protocols',  certId: 'CERT-2024-002', issued: '08 Apr 2024', expires: '08 Apr 2025' },
  { id: 3,  guideName: 'Lee Wei Ming',                 module: 'Rainforest Biodiversity',   certId: 'CERT-2023-045', issued: '12 Jan 2023', expires: '12 Jan 2024' },
  { id: 4,  guideName: 'Priya a/p Subramaniam',        module: 'Night Safari Operations',   certId: 'CERT-2024-003', issued: '05 Apr 2024', expires: '—'           },
  { id: 5,  guideName: 'Ahmad bin Yusof',              module: 'Equipment Maintenance',     certId: 'CERT-2024-004', issued: '01 Apr 2024', expires: '01 Apr 2025' },
  { id: 6,  guideName: 'Tan Mei Ling',                 module: 'Guest Relations',           certId: 'CERT-2023-099', issued: '20 Feb 2023', expires: '20 Feb 2024' },
  { id: 7,  guideName: 'Muhammad Haziq bin Razlan',    module: 'Park Heritage',             certId: 'CERT-2024-005', issued: '22 Mar 2024', expires: '22 Mar 2026' },
  { id: 8,  guideName: 'Nur Afiqah binti Kamal',       module: 'Flora Identification',      certId: 'CERT-2024-006', issued: '18 Mar 2024', expires: '—'           },
  { id: 9,  guideName: 'Rajesh a/l Muthu',             module: 'Sustainable Tourism',       certId: 'CERT-2024-007', issued: '15 Mar 2024', expires: '15 Mar 2025' },
  { id: 10, guideName: 'Chong Kit Yee',                module: 'Emergency Response',        certId: 'CERT-2024-008', issued: '10 Mar 2024', expires: '10 Mar 2024' },
]

export default function CertificationPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = initialCerts.filter(c => {
    const q = searchQuery.toLowerCase()
    return (
      c.guideName.toLowerCase().includes(q) ||
      c.module.toLowerCase().includes(q) ||
      c.certId.toLowerCase().includes(q)
    )
  })

  return (
    <div className="cert-layout">
      <Navbar />

      <div className="cert-main">
        {/* ── Topbar ── */}
        <header className="cert-topbar">
          <h1 className="cert-topbar-title">Certifications</h1>
          <div className="cert-topbar-right">
            <button className="cert-icon-btn" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <div className="cert-avatar">AM</div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="cert-content">

          {/* Table section */}
          <section className="cert-table-section">
            {/* Search row */}
            <div className="cert-search-row">
              <div className="cert-search-wrap">
                <svg className="cert-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  className="cert-search-input"
                  placeholder="Search guide, module or cert ID…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <span className="cert-result-count">{filtered.length} certificate{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Table */}
            <div className="cert-table-wrap">
              <table className="cert-table">
                <thead>
                  <tr>
                    <th>Guide</th>
                    <th>Module</th>
                    <th>Issued</th>
                    <th>Expires</th>
                    <th>Cert ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? filtered.map(c => (
                    <tr key={c.id}>
                      <td><p className="cert-name">{c.guideName}</p></td>
                      <td className="cert-muted">{c.module}</td>
                      <td className="cert-muted">{c.issued}</td>
                      <td className="cert-muted">{c.expires}</td>
                      <td><span className="cert-id">{c.certId}</span></td>
                      <td>
                        <div className="cert-actions">
                          <button
                            className="cert-btn-pdf"
                            onClick={() => console.log(`Download PDF for ${c.certId}`)}
                          >
                            PDF
                          </button>
                          <button
                            className="cert-btn-view"
                            onClick={() => navigate(`/certifications/issue/${c.id}`)}
                          >
                            View <span aria-hidden>→</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="cert-empty">No certifications found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}
