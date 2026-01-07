import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function StudentSubjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjectAndTasks();
  }, [id]);

  const fetchSubjectAndTasks = async () => {
    try {
      // Get subject details from my-subjects
      const mySubjectsResponse = await api.get('/student/my-subjects');
      const foundSubject = mySubjectsResponse.data.find(s => s.id === parseInt(id));
      setSubject(foundSubject);

      // Get tasks for this subject
      const tasksResponse = await api.get(`/student/subjects/${id}/tasks`);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
          onClick={() => navigate('/student')}
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
        </div>
        {subject.description && (
          <p className="text-sm sm:text-base text-slate-300 mt-4">{subject.description}</p>
        )}
      </div>

      {/* Tasks */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-sm sm:text-base text-slate-400 text-center py-8">No tasks available yet.</p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="border border-slate-700 rounded-xl p-4 hover:bg-slate-750 hover:border-slate-600 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1 w-full sm:w-auto">
                    <h3 className="text-base sm:text-lg font-bold text-white">{task.name}</h3>
                    <p className="text-sm sm:text-base text-slate-300 mt-2">{task.description}</p>
                    <p className="text-xs sm:text-sm text-blue-400 mt-2">Max Points: {task.points}</p>
                  </div>
                  <button
                    onClick={() => navigate(`/student/tasks/${task.id}`)}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
                  >
                    Submit Solution
                  </button>
                </div>
              </div>
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
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold">{task.name}</h3>
          <p className="text-gray-600 mt-2">{task.description}</p>
          <p className="text-sm text-gray-500 mt-2">Max Points: {task.points}</p>
        </div>
        <button
          onClick={() => navigate(`/student/tasks/${task.id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Solution
        </button>
      </div>
    </div>
  );
}