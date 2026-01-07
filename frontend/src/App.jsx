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
import Home from './pages/Home';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster 
          position="top-center"
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/subjects/:id"
            element={
              <ProtectedRoute>
                <SubjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/tasks/:id"
            element={
              <ProtectedRoute>
                <TaskSolutions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/subjects/browse"
            element={
              <ProtectedRoute>
                <BrowseSubjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/subjects/:id"
            element={
              <ProtectedRoute>
                <StudentSubjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/tasks/:id"
            element={
              <ProtectedRoute>
                <SubmitSolution />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.is_teacher) {
    return <Navigate to="/teacher" />;
  }
  
  return <Navigate to="/student" />;
}

export default App;