import express from 'express';
import cors from 'cors';

// Route imports
import authRoutes from './routes/auth-routes.js';
import complaintRoutes from './routes/complaint-routes.js';
import wingRoutes from './routes/wing-routes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Organized API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/wings', wingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
