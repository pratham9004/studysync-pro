const express = require('express');
const router = express.Router();
const { createNote, getNotes, deleteNote } = require('../controllers/notesController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.use(auth);

router.post('/', upload.single('file'), createNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

module.exports = router;