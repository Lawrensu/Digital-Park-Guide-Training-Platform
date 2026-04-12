import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    address: '',
    reason: ''
  });
  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'IC/Passport number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.reason.trim()) newErrors.reason = 'Please explain why you are applying';
    
    if (!cvFile) {
      newErrors.cv = 'Please upload your CV (PDF)';
    } else if (cvFile.type !== 'application/pdf') {
      newErrors.cv = 'Only PDF files are allowed';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      if (errors.cv) setErrors(prev => ({ ...prev, cv: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simulate submission to backend
      setTimeout(() => {
        setIsLoading(false);
        navigate('/registration-success');
      }, 1500);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">🌿</span>
            </div>
            <span className="font-serif font-bold text-xl text-green-700">Park Guide Academy</span>
          </Link>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-soft p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Park Guide Registration</h1>
            <p className="text-gray-600">Apply to become a certified guide. Our team will review your application.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="John"
                />
                {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Doe"
                />
                {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">IC / Passport Number</label>
              <input
                name="idNumber"
                type="text"
                value={formData.idNumber}
                onChange={handleChange}
                className={`input-field ${errors.idNumber ? 'border-red-500' : ''}`}
                placeholder="A12345678"
              />
              {errors.idNumber && <p className="text-red-600 text-xs mt-1">{errors.idNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Residential Address</label>
              <textarea
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                placeholder="Enter your full address"
              ></textarea>
              {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for applying</label>
              <textarea
                name="reason"
                rows="4"
                value={formData.reason}
                onChange={handleChange}
                className={`input-field ${errors.reason ? 'border-red-500' : ''}`}
                placeholder="Tell us about your passion for nature..."
              ></textarea>
              {errors.reason && <p className="text-red-600 text-xs mt-1">{errors.reason}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Upload CV (PDF only)</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${errors.cv ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                <div className="space-y-1 text-center">
                  <span className="text-2xl mb-2 block">📄</span>
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-green-700 hover:text-green-600">
                      <span>Upload a file</span>
                      <input name="cv" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">{cvFile ? cvFile.name : 'PDF up to 10MB'}</p>
                </div>
              </div>
              {errors.cv && <p className="text-red-600 text-xs mt-1">{errors.cv}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting Application...' : 'Submit Registration'}
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/" className="text-green-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
