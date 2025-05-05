import { Router } from 'express';
const router = Router();
import { register, login } from '../controllers/auth-controller';
import { validateRegister, validateLogin } from '../middleware/validate-middleware';

router.post('/signup', validateRegister, register);
router.post('/login', validateLogin, login);

export default router;
