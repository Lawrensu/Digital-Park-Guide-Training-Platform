# Setup & Running Instructions

## 📦 Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) - Verify with `npm --version`
- **Git** (optional, for version control)

### Verify Installation

```bash
node --version  # Should show v16+ 
npm --version   # Should show 8+
```

## 🚀 Quick Start (5 minutes)

### 1. Navigate to Project Directory

```bash
cd frontend/web
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:
- React & React DOM
- React Router
- TailwindCSS
- Vite

### 3. Start Development Server

```bash
npm run dev
```

The terminal will output something like:
```
VITE v5.0.8  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

### 4. Open in Browser

The browser should automatically open to `http://localhost:5173/`

If not, manually go to: **http://localhost:5173/**

## 🔐 Login

Use the demo credentials shown on the login page:

- **Email**: `guide@example.com`
- **Password**: `password123`

Or use any email and password (6+ characters) to create a new session.

## 🎯 Explore the Application

After logging in, you can:

1. **Dashboard** - View your learning progress and upcoming deadlines
2. **Courses** - Browse all available courses and filter by category
3. **Lessons** - Watch video content and read lesson materials
4. **Quizzes** - Test your knowledge with multiple-choice questions
5. **Certificates** - View your earned certificates

## 📁 Project Structure Overview

```
frontend/web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Full-page components
│   ├── data/           # Mock data (courses, quizzes, etc.)
│   ├── App.jsx         # Main app with routing
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # TailwindCSS configuration
├── package.json        # Dependencies
└── README.md           # Detailed documentation
```

## ⚙️ Available Scripts

### Development Server
```bash
npm run dev
```
Starts development server with hot reload at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Builds optimized production files in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Preview production build locally before deploying

### Linting (Optional)
```bash
npm run lint
```
Check code quality (requires eslint configuration)

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#15803d',      // Change green shade
  secondary: '#22c55e',    // Change accent color
}
```

### Change Fonts
Edit `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Your-Font:wght@400;700&display=swap" rel="stylesheet">
```

### Add Courses
Edit `src/data/courses.js`:
```javascript
{
  id: 7,
  title: "Your New Course",
  description: "Description here",
  image: "image-url",
  category: "Your Category",
  lessons: 5,
  progress: 0,
  status: "not-started",
  lessons_data: [...]
}
```

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
# Kill the process using port 5173, or start on different port
npm run dev -- --port 5174
```

### Dependencies Installation Error
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Styling Not Applied
```bash
# Clear browser cache and restart dev server
npm run dev
# Then do hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### localhost:5173 Not Opening
Manually visit: `http://localhost:5173/`

If still not working, check terminal for errors and make sure port 5173 is available.

## 📦 Building for Production

### Step 1: Create Production Build
```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Step 2: Test Production Build Locally
```bash
npm run preview
```

Visit `http://localhost:4173/` to preview

### Step 3: Deploy

**Option A: Vercel (Recommended)**
```bash
npm i -g vercel
vercel
```

**Option B: Netlify**
- Connect your GitHub repo to Netlify
- Set build command: `npm run build`
- Set publish directory: `dist`

**Option C: Other Hosting**
- Upload the `dist/` folder to your web server
- Set up routing to serve `index.html` for all routes

## 🔄 File Structure & What Goes Where

- **src/components/** - Reusable components (Navbar, Button, etc.)
- **src/pages/** - Full pages (Dashboard, Courses, etc.)
- **src/data/** - Mock data and constants
- **src/index.css** - Global styles and Tailwind
- **index.html** - Main HTML file

## 📝 Notes

- All data is stored in `localStorage` (not persistent after browser clear)
- No backend API is integrated (use mock data)
- Images use external URLs from Unsplash
- Videos use sample MP4 from Google

## ✨ Key Features Included

✅ Professional login page with validation
✅ Dashboard with progress tracking
✅ Course catalog with search & filter
✅ Video lesson player with navigation
✅ Interactive quizzes with feedback
✅ Certificate management
✅ Responsive design (mobile + desktop)
✅ Nature-themed color scheme
✅ Clean component architecture

## 🎓 Next Steps

After you have the app running:

1. Explore each page to understand the flow
2. Check `src/data/courses.js` to see how data is structured
3. Modify mock data to customize content
4. Review component files to understand the code
5. Read the main README.md for more details

## 💬 Support

If you have issues:

1. Check the terminal for error messages
2. Verify all prerequisites are installed
3. Clear cache and reinstall (`npm ci`)
4. Check the Troubleshooting section above
5. Review the main README.md for detailed docs

## 🎉 You're All Set!

Your Digital Park Guide Training Platform web application is now ready! 

Start developing and have fun! 🌿
