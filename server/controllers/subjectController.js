const Subject = require('../models/Subject');

const updateSessionStatuses = (subject) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  subject.sessions.forEach(session => {
    if (session.status !== 'completed') {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (today > sessionDate) {
        session.status = 'missed';
      }
    }
  });
};

exports.createSubject = async (req, res) => {
  try {
    const { name, totalHours, sessions } = req.body;

    const subject = await Subject.create({
      name,
      totalHours: totalHours || 0,
      userId: req.userId,
      sessions: sessions || []
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.userId });
    
    subjects.forEach(subject => {
      updateSessionStatuses(subject);
    });
    
    await Promise.all(subjects.map(s => s.save()));
    
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const { name, totalHours, sessions } = req.body;
    
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name, totalHours, sessions },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addSession = async (req, res) => {
  try {
    const { date, duration } = req.body;
    
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $push: { sessions: { date, duration } } },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const { sessionId, status, date, duration } = req.body;
    
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId, 'sessions._id': sessionId },
      { 
        $set: { 
          'sessions.$.status': status,
          'sessions.$.date': date,
          'sessions.$.duration': duration
        } 
      },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeSession = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId, 'sessions._id': req.params.sessionId },
      { $set: { 'sessions.$.status': 'completed' } },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $pull: { sessions: { _id: req.params.sessionId } } },
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.findOrCreateSubject = async (req, res) => {
  try {
    const { name, date, duration } = req.body;
    
    let subject = await Subject.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }, 
      userId: req.userId 
    });

    if (subject) {
      subject = await Subject.findOneAndUpdate(
        { _id: subject._id, userId: req.userId },
        { $push: { sessions: { date, duration } } },
        { new: true }
      );
    } else {
      subject = await Subject.create({
        name,
        totalHours: Number(duration),
        userId: req.userId,
        sessions: [{ date, duration }]
      });
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};