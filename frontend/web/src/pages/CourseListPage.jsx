import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';
import { courses } from '../data/courses';

// Course list page with search and filter functionality
export default function CourseListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = ['Biodiversity', 'Safety', 'Eco-tourism'];

  // Filter courses based on search and category
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Course Catalog
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our comprehensive training courses for professional park guides
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-12 text-lg"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <p className="text-gray-600 font-medium">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔎</span>
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Featured Section */}
        {filteredCourses.length > 0 && (
          <div className="card p-8 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                  🌟 Complete a Certification
                </h3>
                <p className="text-gray-700 max-w-xl">
                  Earn industry-recognized certificates by completing courses and passing assessments. 
                  Showcase your expertise and advance your career in eco-tourism.
                </p>
              </div>
              <a href="/certificates" className="ml-4">
                <Button variant="primary">View Certificates</Button>
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
