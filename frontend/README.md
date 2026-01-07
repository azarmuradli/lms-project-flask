# LMS Frontend - React + Vite

A modern Learning Management System frontend built with React, featuring a professional dark theme, role-based dashboards, and responsive design.

## Features

- JWT-based authentication
- Role-based dashboards (Teacher & Student)
- Subject browsing and enrollment
- Task submission and tracking
- Solution evaluation interface
- Toast notifications
- Confirmation modals
- Fully responsive design (mobile + desktop)
- Professional dark theme

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. **Navigate to frontend folder:**
```bash
   cd frontend
```

2. **Install dependencies:**
```bash
   npm install
```

3. **Configure API endpoint:**
   
   The API base URL is configured in `src/api/axios.js`:
```javascript
   baseURL: 'http://localhost:8000/api'
```
   
   Update this if your backend is running on a different port or domain.

## Running the Application

1. **Start the development server:**
```bash
   npm run dev
```

2. **Access the application:**
   - Local: http://localhost:5173

## Building for Production
```bash
npm run build
```

The build output will be in the `dist/` folder.

## Project Structure
```
frontend/
├── src/
│   ├── api/
│   │   └── axios.js           # API client configuration
│   ├── components/
│   │   └── ConfirmModal.jsx   # Reusable confirmation modal
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── pages/
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   ├── TeacherDashboard.jsx
│   │   ├── SubjectDetails.jsx
│   │   ├── TaskSolutions.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── BrowseSubjects.jsx
│   │   ├── StudentSubjectDetails.jsx
│   │   └── SubmitSolution.jsx
│   ├── App.jsx                # Main app component with routing
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── public/                    # Static assets
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md                 # This file
```

## Available Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page (students only)

### Student Routes (Protected)
- `/student` - Student dashboard
- `/student/subjects/browse` - Browse available subjects
- `/student/subjects/:id` - View subject tasks
- `/student/tasks/:id` - Submit solution

### Teacher Routes (Protected)
- `/teacher` - Teacher dashboard
- `/teacher/subjects/:id` - Subject details with students
- `/teacher/tasks/:id` - View and evaluate solutions

## Key Features

### Authentication
- JWT token stored in localStorage
- Automatic token refresh on page reload
- Protected routes with authentication check
- Role-based routing (teacher vs student)

### Teacher Features
- Create and manage subjects
- Create tasks with point values
- View enrolled students
- View submitted solutions
- Evaluate and grade solutions
- Track submission statistics

### Student Features
- Browse available subjects
- Enroll in subjects
- View tasks for enrolled subjects
- Submit solutions (multiple submissions allowed)
- View evaluation scores
- Track submission history

### UI/UX
- Professional dark theme (slate/blue color scheme)
- Fully responsive (mobile-first design)
- Toast notifications for user feedback
- Confirmation modals for destructive actions
- Loading states for async operations
- Error handling with user-friendly messages

## Environment Variables

Create a `.env` file in the frontend root (optional):
```
VITE_API_URL=http://localhost:8000/api
```

Then update `src/api/axios.js`:
```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

## Deployment

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
   npm install -g vercel
```

2. **Deploy:**
```bash
   vercel
```

3. **Set environment variables in Vercel dashboard**

### Deploy to Netlify

1. **Build the project:**
```bash
   npm run build
```

2. **Deploy the `dist` folder to Netlify**

3. **Configure redirects** (create `public/_redirects`):
```
   /*    /index.html   200
```

## Default Credentials

After seeding the backend, use these credentials:

**Teachers:**
- Email: `teacher1@test.com`, Password: `teacher123`
- Email: `teacher2@test.com`, Password: `teacher123`

**Students:**
- Register new accounts via `/register`

## Development Tips

- The backend must be running for the frontend to work
- CORS is configured in the backend to allow `localhost:5173`
- Check browser console for API errors
- Use React DevTools for debugging

## License

MIT