# Digital Park Guide Training Platform - Frontend (Web)

A modern, responsive React web application for a Digital Park Guide Training Platform. Built with Vite, React Router, and TailwindCSS.

## 🌿 Features

- **User Authentication**: Secure login page with validation and error handling
- **Dashboard**: Welcome message, progress overview, notifications, and course recommendations
- **Course Catalog**: Browse, search, and filter courses by category
- **Interactive Lessons**: Video player with lesson content, infographics, and navigation
- **Quizzes**: Multiple-choice quizzes with instant feedback and explanations
- **Certificates**: View, download, and share earned certificates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI**: Nature-themed color palette with modern styling

## 🛠️ Project Structure

```
frontend/web/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── Button.jsx           # Reusable button component
│   │   ├── ProgressBar.jsx      # Progress indicator
│   │   ├── CourseCard.jsx       # Course card component
│   │   ├── QuizOption.jsx       # Quiz answer option
│   │   └── CertificateCard.jsx  # Certificate display
│   ├── pages/
│   │   ├── LoginPage.jsx        # Login page
│   │   ├── DashboardPage.jsx    # Dashboard page
│   │   ├── CourseListPage.jsx   # Course catalog
│   │   ├── LessonPage.jsx       # Lesson viewer
│   │   ├── QuizPage.jsx         # Quiz interface
│   │   └── CertificationPage.jsx # Certificate management
│   ├── data/
│   │   └── courses.js           # Mock data for courses, lessons, quizzes
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # TailwindCSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🎨 Design System

### Colors
- **Primary**: Green 700 (`#15803d`) - Main brand color
- **Secondary**: Green 500 (`#22c55e`) - Secondary actions
- **Background**: Gray 50 (`#f9fafb`)

### Typography
- **Headings**: Merriweather (Serif) - Professional, elegant
- **Body**: Inter (Sans Serif) - Clean, readable

### Components
- Rounded cards (`rounded-2xl`)
- Soft shadows for depth
- Smooth transitions and animations
- Accessible form inputs

## 📋 Routes

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Login page | ❌ |
| `/dashboard` | Main dashboard | ✅ |
| `/courses` | Course catalog | ✅ |
| `/lesson` | Watch lessons | ✅ |
| `/quiz` | Complete quizzes | ✅ |
| `/certificates` | View certificates | ✅ |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the web directory:
```bash
cd frontend/web
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Demo Credentials

- **Email**: `guide@example.com`
- **Password**: `password123`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 📚 Key Pages

### Login Page
- Email and password validation
- Error handling with visual feedback
- Demo credentials display
- Nature-themed background with gradient

### Dashboard
- Welcome greeting with user name
- Progress statistics (overall, completed courses, learning time)
- Recent course recommendations
- Notifications section
- Weekly schedule and deadlines
- Learning insights

### Course List
- Search functionality
- Filter by category (Biodiversity, Safety, Eco-tourism)
- Course cards with progress indicators
- Course metadata (lessons, duration)
- Responsive grid layout

### Lesson Page
- Video player with full controls
- Lesson description and information
- Infographic/image section
- Key takeaways
- Additional resources
- Progress tracking
- Lesson navigation sidebar

### Quiz Page
- Multiple choice questions (A/B/C/D)
- Instant feedback on selection
- Explanation for correct/incorrect answers
- Progress tracking
- Results screen with score breakdown
- Option to retake quiz

### Certification Page
- Certificate display cards
- Certificate details (course, date, instructor)
- Download certificate button (UI only)
- Share certificate option
- Learning continuation prompts

## 🎯 Mock Data

All data is stored locally in `src/data/courses.js`:

- **Courses**: 6 sample courses with varying categories and progress
- **Lessons**: Video lessons with descriptions and infographics
- **Quizzes**: Multiple-choice questions with explanations
- **Certifications**: Completed course certificates with details

Sample courses included:
- Biodiversity Hotspots
- Park Safety Essentials  
- Eco-Tourism Best Practices
- Conservation Efforts
- Wildlife Photography
- First Aid for Guides

## 🔐 Authentication

Currently uses:
- `localStorage` for user session management
- Form validation with error messages
- Protected routes with automatic redirect to login
- Auto-logout when page is refreshed (clear localStorage)

For production, integrate with a real authentication backend (JWT, OAuth, etc.).

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (single column layout)
- **Tablet**: 640px - 1024px (2 column layout)
- **Desktop**: > 1024px (3 column grid layout)

All components are fully responsive and tested on multiple screen sizes.

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#15803d',
  'primary-dark': '#166534',
  secondary: '#22c55e',
  'secondary-light': '#86efac',
}
```

### Fonts
Edit `index.html` and `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Merriweather', 'Georgia', 'serif'],
}
```

### Mock Data
Edit `src/data/courses.js` to add or modify:
- Courses and lessons
- Quiz questions
- Certifications
- Course categories

## 📦 Dependencies

- **react** (18.2.0): UI library
- **react-dom** (18.2.0): DOM rendering
- **react-router-dom** (6.20.1): Client-side routing
- **tailwindcss** (3.3.6): Utility-first CSS framework
- **vite** (5.0.8): Build tool

## 🔄 User Flow

1. **Login** → Enter email/password → Validate → Store user in localStorage
2. **Dashboard** → View overview, stats, and recent courses
3. **Browse Courses** → Search, filter, view course cards
4. **Watch Lessons** → Video playback, read content, navigate lessons
5. **Complete Quiz** → Answer questions, view feedback
6. **View Certificates** → Display achievements, download, share

## 💡 Features to Extend

- Integration with a real backend API (Node.js, Django, etc.)
- User account management (profile, settings, preferences)
- Video hosting integration (YouTube, Vimeo, AWS)
- Certificate PDF generation (jsPDF)
- Progress persistence to backend
- Social sharing (LinkedIn, Twitter, Facebook)
- Discussion forums and comments
- Instructor profiles
- Course ratings and reviews
- Email notifications
- Dark mode support
- Multi-language support (i18n)
- Advanced analytics
- Learning paths and recommendations

## 🌟 Code Quality

- Component-based architecture
- Functional components with React hooks
- No inline styles (TailwindCSS only)
- Clear naming conventions
- Comments for complex logic
- Modular and reusable components
- Responsive and accessible UI

## 📊 Performance

- Built with Vite for fast development and production builds
- Optimized bundle size
- Lazy loading for routes (can be added)
- Image optimization via URLs
- CSS minification with TailwindCSS

## 📸 Sample Data

The application includes realistic sample data:

**Courses:**
- 6 courses across 3 categories
- Mix of progress states (completed, in-progress, not-started)
- Real-world titles and descriptions

**Lessons:**
- Video content with descriptions
- Infographics from Unsplash
- Multiple lessons per course

**Quizzes:**
- 3 questions per quiz
- Realistic educational content
- Explanations for each answer

**Certifications:**
- Sample certificates with completion dates
- Certificate numbers
- Instructor information

## 🚀 Deployment

To deploy to production:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service:
   - Vercel (recommended)
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages
   - Traditional web server

Example for Vercel:
```bash
npm i -g vercel
vercel
```

## 📜 License

This project is part of the Digital Park Guide Training Platform.

## 👥 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for nature conservation and education** 🌿🎓