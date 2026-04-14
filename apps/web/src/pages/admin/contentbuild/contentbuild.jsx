import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'
import './contentbuild.css'

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

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

export default function ContentBuilderPage() {
  const navigate = useNavigate()

  const contentItems = [
    { id: 1, title: 'Introduction to Rainforest Ecosystems', type: 'TEXT' },
    { id: 2, title: 'Sarawak Rainforest Photo Gallery', type: 'IMAGE' },
    { id: 3, title: 'Rainforest Layers Explained', type: 'TEXT' },
    { id: 4, title: 'Biodiversity Documentary', type: 'VIDEO' },
    { id: 5, title: 'Carbon Cycle Infographic', type: 'INFOGRAPHIC' },
    { id: 6, title: 'Flora of Borneo', type: 'IMAGE' },
    { id: 7, title: 'Fauna Overview', type: 'TEXT' },
    { id: 8, title: 'Conservation Efforts', type: 'TEXT' },
    { id: 9, title: 'Rainfall Statistics', type: 'INFOGRAPHIC' },
    { id: 10, title: 'Indigenous Tribes', type: 'TEXT' },
    { id: 11, title: 'Deforestation Impact', type: 'VIDEO' },
    { id: 12, title: 'Sustainable Practices', type: 'TEXT' },
    { id: 13, title: 'Eco-Tourism Guide', type: 'TEXT' },
    { id: 14, title: 'Module Assessment', type: 'QUIZ' }
  ]

  const addOptions = ['Text', 'Image', 'Video', 'Infographic', 'Quiz']

  return (
    <div className="cb-page-container">
      <Navbar />

      <div className="cb-main-wrapper">
        
        {/* Topbar */}
        <header className="cb-topbar">
          <h1 className="cb-title">Content Builder</h1>

          <div className="cb-search-box">
            <SearchIcon />
            <input type="text" placeholder="Search content..." />
          </div>

          <div className="cb-user-actions">
            <button className="cb-icon-btn">
              <BellIcon />
              <span className="cb-notification-dot"></span>
            </button>
            <div className="cb-avatar">AM</div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="cb-content-area">
          
          <div className="cb-header-actions">
            <button className="cb-back-btn" onClick={() => navigate('/modules')}>
              ← Back to Modules
            </button>
            <span className="cb-item-count">14 Items</span>
          </div>

          <div className="cb-layout-grid">

            {/* Left Column: Content List */}
            <div className="cb-list-column">
              <div className="cb-card cb-card-list">
                <div className="cb-card-header">
                  <h3>Module Content</h3>
                  <button className="cb-reorder-link">Reorder</button>
                </div>
                
                <div className="cb-list-container">
                  {contentItems.map((item, index) => (
                    <div key={item.id} className="cb-list-item">
                      <div className="cb-item-left">
                        <span className="cb-item-number">{index + 1}.</span>
                        <div className="cb-item-details">
                          <h4 className="cb-item-title">{item.title}</h4>
                          <span className={`cb-badge cb-badge-${item.type.toLowerCase()}`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="cb-item-actions">
                        <button className="cb-action-btn cb-btn-edit" title="Edit">
                          <EditIcon />
                        </button>
                        <button className="cb-action-btn cb-btn-delete" title="Delete">
                          <DeleteIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Add Content */}
            <div className="cb-sidebar-column">
              <div className="cb-card cb-card-sidebar">
                <h3 className="cb-sidebar-title">Add Content</h3>
                <p className="cb-sidebar-subtitle">
                  Select a content type to add to this module.
                </p>
                
                <div className="cb-options-list">
                  {addOptions.map((type) => (
                    <button key={type} className="cb-option-btn">
                      <PlusIcon />
                      <span>Add {type}</span>
                    </button>
                  ))}
                </div>

                <div className="cb-sidebar-footer">
                  <button className="cb-btn-secondary-full">Preview Module</button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}