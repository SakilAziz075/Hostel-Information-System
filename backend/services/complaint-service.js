// services/complaintService.js
import db from '../config/db.js';

// Submit a new complaint
async function submitComplaint({ student_id, category, description, priority }) {
    const [studentCheck] = await db.query('SELECT student_id FROM students WHERE student_id = ?', [student_id]);
    if (!studentCheck.length) {
        const err = new Error('Student not found');
        err.status = 404;
        throw err;
    }

    const [result] = await db.query(
        'INSERT INTO complaints (student_id, category, description, priority, approval_status, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
        [student_id, category, description, priority, 'Pending', 'wing']
    );

    return { complaint_id: result.insertId, message: 'Complaint submitted successfully!' };
}

// Update status (used by Warden or Prefect, once complaint is escalated)
async function updateComplaintStatus(complaintId, status) {
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];

    if (!validStatuses.includes(status)) {
        const err = new Error('Invalid status value.');
        err.status = 400;
        throw err;
    }

    const [result] = await db.query(
        'UPDATE complaints SET status = ? WHERE complaint_id = ?',
        [status, complaintId]
    );

    if (result.affectedRows === 0) {
        const err = new Error('Complaint not found.');
        err.status = 404;
        throw err;
    }

    return { message: 'Complaint status updated successfully.' };
}

// Get all complaints
async function getAllComplaints() {
    const [rows] = await db.query(`
        SELECT 
            c.complaint_id,
            c.category,
            c.description,
            c.status,
            c.priority,
            c.submitted_at,
            c.approval_status,
            c.assigned_to,
            s.name AS student_name,
            s.email AS student_email,
            s.room_number
        FROM complaints c
        JOIN students s ON c.student_id = s.student_id
        ORDER BY c.submitted_at DESC
    `);

    return rows;
}

// Process complaint (approve or reject) and escalate if approved
async function processComplaint(complaintId, role, action) {
    const [[complaint]] = await db.query('SELECT * FROM complaints WHERE complaint_id = ?', [complaintId]);

    if (!complaint) {
        const err = new Error('Complaint not found');
        err.status = 404;
        throw err;
    }

    if (complaint.assigned_to !== role) {
        const err = new Error(`You are not authorized to process this complaint.`);
        err.status = 403;
        throw err;
    }

    if (action === 'Rejected') {
        await db.query(
            'UPDATE complaints SET approval_status = ?, assigned_to = ? WHERE complaint_id = ?',
            ['Rejected', role, complaintId]
        );
        return { message: 'Complaint rejected.' };
    }

    // If approved, escalate or finally approve
    const nextRole = role === 'wing' ? 'prefect' : role === 'prefect' ? 'warden' : null;
    const approvalStatus = nextRole ? 'Pending' : 'Approved';

    await db.query(
        'UPDATE complaints SET approval_status = ?, assigned_to = ? WHERE complaint_id = ?',
        [approvalStatus, nextRole || role, complaintId]
    );

    return { message: `Complaint ${nextRole ? 'escalated to ' + nextRole : 'fully approved'} successfully.` };
}

export default {
    submitComplaint,
    updateComplaintStatus,
    getAllComplaints,
    processComplaint,
};
