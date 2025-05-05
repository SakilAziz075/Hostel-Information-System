import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors()); // Important to allow frontend to make requests

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
