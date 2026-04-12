import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 text-center border-t-8 border-green-700">
        <div className="w-20 h-20 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl text-green-700">📜</span>
        </div>
        
        <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">Registration Submitted!</h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          Your application is currently being reviewed by our administrators. 
          You will receive an email once it has been processed.
        </p>

        <div className="bg-green-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-serif font-bold text-green-800 mb-3">Process Overview:</h3>
          <ul className="space-y-3 text-sm text-green-700">
            <li className="flex items-start">
              <span className="mr-2">✅</span> Application Received
            </li>
            <li className="flex items-start">
              <span className="mr-2">⏳</span> Admin/Trainer Review
            </li>
            <li className="flex items-start">
              <span className="mr-2">📧</span> Account Confirmation Email
            </li>
          </ul>
        </div>

        <Link to="/">
          <Button variant="primary" size="lg" className="w-full">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
