const Notes = require('../models/Notes');

exports.createNote = async (req, res) => {
  try {
    const { title, subject, isPublic } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const note = await Notes.create({
      title,
      subject,
      fileUrl: `/uploads/${req.file.filename}`,
      userId: req.userId,
      isPublic: isPublic || false
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const userNotes = await Notes.find({ userId: req.userId });
    const publicNotes = await Notes.find({ isPublic: true });
    const allNotes = [...userNotes, ...publicNotes.filter(n => !userNotes.find(u => u._id.toString() === n._id.toString()))];
    res.json(allNotes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Notes.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};