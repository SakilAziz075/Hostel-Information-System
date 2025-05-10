import { Router } from 'express';
const router = Router();
import { getAllWings, createWing, updateWing } from '../controllers/wing-controller.js';

router.get('/', getAllWings);
router.post('/', createWing);
router.put('/:id', updateWing);

export default router;
