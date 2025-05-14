import express from 'express';
import multer from 'multer';
import { addBoarder, updateBoarder, removeBoarder, uploadBoarders ,getBoardersByRoom } from '../controllers/boarders-controller.js';

const router = express.Router();

// File upload setup
const upload = multer({ dest: 'uploads/' });

// Routes for Boarder Management
router.post('/add', addBoarder); // Add a new boarder
router.put('/update/:student_id', updateBoarder); // Update a boarder
router.delete('/remove/:student_id', removeBoarder); // Remove a boarder

// Route to handle file upload
router.post('/upload', upload.single('file'), uploadBoarders); // Upload spreadsheet to add/update multiple boarders

router.get('/rooms-with-boarders', getBoardersByRoom);

export default router;
