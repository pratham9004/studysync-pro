import { useState, useEffect } from 'react';
import { subjectService } from '../services/api';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  missed: 'bg-red-100 text-red-800'
};

export default function Sessions() {
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState('all');

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

  const filteredSubjects = subjects.map(subject => ({
    ...subject,
    sessions: subject.sessions?.filter(session => 
      filter === 'all' || session.status === filter
    ) || []
  })).filter(subject => subject.sessions.length > 0);

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = subjects.flatMap(subject => 
    subject.sessions?.filter(s => 
      new Date(s.date).toISOString().split('T')[0] === today
    ).map(s => ({ ...s, subjectName: subject.name })) || []
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Study Sessions</h1>
        <p className="text-gray-500 mt-1">View all study sessions grouped by subject</p>
      </div>

      {todaySessions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <h3 className="font-bold text-blue-800 mb-2">Today's Tasks</h3>
          <div className="space-y-2">
            {todaySessions.map((session, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg">
                <div>
                  <span className="font-medium">{session.subjectName}</span>
                  <span className="text-gray-500 ml-2">- {session.duration}h</span>
                </div>
                {session.status !== 'completed' && (
                  <button
                    onClick={() => {
                      const subject = subjects.find(s => s.name === session.subjectName);
                      if (subject) handleCompleteSession(subject._id, session._id);
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Mark as Done
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {['all', 'pending', 'completed', 'missed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredSubjects.map(subject => (
          <div key={subject._id} className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 mb-3">{subject.name}</h3>
            <div className="space-y-2">
              {subject.sessions.map(session => (
                <div key={session._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{new Date(session.date).toLocaleDateString()}</span>
                    <span className="text-gray-500 ml-2">- {session.duration}h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                      {session.status}
                    </span>
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
          </div>
        ))}
      </div>
    </div>
  );
}