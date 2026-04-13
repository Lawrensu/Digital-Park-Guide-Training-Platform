# Digital Park Guide Training Platform - Web App

## 🚀 Quick Start Guide

This is a modern, responsive web application for the Digital Park Guide Training Platform built with React, Vite, TailwindCSS, and React Router.

## 📋 Features

- **🎓 Course Management**: Browse, filter, and manage training courses
- **🎬 Video Lessons**: View lessons with video players and descriptions
- **📝 Interactive Quizzes**: Take quizzes with immediate feedback and scoring
- **🏆 Certifications**: Track and manage earned certifications
- **📊 Dashboard**: Overview of learning progress and achievements
- **🎨 Modern UI**: Nature-themed design with TailwindCSS
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile
- **⚡ Fast**: Built with Vite for rapid development and optimized builds

## 🛠️ Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v9 or higher (package manager)

## 📦 Installation

### Step 1: Install Dependencies

```bash
# From the project root
pnpm install

# Or from the web app directory
cd apps/web
pnpm install
```

### Step 2: Start Development Server

```bash
# From the project root
pnpm dev

# The web app will be available at http://localhost:5173
```

## 🎯 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Navbar.jsx       # Navigation bar
│   ├── Button.jsx       # Custom button component
│   ├── CourseCard.jsx   # Course display card
│   ├── ProgressBar.jsx  # Progress indicator
│   ├── QuizOption.jsx   # Quiz option selector
│   └── CertificateCard.jsx # Certificate display
├── pages/               # Page components
│   ├── LoginPage.jsx           # Login form
│   ├── DashboardPage.jsx       # Main dashboard
│   ├── CourseListPage.jsx      # All courses
│   ├── LessonPage.jsx          # Lesson view
│   ├── QuizPage.jsx            # Quiz interface
│   └── CertificationPage.jsx   # Certificates
├── data/                # Mock data
│   └── courses.js       # Course, lesson, and quiz data
├── App.jsx              # Main app with routing
├── main.jsx             # Entry point
├── App.css              # Global styles
└── index.css            # TailwindCSS imports
```

## 🎨 Design System

### Color Palette (Nature-themed)

- **Primary**: `#16a34a` (Green) - Main actions and accents
- **Secondary**: `#22c55e` (Light Green) - Secondary actions
- **Dark**: `#15803d` (Dark Green) - Hover states
- **Accent**: `#f59e0b` (Amber) - Highlights
- **Water**: `#0369a1` (Sky Blue) - Information

### Typography

- **Headings**: Poppins (Bold, Sans-serif)
- **Body**: Merriweather (Serif)
- **UI Elements**: Poppins (Regular, Sans-serif)

## 🔄 Routing

The app uses React Router v6 for navigation:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Redirect | Redirects to login |
| `/login` | LoginPage | User authentication |
| `/dashboard` | DashboardPage | Main dashboard |
| `/courses` | CourseListPage | All available courses |
| `/lesson/:courseId` | LessonPage | Video lessons |
| `/quiz/:courseId` | QuizPage | Course quizzes |
| `/certificates` | CertificationPage | Earned certificates |

## 📚 Components

### Navbar
- Sticky navigation bar
- Links to main pages
- Mobile-responsive hamburger menu
- Logout button

### Button
Variants:
- `primary` - Main action
- `secondary` - Alternative action
- `outline` - Bordered style
- `ghost` - Minimal style
- `danger` - Destructive action

Sizes: `sm`, `md`, `lg`

### CourseCard
- Course image
- Title and description
- Progress bar
- Category badge
- Lesson/duration info
- CTA button

### ProgressBar
- Visual progress indicator
- Customizable size
- Optional label
- Smooth animations

### QuizOption
- Selectable answer options
- Visual feedback on selection
- Correct/incorrect highlighting
- Disabled state support

### CertificateCard
- Certificate details
- Expiry date tracking
- Status indicators
- Download button

## 💾 Mock Data

The app uses hardcoded mock data in `src/data/courses.js`:

- **Courses**: 6 sample courses with different categories
- **Lessons**: Video lessons for each course
- **Quizzes**: Multiple choice questions per course
- **Certificates**: Sample user certificates
- **Progress**: User learning statistics

To connect real data, replace the mock data with API calls in components.

## 🧪 Demo Credentials

For the login page:
- **Email**: `guide@park.com`
- **Password**: `demo123`

## 🔧 Build for Production

```bash
# Build the app
pnpm build

# Preview the production build
pnpm preview
```

The build output will be in the `dist/` directory.

## 📝 Linting

```bash
# Run ESLint
pnpm lint

# Fix linting issues
pnpm lint --fix
```

## 🌐 Environment Setup

Create a `.env` file if needed for API endpoints:

```
VITE_API_URL=http://localhost:3000/api
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL
```

## 🎓 Next Steps

1. **Connect to Backend**: Replace mock data with API calls
2. **Add Authentication**: Implement JWT login flow
3. **Error Handling**: Add proper error boundaries and handling
4. **State Management**: Consider Redux or Zustand for complex state
5. **Testing**: Add unit and integration tests with Vitest
6. **Analytics**: Track user progress and engagement
7. **Notifications**: Implement toast notifications
8. **PWA**: Make the app installable as PWA

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [TailwindCSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

- Follow the existing component structure
- Use TailwindCSS for styling (no CSS modules)
- Write functional components with hooks
- Keep components modular and reusable
- Add comments for complex logic

## 📄 License

Part of the Digital Park Guide Training Platform project.

---

**Happy Learning! 🌳**
