import complaintService from '../services/complaint-service.js';

// Controller for submitting complaints
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

        return res.status(201).json(result); // Return the result with complaint_id and success message
    } catch (error) {
        console.error('Error submitting complaint:', error);
        return res.status(error.status || 500).json({ message: error.message || 'Internal server error' });
    }
}
