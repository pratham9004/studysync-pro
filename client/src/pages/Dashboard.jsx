import { useState, useEffect } from 'react';
import { subjectService } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await subjectService.getAll();
      setSubjects(res.data);
      
      const studyDates = res.data
        .flatMap(s => s.sessions?.filter(sess => sess.status === 'completed') || [])
        .map(s => new Date(s.date).toDateString());
      const uniqueDates = [...new Set(studyDates)];
      setStreak(uniqueDates.length);
    } catch (err) {
      console.error(err);
    }
  };

  const allSessions = subjects.flatMap(s => s.sessions || []);
  const totalHours = allSessions
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.duration, 0);

  const completedSessions = allSessions.filter(s => s.status === 'completed').length;
  const pendingSessions = allSessions.filter(s => s.status === 'pending').length;
  const missedSessions = allSessions.filter(s => s.status === 'missed').length;
  const totalSessions = allSessions.length;

  const barData = {
    labels: subjects.map(s => s.name),
    datasets: [{
      label: 'Hours Studied',
      data: subjects.map(subject => 
        (subject.sessions || [])
          .filter(s => s.status === 'completed')
          .reduce((sum, s) => sum + s.duration, 0)
      ),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1
    }]
  };

  const pieData = {
    labels: ['Completed', 'Pending', 'Missed'],
    datasets: [{
      data: [completedSessions, pendingSessions, missedSessions],
      backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(251, 191, 36, 0.8)', 'rgba(239, 68, 68, 0.8)'],
      borderColor: ['rgba(16, 185, 129, 1)', 'rgba(251, 191, 36, 1)', 'rgba(239, 68, 68, 1)'],
      borderWidth: 1
    }]
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Track your study progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <p className="text-sm opacity-80">Total Subjects</p>
          <p className="text-3xl font-bold">{subjects.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <p className="text-sm opacity-80">Total Hours Studied</p>
          <p className="text-3xl font-bold">{totalHours}h</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <p className="text-sm opacity-80">Study Sessions</p>
          <p className="text-3xl font-bold">{totalSessions}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
          <p className="text-sm opacity-80">Study Streak</p>
          <p className="text-3xl font-bold">🔥 {streak} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Hours by Subject</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false }}}} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Session Status</h3>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' }}}} />
        </div>
      </div>
    </div>
  );
}