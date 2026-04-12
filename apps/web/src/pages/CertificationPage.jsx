import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CertificateCard from '../components/CertificateCard';
import Button from '../components/Button';
import { certifications } from '../data/courses';
import { Link } from 'react-router-dom';

// Certification/Certificates page showing completed course certificates
export default function CertificationPage() {
  const [displayCertifications, setDisplayCertifications] = useState([]);

  useEffect(() => {
    // In a real app, fetch user's certifications from backend
    setDisplayCertifications(certifications);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Your Certificates
          </h1>
          <p className="text-gray-600 text-lg">
            View and download your certificates of completion
          </p>
        </div>

        {displayCertifications.length > 0 ? (
          <div className="space-y-8">
            {/* Certificate Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="text-center">
                  <p className="text-5xl font-serif font-bold text-green-700 mb-2">
                    {displayCertifications.length}
                  </p>
                  <p className="text-gray-700 font-medium">
                    Certificates Earned
                  </p>
                </div>
              </div>

              <div className="card p-6">
                <div className="text-center">
                  <p className="text-5xl font-serif font-bold text-green-700 mb-2">
                    🏆
                  </p>
                  <p className="text-gray-700 font-medium">
                    Recognized by Partners
                  </p>
                </div>
              </div>

              <div className="card p-6">
                <div className="text-center">
                  <p className="text-5xl font-serif font-bold text-green-700 mb-2">
                    📜
                  </p>
                  <p className="text-gray-700 font-medium">
                    Official Credentials
                  </p>
                </div>
              </div>
            </div>

            {/* Certificates Grid */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">
                Completed Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayCertifications.map(cert => (
                  <CertificateCard key={cert.id} certificate={cert} />
                ))}
              </div>
            </div>

            {/* Additional Actions */}
            <div className="card p-8 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                    Share Your Achievement
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Share your certificates on LinkedIn or other professional networks 
                    to showcase your expertise in park guide training.
                  </p>
                  <Button variant="primary">
                    🔗 Share All Certificates
                  </Button>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                    Continue Learning
                  </h3>
                  <p className="text-gray-700 mb-6">
                    Keep advancing your skills with additional courses and certifications
                    to become an expert guide.
                  </p>
                  <Link to="/courses">
                    <Button variant="primary">
                      📚 Explore More Courses
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-6">📜</div>
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              No Certificates Yet
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
              Start taking courses and complete quizzes to earn your certificates of completion. 
              Each certificate recognizes your expertise in park guide training.
            </p>
            <Link to="/courses">
              <Button variant="primary" size="lg">
                🎓 Start Your First Course
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
