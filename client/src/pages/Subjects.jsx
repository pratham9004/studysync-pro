import { useState, useEffect } from 'react';
import { subjectService } from '../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  missed: 'bg-red-100 text-red-800'
};

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subjectName: '',
    date: '',
    hours: ''
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getAll();
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subjectName || !formData.date || !formData.hours) {
      return;
    }

    try {
      await subjectService.findOrCreate({
        name: formData.subjectName,
        date: formData.date,
        duration: Number(formData.hours)
      });

      setFormData({ subjectName: '', date: '', hours: '' });
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteSession = async (subjectId, sessionId) => {
    try {
      await subjectService.completeSession(subjectId, sessionId);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSession = async (subjectId, sessionId) => {
    try {
      await subjectService.deleteSession(subjectId, sessionId);
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm('Delete this subject and all its sessions?')) {
      try {
        await subjectService.delete(id);
        fetchSubjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subjects</h1>
        <p className="text-gray-500 mt-1">Manage subjects and study plans</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Add Study Plan</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={formData.subjectName}
              onChange={(e) => handleChange('subjectName', e.target.value)}
              placeholder="Subject name (e.g., AIML)"
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              value={formData.hours}
              onChange={(e) => handleChange('hours', e.target.value)}
              placeholder="Hours (e.g., 3)"
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            Add Study Plan
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {subjects.map(subject => (
          <div key={subject._id} className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{subject.name}</h3>
                <p className="text-gray-500">
                  Total: {subject.totalHours || 0}h • Sessions: {subject.sessions?.length || 0}
                </p>
              </div>
              <button
                onClick={() => handleDeleteSubject(subject._id)}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
              >
                Delete
              </button>
            </div>

            {subject.sessions && subject.sessions.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="font-medium text-gray-700">Sessions:</p>
                {subject.sessions.map(session => (
                  <div key={session._id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{formatDate(session.date)}</span>
                      <span className="text-gray-500">- {session.duration}h</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {session.status !== 'completed' && (
                        <button
                          onClick={() => handleCompleteSession(subject._id, session._id)}
                          className="px-2 py-1 bg-green-500 text-white text-xs rounded"
                        >
                          Done
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSession(subject._id, session._id)}
                        className="text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}