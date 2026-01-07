import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    fetchSubjectDetails();
    fetchTasks();
  }, [id]);

  const fetchSubjectDetails = async () => {
    try {
      const response = await api.get(`/teacher/subjects/${id}`);
      setSubject(response.data);
    } catch (error) {
      console.error('Error fetching subject:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/teacher/subjects/${id}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!subject) {
    return <div className="min-h-screen flex items-center justify-center">Subject not found</div>;
  }

  return (
  <div className="min-h-screen bg-gray-900">
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-2xl border-b border-slate-600">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate('/teacher')}
          className="text-blue-400 hover:text-blue-300 mb-3 flex items-center gap-2 font-medium text-sm sm:text-base"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">{subject.name}</h1>
        <p className="text-blue-400 mt-2 text-sm sm:text-base">{subject.code} • {subject.credits} Credits</p>
      </div>
    </nav>

    <div className="container mx-auto p-4 sm:p-8">
      {/* Subject Info */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Subject Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="text-sm sm:text-base text-slate-300">
            <p>Code: <span className="text-blue-400">{subject.code}</span></p>
            <p>Credits: <span className="text-blue-400">{subject.credits}</span></p>
          </div>
          <div className="text-sm sm:text-base text-slate-300">
            <p>Students Enrolled: <span className="text-blue-400">{subject.students?.length || 0}</span></p>
          </div>
        </div>
        {subject.description && (
          <p className="text-sm sm:text-base text-slate-300 mt-4">{subject.description}</p>
        )}
      </div>

      {/* Enrolled Students */}
      {subject.students && subject.students.length > 0 && (
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Enrolled Students</h2>
          <div className="space-y-2">
            {subject.students.map((student) => (
              <div key={student.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-750 rounded-lg border border-slate-700 gap-2">
                <div>
                  <p className="font-medium text-sm sm:text-base text-white">{student.username}</p>
                  <p className="text-xs sm:text-sm text-slate-400">{student.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks Section */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-bold text-white">Tasks</h2>
          <button
            onClick={() => setShowTaskForm(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-semibold text-sm sm:text-base"
          >
            + Create New Task
          </button>
        </div>

        {showTaskForm && (
          <CreateTaskForm
            subjectId={id}
            onClose={() => setShowTaskForm(false)}
            onSuccess={fetchTasks}
          />
        )}

        {tasks.length === 0 ? (
          <p className="text-sm sm:text-base text-slate-400 text-center py-4">No tasks yet. Create your first task!</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}

function TaskCard({ task }) {
  const navigate = useNavigate();

  return (
    <div className="border border-slate-700 rounded-xl p-4 hover:bg-slate-750 transition">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
        <div className="flex-1 w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-bold text-white">{task.name}</h3>
          <p className="text-sm sm:text-base text-slate-300 mt-2">{task.description}</p>
          <p className="text-xs sm:text-sm text-blue-400 mt-2">Points: {task.points}</p>
        </div>
        <button
          onClick={() => navigate(`/teacher/tasks/${task.id}`)}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base whitespace-nowrap"
        >
          View Solutions
        </button>
      </div>
    </div>
  );
}

function CreateTaskForm({ subjectId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: 10,
    subject_id: parseInt(subjectId)
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post(`/teacher/subjects/${subjectId}/tasks`, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-750 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700">
      <h3 className="text-base sm:text-lg font-bold mb-4 text-white">Create New Task</h3>

      {error && (
        <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-4 border border-red-700 text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm sm:text-base text-slate-300 mb-2 font-medium">Task Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm sm:text-base"
            required
            minLength={5}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm sm:text-base text-slate-300 mb-2 font-medium">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm sm:text-base"
            rows={4}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm sm:text-base text-slate-300 mb-2 font-medium">Points *</label>
          <input
            type="number"
            value={formData.points}
            onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm sm:text-base"
            required
            min={1}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 transition font-medium text-sm sm:text-base"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-700 text-slate-300 py-2.5 rounded-lg hover:bg-slate-600 transition font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}