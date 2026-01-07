import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import SubjectDetails from './pages/SubjectDetails';
import TaskSolutions from './pages/TaskSolutions';
import StudentDashboard from './pages/StudentDashboard';
import BrowseSubjects from './pages/BrowseSubjects';
import StudentSubjectDetails from './pages/StudentSubjectDetails';
import SubmitSolution from './pages/SubmitSolution';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.is_teacher) {
    return <Navigate to="/teacher" replace />;
  }
  
  return <Navigate to="/student" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: 'green',
              },
            },
            error: {
              style: {
                background: 'red',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />
          
          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/subjects/:id" element={<ProtectedRoute><SubjectDetails /></ProtectedRoute>} />
          <Route path="/teacher/tasks/:id" element={<ProtectedRoute><TaskSolutions /></ProtectedRoute>} />
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/subjects/browse" element={<ProtectedRoute><BrowseSubjects /></ProtectedRoute>} />
          <Route path="/student/subjects/:id" element={<ProtectedRoute><StudentSubjectDetails /></ProtectedRoute>} />
          <Route path="/student/tasks/:id" element={<ProtectedRoute><SubmitSolution /></ProtectedRoute>} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;