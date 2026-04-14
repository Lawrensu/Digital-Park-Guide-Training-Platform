import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guidemodule.css';

const GuideModule = () => {
  const navigate = useNavigate()
  // Mock Data for Stats
  const stats = [
    { label: 'Enrolled', count: 5 },
    { label: 'Completed', count: 3 },
    { label: 'In Progress', count: 2 },
    { label: 'Not Enrolled', count: 3 },
  ];

  // Mock Data for Modules (Generating 8 as per description)
  const modules = [
    {
      id: 1,
      title: 'Forest Safety & Hazard Awareness',
      progress: 75,
      status: 'On Track',
      statusClass: 'track',
      dueDate: '20 Apr 2026',
      items: 5,
      action: 'Continue',
      actionType: 'continue'
    },
    {
      id: 2,
      title: 'Eco - Tourism Fundamentals',
      progress: 100,
      status: 'Completed',
      statusClass: 'completed',
      dueDate: '15 Jan 2026',
      items: 8,
      action: 'View',
      actionType: 'view'
    },
    {
      id: 3,
      title: 'Basic Wilderness First Aid',
      progress: 30,
      status: 'In Progress',
      statusClass: 'progress',
      dueDate: '10 May 2026',
      items: 4,
      action: 'Continue',
      actionType: 'continue'
    },
    {
      id: 4,
      title: 'Wildlife Identification',
      progress: 0,
      status: 'Not Started',
      statusClass: 'not-started',
      dueDate: '01 Jun 2026',
      items: 6,
      action: 'Enrol',
      actionType: 'enrol'
    },
    {
      id: 5,
      title: 'Sustainable Gardening',
      progress: 0,
      status: 'Not Started',
      statusClass: 'not-started',
      dueDate: '15 Jun 2026',
      items: 3,
      action: 'Enrol',
      actionType: 'enrol'
    },
    {
      id: 6,
      title: 'Park History 101',
      progress: 100,
      status: 'Completed',
      statusClass: 'completed',
      dueDate: '10 Feb 2026',
      items: 5,
      action: 'View',
      actionType: 'view'
    },
    {
      id: 7,
      title: 'Visitor Management',
      progress: 45,
      status: 'In Progress',
      statusClass: 'progress',
      dueDate: '25 Apr 2026',
      items: 7,
      action: 'Continue',
      actionType: 'continue'
    },
    {
      id: 8,
      title: 'Emergency Protocols',
      progress: 0,
      status: 'Not Started',
      statusClass: 'not-started',
      dueDate: '30 Jun 2026',
      items: 4,
      action: 'Enrol',
      actionType: 'enrol'
    }
  ];

  const renderButton = (type) => {
    switch(type) {
      case 'continue': return <button className="gm-btn gm-btn-continue" onClick={() => navigate('/guidemoduledetail')}>Continue</button>;
      case 'view': return <button className="gm-btn gm-btn-view" onClick={() => navigate('/guidemoduledetail')}>View</button>;
      case 'enrol': return <button className="gm-btn gm-btn-enrol" onClick={() => navigate('/guidemoduledetail')}>Enrol</button>;
      default: return null;
    }
  };

  return (
    <div className="gm-container">
      <GuideNavbar />
      
      <main className="gm-main">
        <h1 className="gm-page-title">My Modules</h1>

        {/* Stats Section */}
        <div className="gm-stats-row">
          {stats.map((stat, index) => (
            <div key={index} className="gm-stat-box">
              <div className="gm-stat-num">{stat.count}</div>
              <div className="gm-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Modules Grid */}
        <div className="gm-module-grid">
          {modules.map((module) => (
            <div key={module.id} className="gm-card">
              <div className="gm-card-header">
                <h3 className="gm-title">{module.title}</h3>
                <span className={`gm-badge ${module.statusClass}`}>{module.status}</span>
              </div>

              {/* Progress Bar (Hidden if 0%) */}
              {module.progress > 0 && (
                <div className="gm-progress-container">
                  <div className="gm-progress-labels">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <div className="gm-bar-bg">
                    <div 
                      className="gm-bar-fill" 
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="gm-info-row">
                <div className="gm-info-item">
                  <span>📅</span> Due: {module.dueDate}
                </div>
                <div className="gm-info-item">
                  <span>📚</span> {module.items} Items
                </div>
              </div>

              <div className="gm-card-footer">
                {renderButton(module.actionType)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GuideModule;