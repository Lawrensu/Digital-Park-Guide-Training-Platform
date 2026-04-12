import Button from './Button';

// Certificate card component
export default function CertificateCard({ certificate }) {
  return (
    <div className="card p-8 max-w-md mx-auto">
      {/* Certificate Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🏆</span>
        </div>
        <h3 className="font-serif text-2xl font-bold text-green-700 mb-2">
          Certificate of Completion
        </h3>
        <p className="text-gray-600 text-sm">Digital Park Guide Academy</p>
      </div>

      {/* Certificate Details */}
      <div className="space-y-6 border-t border-b border-gray-200 py-6">
        {/* Course Name */}
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Course Completed</p>
          <p className="font-serif text-lg font-bold text-gray-900">
            {certificate.courseName}
          </p>
        </div>

        {/* Certificate Number */}
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Certificate Number</p>
          <p className="font-mono text-sm text-gray-700">
            {certificate.certificateNumber}
          </p>
        </div>

        {/* Completion Date */}
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Completion Date</p>
          <p className="text-gray-700">
            {new Date(certificate.completionDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Instructor */}
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Instructor</p>
          <p className="text-gray-700">
            {certificate.instructor}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col space-y-3">
        <Button variant="primary" className="w-full">
          📥 Download Certificate
        </Button>
        <Button variant="outline" className="w-full">
          🔗 Share Certificate
        </Button>
      </div>
    </div>
  );
}
