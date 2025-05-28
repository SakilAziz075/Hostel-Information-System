// services/notice-service.js
import db from '../config/db.js';

// Save notice using async/await and promise interface
export const saveNoticeToDB = async ({ title, description, pdfPath, createdBy }) => {
  const query = `
    INSERT INTO notifications (title, description, pdf_path, created_by)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await db.query(query, [title, description, pdfPath, createdBy]);
  return result.insertId;
};

// Fetch all notices using async/await and promise interface
export const fetchAllNotices = async () => {
  const query = `
    SELECT notification_id, title, description, pdf_path, created_at
    FROM notifications
    ORDER BY created_at DESC
  `;
  const [rows] = await db.query(query);
  return rows;
};
