import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/teacher/subjects');
      setSubjects(response.data);
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
                <p className="text-xs sm:text-sm text-slate-300">Teacher Portal</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">My Subjects</h2>
            <p className="text-sm sm:text-base text-slate-400">Manage your courses and assignments</p>
            </div>
            <button
            onClick={() => setShowCreateForm(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
            >
            + Create New Subject
            </button>
        </div>

      {showCreateForm && (
        <CreateSubjectForm 
          onClose={() => setShowCreateForm(false)} 
          onSuccess={fetchSubjects}
        />
      )}

      {subjects.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 text-center border border-slate-700">
          <p className="text-slate-400">No subjects yet. Create your first subject!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}
    </div>
  </div>
);
}

function SubjectCard({ subject }) {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 overflow-hidden border border-slate-700 transform hover:-translate-y-1">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{subject.name}</h3>
        <p className="text-blue-100 text-sm">{subject.code}</p>
      </div>
      <div className="p-6">
        <p className="text-slate-300 mb-4 min-h-[48px]">{subject.description}</p>
        <div className="text-sm text-slate-400 mb-6">
          <p>Credits: <span className="text-blue-400">{subject.credits}</span></p>
        </div>
        <button
          onClick={() => navigate(`/teacher/subjects/${subject.id}`)}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function CreateSubjectForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    credits: 5
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/teacher/subjects', formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 mb-6 border border-slate-700">
      <h3 className="text-xl font-bold mb-4 text-white">Create New Subject</h3>
      
      {error && (
        <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-4 border border-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-slate-300 mb-2 font-medium">Subject Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
            minLength={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 mb-2 font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            rows={3}
          />
        </div>

        <div className="mb-4">
          <label className="block text-slate-300 mb-2 font-medium">Subject Code * (e.g., IK-CS101)</label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
            pattern="IK-[A-Z]{3}[0-9]{3}"
            placeholder="IK-CS101"
          />
        </div>

        <div className="mb-6">
          <label className="block text-slate-300 mb-2 font-medium">Credits *</label>
          <input
            type="number"
            value={formData.credits}
            onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
            className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            required
            min={1}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 transition font-medium"
          >
            {loading ? 'Creating...' : 'Create Subject'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-700 text-slate-300 py-2.5 rounded-lg hover:bg-slate-600 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}