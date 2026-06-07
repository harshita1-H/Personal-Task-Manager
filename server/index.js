const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

// Root route — confirms server is running
app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API is running', endpoints: ['/api/tasks'] });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
