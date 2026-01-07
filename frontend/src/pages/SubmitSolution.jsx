import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function SubmitSolution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [mySolutions, setMySolutions] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTaskAndSolutions();
  }, [id]);

  const fetchTaskAndSolutions = async () => {
    try {
      // We need to get task info, but we don't have a direct endpoint
      // So we'll get it from solutions or store minimal info
      const solutionsResponse = await api.get(`/student/tasks/${id}/my-solutions`);
      setMySolutions(solutionsResponse.data);
      
      // For now, we'll set task from the solution if it exists, or make a basic object
      if (solutionsResponse.data.length > 0) {
        setTask({ id: parseInt(id) });
      } else {
        setTask({ id: parseInt(id) });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
        await api.post(`/student/tasks/${id}/submit`, {
        content,
        task_id: parseInt(id)
        });
        setContent('');
        fetchTaskAndSolutions();
        toast.success('Solution submitted successfully!');
    } catch (err) {
        setError(err.response?.data?.detail || 'Failed to submit solution');
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
        <h1 className="text-2xl sm:text-3xl font-bold">Submit Solution</h1>
      </div>
    </nav>

    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      {/* Submit Form */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">Submit New Solution</h2>

        {error && (
          <div className="bg-red-900 text-red-100 p-3 rounded-lg mb-4 border border-red-700 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm sm:text-base text-slate-300 mb-2 font-medium">Your Solution *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm sm:text-base"
              rows={10}
              placeholder="Write your solution here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 transition font-semibold text-sm sm:text-base"
          >
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </form>
      </div>

      {/* Previous Submissions */}
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 border border-slate-700">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-white">My Previous Submissions</h2>

        {mySolutions.length === 0 ? (
          <p className="text-sm sm:text-base text-slate-400 text-center py-4">No previous submissions.</p>
        ) : (
          <div className="space-y-4">
            {mySolutions.map((solution) => (
              <div key={solution.id} className="border border-slate-700 rounded-xl p-3 sm:p-4 bg-slate-750">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3">
                  <p className="text-xs sm:text-sm text-slate-400">
                    Submitted: {new Date(solution.submitted_at).toLocaleString()}
                  </p>
                  {solution.points_earned !== null ? (
                    <span className="bg-green-900 text-green-100 px-3 py-1 rounded-lg text-xs sm:text-sm font-medium border border-green-700">
                      Score: {solution.points_earned} points
                    </span>
                  ) : (
                    <span className="bg-yellow-900 text-yellow-100 px-3 py-1 rounded-lg text-xs sm:text-sm border border-yellow-700">
                      Not evaluated yet
                    </span>
                  )}
                </div>
                <div className="bg-slate-900 p-3 sm:p-4 rounded-lg border border-slate-700">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm text-slate-300 overflow-x-auto">{solution.content}</pre>
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