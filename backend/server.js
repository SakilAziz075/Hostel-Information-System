import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/auth-routes.js';
import complaintRoutes from './routes/complaint-routes.js';
import wingRoutes from './routes/wing-routes.js';
import boarderRoutes from './routes/boarder-routes.js';
import prefectRoutes from './routes/prefect-routes.js';
import noticeRoutes from './routes/notice-routes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from /uploads for direct file access if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/wings', wingRoutes);
app.use('/api/boarders', boarderRoutes);
app.use('/api/prefects', prefectRoutes);
app.use('/api/notices', noticeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
