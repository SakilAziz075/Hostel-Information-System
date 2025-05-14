// services/complaintService.js
import db from '../config/db.js';

// Submit a new complaint
async function submitComplaint({ student_id, category, description, priority }) {
    // Check if student exists
    const [studentCheck] = await db.query('SELECT student_id, room_number FROM students WHERE student_id = ?', [student_id]);
    if (!studentCheck.length) {
        const err = new Error('Student not found');
        err.status = 404;
        throw err;
    }

    const roomNumber = studentCheck[0].room_number;
    console.log(`Student room number: ${roomNumber}`);

    // Get the wing information based on the room number
    const [wingInfo] = await db.query('SELECT wing_name, representative_id FROM wings WHERE room_start <= ? AND room_end >= ?', [roomNumber, roomNumber]);

    // Log the retrieved wing info
    console.log('Wing info:', wingInfo);

    if (!wingInfo.length) {
        const err = new Error('Wing representative not found for the room');
        err.status = 404;
        throw err;
    }

    const assignedTo = wingInfo[0].representative_id; // Assign the wing rep
    console.log(`Complaint assigned to representative: ${assignedTo}`);

    // Insert complaint into the database
    const [result] = await db.query(
        'INSERT INTO complaints (student_id, category, description, priority, approval_status, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
        [student_id, category, description, priority, 'Pending', assignedTo]
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


async function processComplaint(complaintId, role, action, currentUserId) {
    const [[complaint]] = await db.query('SELECT * FROM complaints WHERE complaint_id = ?', [complaintId]);

    if (!complaint) {
        const err = new Error('Complaint not found');
        err.status = 404;
        throw err;
    }

    if (complaint.assigned_to !== currentUserId) {
        const err = new Error(`You are not authorized to process this complaint.`);
        err.status = 403;
        throw err;
    }

    if (action === 'Rejected') {
        await db.query(
            'UPDATE complaints SET approval_status = ?, assigned_to = ? WHERE complaint_id = ?',
            ['Rejected', currentUserId, complaintId]
        );
        return { message: 'Complaint rejected.' };
    }

    // Get the next level user (prefect or warden) from the users table
    const roleMap = {
        wing: 'prefect',
        prefect: 'warden',
    };

    const nextRole = roleMap[role];

    let nextAssignee = null;

    if (nextRole) {
        const [users] = await db.query('SELECT student_id FROM students JOIN users ON students.email = users.email WHERE role = ?', [nextRole]);
        if (!users.length) {
            throw new Error(`No ${nextRole} found in the system.`);
        }
        nextAssignee = users[0].student_id;
    }

    const approvalStatus = nextAssignee ? 'Pending' : 'Approved';

    await db.query(
        'UPDATE complaints SET approval_status = ?, assigned_to = ? WHERE complaint_id = ?',
        [approvalStatus, nextAssignee || currentUserId, complaintId]
    );

    return { message: `Complaint ${nextAssignee ? 'escalated to ' + nextRole : 'fully approved'} successfully.` };
}

// In complaint-service.js

// Escalate complaint to warden
async function escalateToWarden(complaintId) {
    const [[complaint]] = await db.query('SELECT * FROM complaints WHERE complaint_id = ?', [complaintId]);

    if (!complaint) {
        const err = new Error('Complaint not found');
        err.status = 404;
        throw err;
    }
    console.log(complaint)

    // Insert into warden_complaints table
    const [result] = await db.query(
        'INSERT INTO warden_complaints (complaint_id, student_id, category, description, priority) VALUES (?, ?, ?, ?, ?)',
        [complaintId, complaint.student_id, complaint.category, complaint.description, complaint.priority]
    );

    return { warden_complaint_id: result.insertId, message: 'Complaint escalated to warden.' };
}

async function addWardenLog(wardenComplaintId, update_text) {
    const [result] = await db.query(
        'INSERT INTO complaint_logs (warden_complaint_id, update_text) VALUES (?, ?)',
        [wardenComplaintId, update_text]
    );

    return { log_id: result.insertId, message: 'Progress update added successfully.' };
}


// Get all warden complaints
async function getAllWardenComplaints() {
    const [rows] = await db.query(`
        SELECT 
            wc.warden_complaint_id,
            wc.complaint_id,
            wc.category,
            wc.description,
            wc.status,
            wc.priority,
            wc.submitted_at,
            wc.action_taken,
            s.name AS student_name,
            s.email AS student_email,
            s.student_id AS student_roll
        FROM warden_complaints wc
        JOIN students s ON wc.student_id = s.student_id
        ORDER BY wc.submitted_at DESC
    `);

    return rows;
}

async function getWardenLogs(wardenComplaintId) {
    const [logs] = await db.query(
        'SELECT log_id, update_text, updated_at FROM complaint_logs WHERE warden_complaint_id = ? ORDER BY updated_at DESC',
        [wardenComplaintId]
    );
    return logs;
}


export default {
    submitComplaint,
    updateComplaintStatus,
    getAllComplaints,
    processComplaint,
    escalateToWarden,
    addWardenLog,
    getAllWardenComplaints,
    getWardenLogs
};
