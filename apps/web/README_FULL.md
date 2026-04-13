# 🌳 Digital Park Guide Training Platform - Web Application

A modern, responsive web application for training park guides with course management, video lessons, interactive quizzes, and certification tracking.

## ✨ Features

### 📚 Course Management
- Browse 6+ training courses organized by category
- Advanced filtering by biodiversity, safety, and eco-tourism
- Search functionality across course titles and descriptions
- Real-time progress tracking
- Course completion status indicators

### 🎬 Video Learning
- Integrated video player for lessons
- Lesson descriptions and metadata
- Lesson progress tracking
- Mark lessons as complete
- Navigation between lessons

### 📝 Interactive Quizzes
- Multiple choice questions with immediate feedback
- Real-time answer validation
- Detailed results review
- Score calculation and passing criteria
- Retake functionality

### 🏆 Certifications
- View earned certificates
- Track expiration dates
- Download certificate PDFs
- Certificate status indicators
- Career advancement information

### 🎨 Modern Dashboard
- Welcome overview with stats
- Active course recommendations
- Learning statistics and achievements
- Notification center
- Streak tracking

### 📱 Responsive Design
- Mobile-first approach
- Tablet optimized
- Desktop responsive
- Touch-friendly interfaces
- Adaptive layouts

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Digital-Park-Guide-Training-Platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Visit the app**
   - Web app: http://localhost:5173
   - API: http://localhost:3000

### Demo Credentials

```
Email: guide@park.com
Password: demo123
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 19 | UI library |
| **Build Tool** | Vite | Fast bundler |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Routing** | React Router v6 | Client-side navigation |
| **Icons** | Lucide React | Icon library |
| **Typography** | Poppins + Merriweather | Custom fonts |
| **Colors** | Nature-inspired palette | Eco-themed design |

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation header
│   │   ├── Button.jsx       # Multi-variant button
│   │   ├── CourseCard.jsx   # Course display
│   │   ├── ProgressBar.jsx  # Progress indicator
│   │   ├── QuizOption.jsx   # Quiz answer option
│   │   └── CertificateCard.jsx # Certificate display
│   ├── pages/               # Page components
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CourseListPage.jsx
│   │   ├── LessonPage.jsx
│   │   ├── QuizPage.jsx
│   │   └── CertificationPage.jsx
│   ├── data/
│   │   └── courses.js       # Mock data
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # React entry point
│   ├── App.css              # Global styles
│   └── index.css            # TailwindCSS + base styles
├── public/                  # Static assets
├── package.json             # Dependencies
├── tailwind.config.js       # TailwindCSS config
├── postcss.config.js        # PostCSS config
├── vite.config.js           # Vite config
├── QUICKSTART.md            # Quick start guide
└── README.md

