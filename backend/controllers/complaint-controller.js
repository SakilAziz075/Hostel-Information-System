import complaintService from '../services/complaint-service.js';

// Submit new complaint
export async function submitComplaint(req, res) {
    const { student_id, category, description, priority } = req.body;

    if (!student_id || !category || !description || !priority) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const result = await complaintService.submitComplaint({
            student_id,
            category,
            description,
            priority,
        });

        return res.status(201).json(result);
    } catch (error) {
        console.error('Error submitting complaint:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
}

// Update final status of a complaint
export async function updateComplaintStatus(req, res) {
    const complaintId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    try {
        const result = await complaintService.updateComplaintStatus(complaintId, status);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error updating complaint:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
}

// Get all complaints
export async function getAllComplaints(req, res) {
    const { role } = req.query; // e.g., ?role=wing or ?role=prefect
    console.log(role);
    
    try {
        const complaints = await complaintService.getAllComplaints(role);
        return res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return res.status(500).json({ message: 'Failed to fetch complaints' });
    }
}


// Process (approve/reject) complaint and escalate if necessary
export async function processComplaint(req, res) {
    const complaintId = req.params.id;
    const { role, action, student_id } = req.body;

    if (!role || !['wing', 'prefect', 'warden'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role.' });
    }

    if (!['Approved', 'Rejected'].includes(action)) {
        return res.status(400).json({ message: 'Action must be Approved or Rejected.' });
    }

    try {
        const result = await complaintService.processComplaint(complaintId, role, action, student_id);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error processing complaint:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
}

// Escalate complaint to warden
export async function escalateComplaint(req, res) {
    const complaintId = req.params.id;

    try {
        const result = await complaintService.escalateToWarden(complaintId);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Error escalating complaint:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
}

export async function addWardenLog(req, res) {
    const { id: wardenComplaintId } = req.params;
    const { update_text } = req.body;

    if (!update_text) {
        return res.status(400).json({ message: 'Update text is required.' });
    }

    try {
        const result = await complaintService.addWardenLog(wardenComplaintId, update_text);
        return res.status(201).json(result);
    } catch (error) {
        console.error('Error adding log:', error);
        return res.status(500).json({ message: error.message || 'Failed to add progress update' });
    }
}

export async function getWardenLogs(req, res) {
    const { id: wardenComplaintId } = req.params;

    try {
        const logs = await complaintService.getWardenLogs(wardenComplaintId);
        return res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return res.status(500).json({ message: 'Failed to fetch logs.' });
    }
}

export async function getAllWardenComplaints(req, res) {
    try {
        const complaints = await complaintService.getAllWardenComplaints();
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching warden complaints:', error);
        res.status(500).json({ message: 'Server error while retrieving warden complaints' });
    }
}