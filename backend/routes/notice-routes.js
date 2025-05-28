import express from 'express';
import multer from '../middleware/noticeUpload.js';
import { uploadNotice, getAllNotices, downloadNoticeFile } from '../controllers/notice-controller.js';

const router = express.Router();

// POST: upload notice with PDF
router.post('/', multer.single('pdf'), uploadNotice);

// GET: get all notices
router.get('/', getAllNotices);

// GET: download PDF file by filename
router.get('/download/:filename', downloadNoticeFile);

export default router;
