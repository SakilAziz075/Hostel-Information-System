import { Router } from 'express';
import {
    getAllPrefects,
    addPrefect,
    removePrefect,
    updatePrefect
} from '../controllers/prefect-controller.js';

const router = Router();

// Get all prefects
// Endpoint: GET /api/users/prefects
router.get('/prefects', getAllPrefects);

// Add a new prefect (this creates a new user and assigns the "prefect" role)
// Endpoint: POST /api/users/add-prefect
router.post('/add-prefect', addPrefect);

// Remove a prefect (removes the "prefect" role from the user)
// Endpoint: DELETE /api/users/remove-prefect/:user_id
router.delete('/remove-prefect/:user_id', removePrefect);

// Update prefect information (optional, could be for updating a floor or additional info)
router.put('/:user_id', updatePrefect);

export default router;
