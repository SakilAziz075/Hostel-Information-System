import { Router } from 'express';
import {
    submitComplaint,
    getAllComplaints,
    updateComplaintStatus,
    processComplaint
} from '../controllers/complaint-controller.js';

const router = Router();

router.post('/', submitComplaint);
router.get('/', getAllComplaints);
router.put('/:id/status', updateComplaintStatus);
router.put('/:id/process', processComplaint); // ✅ Fixed


export default router;
