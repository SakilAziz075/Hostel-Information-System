import { Router } from 'express';
import { getAllWings, createWing, updateWing } from '../controllers/wing-controller.js';

const router = Router();

router.get('/', getAllWings);
router.post('/', createWing);
router.put('/:id', updateWing);

export default router;
