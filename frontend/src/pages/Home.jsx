import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">LMS - Learning Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Welcome, {user?.username}
              {user?.is_teacher && ' (Teacher)'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          
          {user?.is_teacher ? (
            <div>
              <p className="text-gray-700 mb-4">Teacher Dashboard</p>
              <p className="text-gray-600">You can create subjects and tasks here.</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-4">Student Dashboard</p>
              <p className="text-gray-600">You can enroll in subjects and submit solutions here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}