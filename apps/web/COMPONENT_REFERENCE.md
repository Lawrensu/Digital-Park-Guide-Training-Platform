# Component & Page Reference Guide

Complete reference for all components and pages in the Digital Park Guide Training Platform web app.

---

## 📄 Pages

### LoginPage
**Location**: `src/pages/LoginPage.jsx`

**Purpose**: User authentication interface

**Features**:
- Email & password input fields
- Form validation
- Remember me checkbox
- Show/hide password toggle
- Demo credentials display
- Loading state
- Error messages

**Props**: None (Page component)

**State**:
- `email` - User email
- `password` - User password
- `showPassword` - Password visibility
- `errors` - Validation errors
- `isLoading` - Loading state

**Example**:
```jsx
<Route path="/login" element={<LoginPage />} />
```

---

### DashboardPage
**Location**: `src/pages/DashboardPage.jsx`

**Purpose**: Main user dashboard with overview and recommendations

**Features**:
- Welcome message with user stats
- Progress overview cards
- Streaks display
- In-progress courses carousel
- Notifications section
- Statistics (completed, active, score, hours)

**Props**: None (Page component)

**Example**:
```jsx
<Route path="/dashboard" element={<DashboardPage />} />
```

---

### CourseListPage
**Location**: `src/pages/CourseListPage.jsx`

**Purpose**: Browse and filter all available courses

**Features**:
- Search by title/description
- Filter by category (All, Biodiversity, Safety, Eco-tourism)
- Sort options (Latest, Title, Progress)
- Results count display
- Empty state with clear filters button
- Responsive grid layout

**Props**: None (Page component)

**State**:
- `searchQuery` - Search text
- `selectedCategory` - Active filter
- `sortBy` - Sort option

**Example**:
```jsx
<Route path="/courses" element={<CourseListPage />} />
```

---

### LessonPage
**Location**: `src/pages/LessonPage.jsx`

**Purpose**: Display video lessons with materials

**Features**:
- Video player
- Lesson title and description
- Previous/Next navigation
- Mark as complete button
- Sidebar with lesson list
- Progress indicator
- Duration display

**Props**: None (uses router params: `courseId`)

**State**:
- `currentLessonIndex` - Current lesson
- `completedLessons` - Completion status array

**Example**:
```jsx
<Route path="/lesson/:courseId" element={<LessonPage />} />
```

---

### QuizPage
**Location**: `src/pages/QuizPage.jsx`

**Purpose**: Interactive quiz interface

**Features**:
- Multiple choice questions
- Progress bar
- Answer tracking
- Result view with detailed feedback
- Score calculation
- Question navigation
- Answer checklist grid
- Retake functionality

**Props**: None (uses router params: `courseId`)

**State**:
- `currentQuestion` - Active question index
- `answers` - User answers object
- `showResults` - Results view flag

**Example**:
```jsx
<Route path="/quiz/:courseId" element={<QuizPage />} />
```

---

### CertificationPage
**Location**: `src/pages/CertificationPage.jsx`

**Purpose**: View and manage earned certificates

**Features**:
- Certificate statistics
- Active/expired status
- Certificate details cards
- Download functionality
- Career advancement info
- Benefits display

**Props**: None (Page component)

**Example**:
```jsx
<Route path="/certificates" element={<CertificationPage />} />
```

---

## 🧩 Components

### Navbar
**Location**: `src/components/Navbar.jsx`

**Purpose**: Top navigation bar

**Props**:
- None (self-contained)

**Features**:
- App logo
- Navigation links
- Logout button
- Mobile hamburger menu
- Sticky positioning

**Example**:
```jsx
import Navbar from '../components/Navbar'

export default function MyPage() {
  return (
    <>
      <Navbar />
      {/* Page content */}
    </>
  )
}
```

---

### Button
**Location**: `src/components/Button.jsx`

**Purpose**: Reusable button component with multiple variants

**Props**:
- `variant` (string): 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size` (string): 'sm' | 'md' | 'lg'
- `children` (ReactNode): Button content
- `className` (string): Additional Tailwind classes
- `disabled` (boolean): Disable button
- `...props`: All standard HTML button attributes

**Example**:
```jsx
<Button 
  variant="primary" 
  size="lg" 
  onClick={handleClick}
  disabled={isLoading}
>
  Click Me
</Button>
```

---

### CourseCard
**Location**: `src/components/CourseCard.jsx`

**Purpose**: Display course information in card format

**Props**:
- `course` (object): Course data
  - `id` (number)
  - `title` (string)
  - `description` (string)
  - `category` (string)
  - `image` (string): Image URL
  - `progress` (number): 0-100
  - `lessons` (number)
  - `duration` (string)
  - `color` (string): Tailwind class
  - `icon` (string): Emoji
- `onStart` (function, optional): Callback when starting

**Example**:
```jsx
<CourseCard 
  course={courseData} 
  onStart={(id) => console.log('Started', id)}
/>
```

---

### ProgressBar
**Location**: `src/components/ProgressBar.jsx`

**Purpose**: Visual progress indicator

**Props**:
- `progress` (number): 0-100
- `size` (string): 'sm' | 'md' | 'lg' (default: 'md')
- `label` (string, optional): Display label

**Example**:
```jsx
<ProgressBar progress={75} size="md" label="75% complete" />
```

---

### QuizOption
**Location**: `src/components/QuizOption.jsx`

**Purpose**: Selectable answer option for quizzes

**Props**:
- `id` (number): Option index
- `option` (string): Option text
- `isSelected` (boolean): Selected state
- `isCorrect` (boolean, optional): Correct answer flag
- `isIncorrect` (boolean, optional): Incorrect answer flag
- `onClick` (function): Selection handler
- `disabled` (boolean): Disable selection
- `showResult` (boolean): Show correct/incorrect feedback

**Example**:
```jsx
<QuizOption
  id={0}
  option="Option A"
  isSelected={selectedId === 0}
  isCorrect={answer === 0 && showResults}
  onClick={() => setSelectedId(0)}
  showResult={showResults}
/>
```

---

### CertificateCard
**Location**: `src/components/CertificateCard.jsx`

**Purpose**: Display certificate information

**Props**:
- `certification` (object): Certificate data
  - `id` (number)
  - `title` (string)
  - `issueDate` (string): ISO date
  - `expiryDate` (string): ISO date
  - `certificateNumber` (string)
  - `status` (string): 'active' | 'expired'

**Example**:
```jsx
<CertificateCard certification={certData} />
```

---

## 📊 Mock Data Structure

### courses.js
**Location**: `src/data/courses.js`

**Exports**:

#### coursesData (Array)
```javascript
[
  {
    id: 1,
    title: 'Course Title',
    description: 'Course description',
    category: 'Biodiversity|Safety|Eco-tourism',
    image: 'image-url',
    progress: 0-100,
    lessons: number,
    duration: '2 hours',
    color: 'tailwind-class',
    icon: 'emoji'
  }
]
```

#### lessonsData (Object)
```javascript
{
  courseId: [
    {
      id: number,
      title: 'Lesson Title',
      video: 'video-url',
      description: 'Description',
      duration: '12 min',
      completed: boolean
    }
  ]
}
```

#### quizzesData (Object)
```javascript
{
  courseId: {
    title: 'Quiz Title',
    questions: [
      {
        id: number,
        question: 'Question text?',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct: 0 // Index of correct option
      }
    ]
  }
}
```

#### certificationsData (Array)
```javascript
[
  {
    id: number,
    title: 'Certificate Title',
    issueDate: 'YYYY-MM-DD',
    expiryDate: 'YYYY-MM-DD',
    certificateNumber: 'CERT-XXX-XXX',
    status: 'active|expired'
  }
]
```

---

## 🔄 Routing Map

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Redirect | → `/login` |
| `/login` | LoginPage | Authentication |
| `/dashboard` | DashboardPage | Main dashboard |
| `/courses` | CourseListPage | All courses |
| `/lesson/:courseId` | LessonPage | Video lessons |
| `/quiz/:courseId` | QuizPage | Quiz interface |
| `/certificates` | CertificationPage | Certificates |
| `*` | Redirect | → `/dashboard` |

---

## 🎨 Design Tokens

### Colors
```
--primary: #16a34a (green-600)
--primary-light: #22c55e (green-500)
--primary-dark: #15803d (green-700)
--secondary: #84cc16 (lime-500)
--accent: #f59e0b (amber-500)
--earth: #78350f (amber-900)
--water: #0369a1 (sky-700)
--text: #1f2937 (gray-800)
--bg: #f9fafb (gray-50)
--border: #e5e7eb (gray-200)
```

### Shadows
```
shadow-soft: 0 4px 6px rgba(0, 0, 0, 0.07)
shadow-medium: 0 10px 15px rgba(0, 0, 0, 0.1)
shadow-large: 0 20px 25px rgba(0, 0, 0, 0.15)
```

### Border Radius
```
rounded-lg: 0.5rem
rounded-xl: 0.75rem
rounded-2xl: 1rem
rounded-3xl: 1.5rem
```

---

## 📋 Component Checklist

When creating new components:

- [ ] Located in `/components` folder
- [ ] Uses functional component with hooks
- [ ] Props documented with JSDoc
- [ ] Styled with TailwindCSS only
- [ ] No inline styles
- [ ] Accessible (keyboard, ARIA labels)
- [ ] Responsive design
- [ ] Error states handled
- [ ] Loading states considered
- [ ] Focus visible for interactive elements

---

**Version**: 1.0
**Last Updated**: April 2026
