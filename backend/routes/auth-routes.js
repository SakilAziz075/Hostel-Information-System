import { Router } from 'express';
const router = Router();
import { registerController, loginController } from '../controllers/auth-controller.js';
import { submitComplaint } from '../controllers/complaint-controller.js';

router.post('/signup',registerController);

router.post('/login',loginController);
router.post('/complaint' , submitComplaint)

export default router;
