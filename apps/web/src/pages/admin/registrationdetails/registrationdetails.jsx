import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/navbar/navbar'; // Adjust path if needed
import './registrationdetails.css';

const RegistrationDetails = () => {
  
  // Handle Approve
  const handleApprove = () => {
    alert('Application Approved');
  };

  // Handle Reject
  const handleReject = () => {
    alert('Application Rejected');
  };

  return (
    <div className="registration-container flex">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="page-header">
          <h1 className="text-display text-[#1a3a2a]">Registrations</h1>
          <div className="status-badge pending">Pending</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Applicant Info & Resume (Takes up 2/3 space) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information Card */}
            <div className="detail-card p-6">
              <h3 className="text-h3 text-[#1a3a2a] mb-6 border-b border-[#f0e9db] pb-3">Personal Information</h3>
              
              <div className="info-grid">
                <div className="info-item">
                  <label className="text-label text-gray-500">Full Name</label>
                  <p className="text-body-default text-[#1a3a2a] font-medium">Ahmad bin Yusof</p>
                </div>

                <div className="info-item">
                  <label className="text-label text-gray-500">ID Number</label>
                  <p className="text-body-default text-[#1a3a2a]">900101-10-5555</p>
                </div>

                <div className="info-item">
                  <label className="text-label text-gray-500">Email Address</label>
                  <p className="text-body-default text-[#1a3a2a]">ahmad.yusof@example.com</p>
                </div>

                <div className="info-item">
                  <label className="text-label text-gray-500">Phone Number</label>
                  <p className="text-body-default text-[#1a3a2a]">+60 12-345 6789</p>
                </div>

                <div className="info-item full-width">
                  <label className="text-label text-gray-500">Address</label>
                  <p className="text-body-default text-[#1a3a2a]">
                    123, Jalan Damansara,<br />
                    50490 Kuala Lumpur,<br />
                    Malaysia
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Card */}
            <div className="detail-card p-6">
              <h3 className="text-h3 text-[#1a3a2a] mb-4 border-b border-[#f0e9db] pb-3">Uploaded Documents</h3>
              
              <div className="file-display">
                <div className="file-icon">
                  {/* Simple SVG PDF Icon */}
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#b35c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2V8H20" stroke="#b35c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18V12" stroke="#b35c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 15H15" stroke="#b35c2a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="file-details">
                  <p className="text-body-default text-[#1a3a2a] font-medium">Ahmad_Bin_Yusof_CV.pdf</p>
                  <p className="text-body-small text-gray-500">PDF Document • 2.4 MB</p>
                </div>
                <button className="btn-view-file text-label text-[#b35c2a] border border-[#b35c2a] rounded-lg px-4 py-2 hover:bg-[#fdfbf7] transition-colors">
                  View
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Progress & Decision (Takes up 1/3 space) */}
          <div className="space-y-6">
            
            {/* Vertical Progress Tracker */}
            <div className="detail-card p-6">
              <h3 className="text-h3 text-[#1a3a2a] mb-6">Application Progress</h3>
              
              <div className="progress-vertical">
                <div className="progress-step completed">
                  <div className="step-marker"></div>
                  <div className="step-content">
                    <p className="text-label text-gray-900">Submitted</p>
                    <p className="text-caption text-gray-500">12 Oct 2024</p>
                  </div>
                </div>

                <div className="progress-step completed">
                  <div className="step-marker"></div>
                  <div className="step-content">
                    <p className="text-label text-gray-900">Verified</p>
                    <p className="text-caption text-gray-500">13 Oct 2024</p>
                  </div>
                </div>

                <div className="progress-step active">
                  <div className="step-marker"></div>
                  <div className="step-content">
                    <p className="text-label text-[#1a3a2a] font-semibold">Waiting for Approval</p>
                    <p className="text-caption text-[#b35c2a]">In Progress</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Section */}
            <div className="detail-card p-6">
              <h3 className="text-h3 text-[#1a3a2a] mb-4">Decision</h3>
              
              <div className="mb-4">
                <label className="text-label text-gray-600 block mb-2">Remarks / Reason</label>
                <textarea 
                  className="form-textarea text-body-default"
                  rows="4"
                  placeholder="Enter decision remarks (optional)..."
                ></textarea>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleApprove}
                  className="btn-approve text-label px-6 py-3 rounded-lg w-full"
                >
                  Approve Application
                </button>
                <button 
                  onClick={handleReject}
                  className="btn-reject text-label px-6 py-3 rounded-lg w-full"
                >
                  Reject Application
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationDetails;