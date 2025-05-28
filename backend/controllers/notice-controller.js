import {
  saveNoticeToDB,
  fetchAllNotices
} from '../services/notice-service.js';

import path from 'path';
import fs from 'fs';

export const uploadNotice = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    console.log('Received file:', req.file);
    const { title, description } = req.body;
    const pdf = req.file;
    const createdBy = req.user?.user_id || 1;

    if (!title || !description || !pdf) {
      return res.status(400).json({ error: 'Title, description, and PDF are required.' });
    }

    const pdfPath = `http://localhost:5000/uploads/notices/${pdf.filename}`;
    await saveNoticeToDB({ title, description, pdfPath, createdBy });

    res.status(201).json({ message: 'Notice uploaded successfully.' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload notice.' });
  }
};

export const getAllNotices = async (req, res) => {
  try {
    const notices = await fetchAllNotices();
    res.status(200).json(notices);
  } catch (error) {
    console.error('Fetch notices error:', error);
    res.status(500).json({ error: 'Failed to fetch notices.' });
  }
};

// New API to download the PDF file
export const downloadNoticeFile = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', 'notices', filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).send('Error downloading file');
      }
    });
  });
};
