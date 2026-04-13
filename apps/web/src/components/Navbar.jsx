import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-3xl">🌳</span>
            <span className="font-heading font-bold text-xl text-primary">
              Park Guide Training
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-primary transition"
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="text-gray-700 hover:text-primary transition"
            >
              Courses
            </Link>
            <Link
              to="/certificates"
              className="text-gray-700 hover:text-primary transition"
            >
              Certificates
            </Link>
            <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition">
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            <Link
              to="/dashboard"
              className="block py-2 text-gray-700 hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/courses"
              className="block py-2 text-gray-700 hover:text-primary"
            >
              Courses
            </Link>
            <Link
              to="/certificates"
              className="block py-2 text-gray-700 hover:text-primary"
            >
              Certificates
            </Link>
            <button className="w-full mt-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
