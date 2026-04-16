import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GuideNavbar from '../../../components/guidenavbar/guidenavbar'
import './guidequizlist.css';

const GuideQuizList = () => {
  const navigate = useNavigate()
  // Mock Data for Stats
  const stats = [
    { id: 1, label: 'Upcoming', value: 3, icon: '📅', class: 'upcoming' },
    { id: 2, label: 'Pending Grade', value: 1, icon: '⏳', class: 'pending' },
    { id: 3, label: 'Completed', value: 5, icon: '✅', class: 'completed' },
    { id: 4, label: 'Total', value: 9, icon: '📝', class: 'total' },
  ];

  // Mock Data for Quiz List
  const quizzes = [
    {
      id: 1,
      title: 'Forest Safety – Final Quiz',
      module: 'Forest Safety & Hazard Awareness',
      status: 'Upcoming',
      actionType: 'start'
    },
    {
      id: 2,
      title: 'Eco - Tourism Principles Quiz',
      module: 'Eco - Tourism Fundamentals',
      status: 'Pending Grade',
      actionType: 'view'
    },
    {
      id: 3,
      title: 'Basic First Aid Assessment',
      module: 'Basic Wilderness First Aid',
      status: '92% Passed',
      actionType: 'certificate'
    },
    {
      id: 4,
      title: 'Wildlife Identification Test',
      module: 'Wildlife Identification',
      status: '85% Passed',
      actionType: 'certificate'
    },
    {
      id: 5,
      title: 'Park History Quiz',
      module: 'Park History 101',
      status: '78% Passed',
      actionType: 'certificate'
    }
  ];

  // Helper to determine badge styling
  const getBadgeClass = (status) => {
    if (status === 'Upcoming') return 'upcoming';
    if (status === 'Pending Grade') return 'pending';
    if (status.includes('Passed')) return 'passed';
    return '';
  };

  // Helper to render the action button
  const renderAction = (quiz) => {
    if (quiz.actionType === 'start') {
      return (
        <button className="gql-btn gql-btn-start" onClick={() => navigate('/guidequiz')}>
          Start Quiz
        </button>
      );
    } else if (quiz.actionType === 'certificate') {
      return (
        <button className="gql-btn gql-btn-outline" onClick={() => navigate(`/guidecertifications`)}>
          View Certificate
        </button>
      );
    } else {
      return (
        <button className="gql-btn gql-btn-outline" disabled style={{opacity: 0.6, cursor: 'not-allowed'}}>
          Checking...
        </button>
      );
    }
  };

  return (
    <div className="gql-container">
      <GuideNavbar />
      
      <main className="gql-main">
        <h1 className="gql-page-title">Quizzes</h1>

        {/* Stats Section */}
        <div className="gql-stats-grid">
          {stats.map((stat) => (
            <div key={stat.id} className={`gql-stat-card ${stat.class}`}>
              <div className="gql-stat-icon">{stat.icon}</div>
              <div className="gql-stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quiz Table */}
        <div className="gql-table-container">
          <table className="gql-table">
            <thead>
              <tr>
                <th style={{width: '35%'}}>Quiz</th>
                <th style={{width: '30%'}}>Module</th>
                <th style={{width: '20%'}}>Status</th>
                <th style={{width: '15%', textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id}>
                  <td>
                    <span className="gql-quiz-title">{quiz.title}</span>
                  </td>
                  <td>
                    <span className="gql-module-name">{quiz.module}</span>
                  </td>
                  <td>
                    <span className={`gql-badge ${getBadgeClass(quiz.status)}`}>
                      {quiz.status}
                    </span>
                  </td>
                  <td style={{textAlign: 'right'}}>
                    {renderAction(quiz)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GuideQuizList;