import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mySubjects, setMySubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [subjectToLeave, setSubjectToLeave] = useState(null);

  useEffect(() => {
    fetchMySubjects();
  }, []);

  const fetchMySubjects = async () => {
    try {
      const response = await api.get('/student/my-subjects');
      setMySubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLeaveClick = (subjectId) => {
    setSubjectToLeave(subjectId);
    setShowLeaveModal(true);
  };

  const handleLeaveConfirm = async () => {
    try {
      await api.delete(`/student/subjects/${subjectToLeave}/leave`);
      fetchMySubjects();
      toast.success('Successfully left the subject');
    } catch (error) {
      console.error('Error leaving subject:', error);
      toast.error('Failed to leave subject');
    } finally {
      setShowLeaveModal(false);
      setSubjectToLeave(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
  <div className="min-h-screen bg-gray-900">
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-2xl border-b border-slate-600">
        <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">LMS</h1>
                <p className="text-xs sm:text-sm text-slate-300">Student Portal</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                onClick={() => navigate('/student/subjects/browse')}
                className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg text-center"
                >
                + Browse Subjects
                </button>
                <div className="hidden sm:block border-l border-slate-600 pl-4">
                <p className="text-sm text-slate-400">Welcome back,</p>
                <p className="font-semibold text-white">{user?.username}</p>
                </div>
                <button
                onClick={handleLogout}
                className="w-full sm:w-auto bg-slate-600 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium hover:bg-slate-500 transition"
                >
                Logout
                </button>
            </div>
            </div>
        </div>
    </nav>

    <div className="container mx-auto p-4 sm:p-8">
        <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Enrolled Subjects</h2>
            <p className="text-sm sm:text-base text-slate-400">Track your progress and submit assignments</p>
        </div>

      {mySubjects.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-12 text-center border border-slate-700">
          <div className="w-24 h-24 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No subjects yet</h3>
          <p className="text-slate-400 mb-6">Start your learning journey by enrolling in a subject</p>
          <button
            onClick={() => navigate('/student/subjects/browse')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-0.5"
          >
            Browse Available Subjects
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mySubjects.map((subject) => (
            <div key={subject.id} className="bg-slate-800 rounded-2xl shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 overflow-hidden border border-slate-700 transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
                <p className="text-blue-100 text-sm">{subject.code}</p>
              </div>
              <div className="p-6">
                <p className="text-slate-300 mb-4 min-h-[48px]">{subject.description}</p>
                <div className="flex items-center gap-4 mb-6 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-400 font-semibold">{subject.credits}</span>
                    <span className="text-slate-400">Credits</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/student/subjects/${subject.id}`)}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    View Tasks
                  </button>
                  <button
                    onClick={() => handleLeaveClick(subject.id)}
                    className="bg-red-900 text-red-100 px-4 py-2.5 rounded-lg font-medium hover:bg-red-800 transition"
                  >
                    Leave
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    <ConfirmModal
      isOpen={showLeaveModal}
      onClose={() => setShowLeaveModal(false)}
      onConfirm={handleLeaveConfirm}
      title="Leave Subject"
      message="Are you sure you want to leave this subject? You can re-enroll later if needed."
    />
  </div>
);
}