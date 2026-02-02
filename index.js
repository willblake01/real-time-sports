import express from 'express';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Real-Time Sports API!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Express server is running on http://localhost:${PORT}`);
});
