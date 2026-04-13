# Developer Guide - Web App Architecture

## 🏗️ Component Architecture

### Component Hierarchy

```
App (Router)
├── Pages
│   ├── LoginPage
│   ├── DashboardPage
│   │   ├── Navbar
│   │   ├── CourseCard (repeated)
│   │   └── Notifications
│   ├── CourseListPage
│   │   ├── Navbar
│   │   └── CourseCard (repeated)
│   ├── LessonPage
│   │   ├── Navbar
│   │   ├── VideoPlayer
│   │   └── LessonSidebar
│   ├── QuizPage
│   │   ├── Navbar
│   │   └── QuizOption (repeated)
│   └── CertificationPage
│       ├── Navbar
│       └── CertificateCard (repeated)
```

### Component Types

#### 1. **Layout Components**
Provide structure and navigation.
- `Navbar` - Top navigation
- Consider adding: `Sidebar`, `Footer`

#### 2. **Page Components**
Full-page views with complete functionality.
- Located in `/pages`
- Manage page-specific state
- Handle routing

#### 3. **Reusable Components**
Small, focused components used across pages.
- Located in `/components`
- Single responsibility
- Props-based customization
- No page-specific logic

## 📋 Component Patterns

### Button Component Pattern

```jsx
// src/components/Button.jsx
export default function Button({
  variant = 'primary',      // multiple variants
  size = 'md',              // multiple sizes
  disabled = false,         // state handling
  className = '',           // Tailwind customization
  children,                 // content
  ...props                  // spread remaining props
}) {
  const baseStyles = '...'  // Base classes
  const variants = {...}    // Variant styles
  const sizes = {...}       // Size styles
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

// Usage
<Button variant="primary" size="lg" onClick={handleClick}>
  Click Me
</Button>
```

### Page Component Pattern

```jsx
// src/pages/ExamplePage.jsx
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function ExamplePage() {
  const navigate = useNavigate()
  const [state, setState] = useState(null)
  
  const handleAction = () => {
    // Handle action
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page content */}
      </div>
    </div>
  )
}
```

## 🎨 Styling Convention

### Tailwind Only
- Never use CSS modules or styled-components
- Static classes only (no dynamic class generation)
- Use `className` prop for customization

```jsx
// ✅ Good
<div className="bg-primary text-white p-6 rounded-lg" />
<button className={`${isActive ? 'bg-primary' : 'bg-gray-200'}`} />

// ❌ Avoid
<div className={`bg-${color} p-${size}`} />  // Dynamic values don't work
```

### Naming Convention

Use descriptive names matching functionality:
- `bg-primary` - Primary background color
- `text-gray-900` - Text color
- `rounded-2xl` - Large border radius
- `shadow-soft` - Soft shadow effect
- `hover:` - Hover states
- `focus:` - Focus states
- `disabled:` - Disabled states

## 🔄 State Management

### Current Approach: Local State

```jsx
const [selectedAnswer, setSelectedAnswer] = useState(null)
const [showResults, setShowResults] = useState(false)
```

### For Complex Apps: Consider Redux/Zustand

```javascript
// Future: Zustand store example
import create from 'zustand'

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

## 📡 API Integration

### Current: Mock Data

```jsx
import { coursesData } from '../data/courses'

// Use directly
const courses = coursesData
```

### Future: API Calls

```jsx
import { useEffect, useState } from 'react'

export default function CourseListPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchCourses()
  }, [])
  
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setCourses(data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) return <LoadingScreen />
  
  return <CourseList courses={courses} />
}
```

## 🏗️ Adding New Features

### Step 1: Create Component Structure

```bash
# Create page
touch src/pages/NewFeaturePage.jsx

# Create components if needed
touch src/components/NewFeatureComponent.jsx
```

### Step 2: Implement Component

```jsx
// src/components/NewFeatureComponent.jsx
import { useState } from 'react'
import Button from './Button'

export default function NewFeatureComponent() {
  const [data, setData] = useState(null)
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft">
      {/* Component content */}
    </div>
  )
}
```

### Step 3: Create Page

```jsx
// src/pages/NewFeaturePage.jsx
import Navbar from '../components/Navbar'
import NewFeatureComponent from '../components/NewFeatureComponent'

export default function NewFeaturePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="font-heading font-bold text-4xl mb-8">
          New Feature
        </h1>
        <NewFeatureComponent />
      </div>
    </div>
  )
}
```

### Step 4: Add Route

```jsx
// src/App.jsx
import NewFeaturePage from './pages/NewFeaturePage'

function App() {
  return (
    <Router>
      <Routes>
        {/* ... existing routes */}
        <Route path="/new-feature" element={<NewFeaturePage />} />
      </Routes>
    </Router>
  )
}
```

### Step 5: Add Navigation

```jsx
// src/components/Navbar.jsx
<Link to="/new-feature">
  New Feature
</Link>
```

## 🧪 Testing Checklist

Before committing new components:

- [ ] Component renders without errors
- [ ] All props work correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Hover/focus states work
- [ ] Icons aligned properly
- [ ] Text readable with all content
- [ ] Accessibility: keyboard navigation
- [ ] No console warnings

## 🎨 Color System

Add custom colors in `tailwind.config.js`:

```javascript
colors: {
  'primary': '#16a34a',
  'primary-light': '#22c55e',
  'primary-dark': '#15803d',
  'secondary': '#84cc16',
  'accent': '#f59e0b',
  'earth': '#78350f',
  'water': '#0369a1',
}
```

Use consistently:
```jsx
<button className="bg-primary hover:bg-primary-dark">
  Action
</button>
```

## 📐 Breakpoints

Tailwind default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Usage:
```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid that changes columns at breakpoints */}
</div>
```

## 📦 Adding Dependencies

Always use pnpm:

```bash
# Add dependency
pnpm add package-name

# Add dev dependency
pnpm add -D package-name

# Install all
pnpm install
```

Update `package.json` is automatic.

## 🚀 Performance Tips

1. **Code Splitting**: React Router handles this automatically
2. **Image Optimization**: Use responsive images
3. **Lazy Loading**: Consider React.lazy() for heavy components
4. **Memoization**: Use React.memo for expensive re-renders

```jsx
import { memo } from 'react'

const CourseCard = memo(({ course }) => (
  // Component doesn't re-render if props haven't changed
))
```

## 🐛 Debugging

### Browser DevTools
1. React DevTools extension
2. Vue DevTools for component inspection
3. Network tab for API calls
4. Console for errors

### Logging
```jsx
useEffect(() => {
  console.log('Course loaded:', course)
}, [course])
```

## 📞 Common Issues & Solutions

### Issue: Tailwind classes not applying

**Solution**: Make sure file paths are correct in `tailwind.config.js`:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,jsx}",  // Include all JS/JSX files
]
```

### Issue: Routes not working

**Solution**: Ensure `<Router>` wraps all `<Routes>` in App.jsx

### Issue: Images not loading

**Solution**: Check image paths are relative or use import:
```jsx
import heroImg from './assets/hero.png'
<img src={heroImg} />
```

## 📚 Resources

- [React Hooks Documentation](https://react.dev/reference/react)
- [TailwindCSS Utilities](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev/icons)

## 🤝 Code Style

- Use functional components
- Use hooks for state/effects
- Destructure props
- Add JSDoc comments for complex logic
- Keep components under 300 lines
- One component per file

---

**Last Updated**: April 2026
