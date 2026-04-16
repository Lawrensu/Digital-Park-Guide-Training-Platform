import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guidemoduledetail.css';

const GuideModuleDetail = () => {
  // Mock Data for Content Items
  const contentItems = [
    { id: 1, title: 'Introduction to Forest Safety', type: 'Video', status: 'completed' },
    { id: 2, title: 'Understanding Hazard Levels', type: 'Reading', status: 'completed' },
    { id: 3, title: 'Common Wildlife Hazards', type: 'Video', status: 'completed' },
    { id: 4, title: 'Equipment Check List', type: 'Document', status: 'completed' },
    { id: 5, title: 'Emergency Protocols', type: 'Video', status: 'completed' },
    { id: 6, title: 'Case Study: Incident at Boko', type: 'Reading', status: 'completed' },
    { id: 7, title: 'Navigational Safety', type: 'Video', status: 'completed' },
    { id: 8, title: 'Weather Patterns & Risks', type: 'Reading', status: 'completed' },
    { id: 9, title: 'First Aid Basics', type: 'Video', status: 'completed' },
    { id: 10, title: 'Communication Guidelines', type: 'Document', status: 'completed' },
    { id: 11, title: 'Interactive Scenario A', type: 'Activity', status: 'active' }, // Current
    { id: 12, title: 'Final Assessment', type: 'Quiz', status: 'locked' },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'Video': return '🎥';
      case 'Reading': return '📖';
      case 'Document': return '📄';
      case 'Activity': return '🧩';
      case 'Quiz': return '❓';
      default: return '📄';
    }
  };

  return (
    <div className="gmd-container">
      <GuideNavbar />
      
      <main className="gmd-main">
        
        {/* Header */}
        <div className="gmd-header">
          <h1 className="gmd-title">Forest Safety & Hazard Awareness</h1>
        </div>

        {/* Progress Section */}
        <div className="gmd-progress-section">
          <div className="gmd-progress-header">
            <div className="gmd-progress-label">Your Progress</div>
            <div className="gmd-progress-stats">10 of 12 items completed</div>
          </div>
          <div className="gmd-bar-bg">
            <div className="gmd-bar-fill"></div>
          </div>
          <div className="gmd-time-estimate">
            <span>⏱️</span> About 2h 15m remaining
          </div>
        </div>

        <div className="gmd-layout-grid">
          
          {/* Left Column: Content List */}
          <div className="gmd-content-list">
            {contentItems.map((item) => (
              <div 
                key={item.id} 
                className={`gmd-item ${item.status}`}
              >
                <div className="gmd-icon-box">
                  {getIcon(item.type)}
                </div>
                
                <div className="gmd-item-info">
                  <h4 className="gmd-item-title">{item.title}</h4>
                  <div className="gmd-item-type">{item.type}</div>
                </div>

                {item.status === 'completed' && (
                  <div className="gmd-check-icon">✓</div>
                )}
                
                {item.status === 'locked' && (
                  <div className="gmd-check-icon" style={{color: '#ccc'}}>🔒</div>
                )}
              </div>
            ))}
          </div>

          {/* Right Column: Info Sidebar */}
          <div className="gmd-sidebar">
            
            <div className="gmd-sidebar-card">
              <h3 className="gmd-sidebar-title">Module Info</h3>
              
              <div className="gmd-info-row">
                <span className="gmd-info-label">Difficulty</span>
                <span className="gmd-info-value">Beginner</span>
              </div>
              
              <div className="gmd-info-row">
                <span className="gmd-info-label">Site</span>
                <span className="gmd-info-value">Boko NP Station</span>
              </div>
              
              <div className="gmd-info-row">
                <span className="gmd-info-label">Language</span>
                <span className="gmd-info-value">English</span>
              </div>

              <div className="gmd-info-row">
                <span className="gmd-info-label">Pass Score</span>
                <span className="gmd-info-value">80%</span>
              </div>
            </div>

            <div className="gmd-warning-box">
              <div className="gmd-warning-icon">⚠️</div>
              <div>
                <strong>Attention:</strong><br />
                You must complete all module content before attempting the Final Quiz.
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default GuideModuleDetail;