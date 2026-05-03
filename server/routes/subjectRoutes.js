const express = require('express');
const router = express.Router();
const { 
  createSubject, 
  getSubjects, 
  updateSubject,
  deleteSubject,
  addSession,
  updateSession,
  completeSession,
  deleteSession,
  findOrCreateSubject
} = require('../controllers/subjectController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', createSubject);
router.get('/', getSubjects);
router.post('/find-or-create', findOrCreateSubject);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);
router.post('/:id/sessions', addSession);
router.put('/:id/sessions/:sessionId', updateSession);
router.put('/:id/sessions/:sessionId/complete', completeSession);
router.delete('/:id/sessions/:sessionId', deleteSession);

module.exports = router;