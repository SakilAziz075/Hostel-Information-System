import { Router } from 'express';
const router = Router();
import { registerController, loginController } from '../controllers/auth-controller.js';
import { validateRegister, validateLogin } from '../middleware/validate-middleware.js';

router.post('/signup',registerController);
router.post('/login',loginController);

export default router;
