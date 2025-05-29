import { Router } from 'express';
import {
    submitComplaint,
    getAllComplaints,
    updateComplaintStatus,
    processComplaint,
    escalateComplaint,
    addWardenLog,
    getWardenLogs,
    getAllWardenComplaints,
    getComplaintsByStudentId
} from '../controllers/complaint-controller.js';

const router = Router();

router.post('/', submitComplaint);
router.get('/', getAllComplaints);
router.put('/:id/status', updateComplaintStatus);
router.put('/:id/process', processComplaint); // ✅ Fixed
router.put('/:id/escalate', escalateComplaint);
router.post('/:id/logs', addWardenLog);
router.get('/:id/logs', getWardenLogs);
router.get('/warden', getAllWardenComplaints);
router.get('/complaints/student/:student_id', getComplaintsByStudentId);

export default router;
