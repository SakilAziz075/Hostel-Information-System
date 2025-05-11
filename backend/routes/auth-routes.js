import { Router } from 'express';
import { registerController, loginController } from '../controllers/auth-controller.js';

const router = Router();

router.post('/signup', registerController);
router.post('/login', loginController);

export default router;
