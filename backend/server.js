import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth-routes.js';
import wingRoutes from './routes/wing-routes.js';

const app = express();
const PORT = 5000;


app.use(cors()); // Important to allow frontend to make requests
app.use(express.json());

app.use('/api/auth', authRoutes);   
app.use('/api/wings', wingRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
