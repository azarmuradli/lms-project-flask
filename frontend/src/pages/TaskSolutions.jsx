import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TaskSolutions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaskDetails();
    fetchSolutions();
  }, [id]);

  const fetchTaskDetails = async () => {
    try {
      const response = await api.get(`/teacher/tasks/${id}`);
      setTask(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await api.get(`/teacher/tasks/${id}/solutions`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!task) {
    return <div className="min-h-screen flex items-center justify-center">Task not found</div>;
  }

  return (
  <div className="min-h-screen bg-gray-900">
    <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white shadow-2xl border-b border-slate-600">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-300 mb-3 flex items-center gap-2 font-medium text-sm sm:text-base"
        >
          ← Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold">{task.name}</h1>
      </div>
    </nav>

    <div className="container mx-auto p-4 sm:p-8">
      {/* Task Info */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Task Details</h2>
        <p className="text-sm sm:text-base text-slate-300 mb-4">{task.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="bg-blue-900 p-3 sm:p-4 rounded-lg border border-blue-700">
            <p className="text-xl sm:text-2xl font-bold text-blue-400">{task.points}</p>
            <p className="text-xs sm:text-sm text-slate-400">Max Points</p>
          </div>
          <div className="bg-green-900 p-3 sm:p-4 rounded-lg border border-green-700">
            <p className="text-xl sm:text-2xl font-bold text-green-400">{task.total_solutions || 0}</p>
            <p className="text-xs sm:text-sm text-slate-400">Total Submissions</p>
          </div>
          <div className="bg-purple-900 p-3 sm:p-4 rounded-lg border border-purple-700">
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{task.evaluated_solutions || 0}</p>
            <p className="text-xs sm:text-sm text-slate-400">Evaluated</p>
          </div>
        </div>
      </div>

      {/* Solutions */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Submitted Solutions</h2>

        {solutions.length === 0 ? (
          <p className="text-sm sm:text-base text-slate-400 text-center py-8">No solutions submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {solutions.map((solution) => (
              <SolutionCard 
                key={solution.id} 
                solution={solution} 
                taskPoints={task.points}
                onEvaluated={fetchSolutions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);
}

function SolutionCard({ solution, taskPoints, onEvaluated }) {
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [points, setPoints] = useState(solution.points_earned || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEvaluate = async () => {
    setError('');
    setLoading(true);

    try {
      await api.post(`/teacher/solutions/${solution.id}/evaluate`, {
        points_earned: parseInt(points)
      });
      setShowEvaluate(false);
      onEvaluated();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to evaluate');
    } finally {
      setLoading(false);
    }
  };

  const isEvaluated = solution.points_earned !== null;

  return (
    <div className="border border-slate-700 rounded-xl p-4 sm:p-6 bg-slate-750">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
        <div className="w-full sm:w-auto">
          <p className="font-medium text-base sm:text-lg text-white">Student ID: {solution.student_id}</p>
          <p className="text-xs sm:text-sm text-slate-400">
            Submitted: {new Date(solution.submitted_at).toLocaleString()}
          </p>
          {isEvaluated && (
            <p className="text-xs sm:text-sm text-green-400 font-medium mt-1">
              Evaluated: {solution.points_earned}/{taskPoints} points
            </p>
          )}
        </div>
        
        {!isEvaluated ? (
          <button
            onClick={() => setShowEvaluate(!showEvaluate)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
          >
            Evaluate
          </button>
        ) : (
          <span className="w-full sm:w-auto text-center bg-green-900 text-green-100 px-4 py-2 rounded-lg border border-green-700 text-sm sm:text-base">
            ✓ Evaluated
          </span>
        )}
      </div>

      <div className="bg-slate-900 p-3 sm:p-4 rounded-lg mb-4 border border-slate-700">
        <p className="text-xs sm:text-sm text-slate-400 mb-2">Solution:</p>
        <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-300 overflow-x-auto">{solution.content}</pre>
      </div>

      {showEvaluate && !isEvaluated && (
        <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
          <h4 className="font-medium mb-3 text-sm sm:text-base text-white">Evaluate Solution</h4>
          
          {error && (
            <div className="bg-red-900 text-red-100 p-2 rounded-lg mb-3 text-xs sm:text-sm border border-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <label className="text-xs sm:text-sm font-medium text-slate-300">Points (0-{taskPoints}):</label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min={0}
              max={taskPoints}
              className="w-full sm:w-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm sm:text-base"
            />
            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-slate-700 transition font-medium text-sm sm:text-base"
            >
              {loading ? 'Saving...' : 'Submit Evaluation'}
            </button>
            <button
              onClick={() => setShowEvaluate(false)}
              className="w-full sm:w-auto bg-slate-700 text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-600 transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}