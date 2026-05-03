import { useState, useEffect } from 'react';
import { notesService, subjectService } from '../services/api';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await notesService.getAll();
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await subjectService.getAll();
      setSubjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('file', file);
    formData.append('isPublic', isPublic);

    setLoading(true);
    try {
      await notesService.create(formData);
      setTitle('');
      setSubject('');
      setFile(null);
      setIsPublic(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await notesService.delete(id);
      fetchNotes();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Notes</h1>
        <p className="text-gray-500 mt-1">Upload and manage your study notes</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select subject</option>
              {subjects.map(s => (
                <option key={s._id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              accept=".pdf,.png,.jpg,.jpeg,.gif"
              className="px-4 py-3 border rounded-lg"
              required
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700">Make public</span>
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Note'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note._id} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800">{note.title}</h3>
                <p className="text-gray-500 text-sm">{note.subject}</p>
                {note.isPublic && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                    Public
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-red-600 hover:bg-red-50 p-1 rounded"
              >
                ✕
              </button>
            </div>
            <a
              href={`${import.meta.env.VITE_API_URL}${note.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}