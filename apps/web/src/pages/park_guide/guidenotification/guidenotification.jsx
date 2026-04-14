import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guidenotification.css';

const GuideNotification = () => {
  // State for the active tab
  const [activeTab, setActiveTab] = useState('unread');

  // Mock Data based on the image description
  const notifications = [
    {
      id: 1,
      type: 'certificate',
      icon: '🎓',
      title: 'Certificate Issued – Eco - Tourism Fundamentals',
      desc: 'Congratulations! You have successfully completed the module and can now download your certificate.',
      time: 'Just now',
      unread: true
    },
    {
      id: 2,
      type: 'quiz',
      icon: '📝',
      title: 'Quiz Result: Forest Safety – Final Quiz',
      desc: 'You scored 85% on your recent attempt. Review your answers to see where you can improve.',
      time: '2 hrs ago',
      unread: true
    },
    {
      id: 3,
      type: 'deadline',
      icon: '⚠️',
      title: 'Deadline Reminder: Wildlife Identification',
      desc: 'The assignment for this module is due tomorrow at 11:59 PM. Make sure to submit it on time.',
      time: '5 hrs ago',
      unread: true
    },
    {
      id: 4,
      type: 'module',
      icon: '🌿',
      title: 'New Module Available: Sustainable Gardening',
      desc: 'A new learning path has been added to your dashboard. Start learning today!',
      time: '1 day ago',
      unread: true
    },
    {
      id: 5,
      type: 'certificate',
      icon: '🎓',
      title: 'Certificate Issued – Park History 101',
      desc: 'Your certificate is ready for download.',
      time: '2 days ago',
      unread: false
    }
  ];

  // Filter logic
  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return notif.unread;
    if (activeTab === 'modules') return notif.type === 'module';
    return true;
  });

  const getIconClass = (type) => {
    switch(type) {
      case 'certificate': return 'gn-icon-certificate';
      case 'quiz': return 'gn-icon-quiz';
      case 'deadline': return 'gn-icon-deadline';
      case 'module': return 'gn-icon-module';
      default: return 'gn-icon-module';
    }
  };

  return (
    <div className="gn-container">
      <GuideNavbar />
      
      <main className="gn-main">
        {/* Header */}
        <header className="gn-header">
          <div className="gn-header-title">
            <h1>Notifications</h1>
            <p className="gn-header-date">Monday, 14 April 2026</p>
          </div>
          
          <div className="gn-header-stats">
            <span className="gn-unread-count">
              {notifications.filter(n => n.unread).length} unread
            </span>
          </div>
        </header>

        {/* Tabs / Filters */}
        <div className="gn-filters">
          <button 
            className={`gn-filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`gn-filter-tab ${activeTab === 'unread' ? 'active' : ''}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread ({notifications.filter(n => n.unread).length})
          </button>
          <button 
            className={`gn-filter-tab ${activeTab === 'modules' ? 'active' : ''}`}
            onClick={() => setActiveTab('modules')}
          >
            Modules
          </button>
        </div>

        {/* Notification List */}
        <div className="gn-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`gn-item ${notif.unread ? 'unread' : ''}`}
              >
                <div className={`gn-icon-box ${getIconClass(notif.type)}`}>
                  {notif.icon}
                </div>
                
                <div className="gn-content">
                  <span className="gn-title">{notif.title}</span>
                  <p className="gn-desc">{notif.desc}</p>
                  <div className="gn-time">
                    <span>🕒</span> {notif.time}
                  </div>
                </div>

                {notif.unread && <div className="gn-dot"></div>}
              </div>
            ))
          ) : (
            <p style={{ color: '#666', textAlign: 'center', marginTop: '2rem' }}>
              No notifications found.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default GuideNotification;