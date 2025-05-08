// services/complaintService.js
import db from '../config/db.js'; // MySQL2 pool

async function submitComplaint({ student_id, category, description, priority }) {
    // Check if the student exists before allowing them to submit a complaint
    const [studentCheck] = await db.query('SELECT student_id FROM students WHERE student_id = ?', [student_id]);
    if (!studentCheck.length) {
        const err = new Error('Student not found');
        err.status = 404;
        throw err;
    }

    // Insert the complaint into the database
    const [result] = await db.query(
        'INSERT INTO complaints (student_id, category, description, priority) VALUES (?, ?, ?, ?)',
        [student_id, category, description, priority]
    );

    return { complaint_id: result.insertId, message: 'Complaint submitted successfully!' };
}

export default { submitComplaint };

