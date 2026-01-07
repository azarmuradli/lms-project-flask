import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function BrowseSubjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [mySubjects, setMySubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const [allResponse, myResponse] = await Promise.all([
        api.get('/student/subjects'),
        api.get('/student/my-subjects')
      ]);
      setSubjects(allResponse.data);
      setMySubjects(myResponse.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (subjectId) => {
    try {
        await api.post(`/student/subjects/${subjectId}/enroll`);
        fetchSubjects();
        toast.success('Successfully enrolled in subject!');
    } catch (error) {
        console.error('Error enrolling:', error);
        toast.error(error.response?.data?.detail || 'Failed to enroll');
    }
   };

  const isEnrolled = (subjectId) => {
    return mySubjects.some(s => s.id === subjectId);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
        <h1 className="text-2xl sm:text-3xl font-bold">Browse Available Subjects</h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">Find and enroll in courses</p>
      </div>
    </nav>

    <div className="container mx-auto p-4 sm:p-8">
      {subjects.length === 0 ? (
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-center border border-slate-700">
          <p className="text-slate-400">No subjects available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-slate-800 rounded-2xl shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 border border-slate-700 transform hover:-translate-y-1">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">{subject.name}</h3>
                <p className="text-sm sm:text-base text-slate-300 mb-4 min-h-[48px]">{subject.description}</p>
                <div className="text-xs sm:text-sm text-slate-400 mb-6 space-y-1">
                  <p>Code: <span className="text-blue-400">{subject.code}</span></p>
                  <p>Credits: <span className="text-blue-400">{subject.credits}</span></p>
                </div>
                {isEnrolled(subject.id) ? (
                  <button
                    disabled
                    className="w-full bg-slate-700 text-slate-400 py-2.5 rounded-lg cursor-not-allowed font-medium text-sm sm:text-base"
                  >
                    Already Enrolled
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(subject.id)}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
                  >
                    Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}