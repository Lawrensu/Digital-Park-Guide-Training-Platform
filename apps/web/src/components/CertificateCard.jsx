import { Download, Calendar } from 'lucide-react'
import Button from './Button'

export default function CertificateCard({ certification }) {
  const isExpiring = new Date(certification.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  const isExpired = new Date(certification.expiryDate) < new Date()

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border-l-4 border-primary overflow-hidden hover:shadow-medium transition">
      {/* Certificate-like header */}
      <div className="bg-gradient-to-r from-primary to-primary-light p-6 text-white relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        <h3 className="font-heading font-bold text-2xl mb-2 relative z-10">
          🎓 {certification.title}
        </h3>
        <p className="text-primary-light opacity-90 text-sm font-mono">
          {certification.certificateNumber}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Issued Date</p>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              <span className="font-serif">{formatDate(certification.issueDate)}</span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm font-semibold mb-1">Expiry Date</p>
            <div className="flex items-center gap-2">
              <Calendar size={18} className={isExpired ? 'text-red-500' : isExpiring ? 'text-orange-500' : 'text-primary'} />
              <span className={`font-serif ${isExpired ? 'text-red-600' : isExpiring ? 'text-orange-600' : ''}`}>
                {formatDate(certification.expiryDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          {isExpired && (
            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold">
              ⚠️ Expired
            </span>
          )}
          {isExpiring && !isExpired && (
            <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-sm font-semibold">
              ⚠️ Expiring Soon
            </span>
          )}
          {!isExpired && !isExpiring && (
            <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold">
              ✓ Active
            </span>
          )}
        </div>

        {/* Download Button */}
        <Button
          variant="primary"
          size="md"
          className="w-full flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download Certificate
        </Button>
      </div>
    </div>
  )
}
