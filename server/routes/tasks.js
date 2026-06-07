const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../data/tasks.json');

function readTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function writeTasks(tasks) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// GET /api/tasks?status=active&priority=high&search=keyword
router.get('/', (req, res) => {
  let tasks = readTasks();
  const { status, priority, search } = req.query;

  if (status === 'active') tasks = tasks.filter(t => !t.completed);
  if (status === 'completed') tasks = tasks.filter(t => t.completed);
  if (priority) tasks = tasks.filter(t => t.priority === priority);
  if (search) tasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  );

  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(tasks);
});

// GET /api/tasks/stats
router.get('/stats', (req, res) => {
  const tasks = readTasks();
  const now = new Date();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  const overdue = tasks.filter(t =>
    t.dueDate && !t.completed && new Date(t.dueDate) < now
  ).length;
  const byPriority = {
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
    medium: tasks.filter(t => t.priority === 'medium' && !t.completed).length,
    low: tasks.filter(t => t.priority === 'low' && !t.completed).length,
  };
  res.json({ total, completed, active, overdue, byPriority });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { title, description, dueDate, priority = 'medium', tags = [] } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    description: description || '',
    dueDate: dueDate || null,
    priority,
    tags,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const tasks = readTasks();
  tasks.push(newTask);
  writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const tasks = readTasks();
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[index] = { ...tasks[index], ...req.body };
  writeTasks(tasks);
  res.json(tasks[index]);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  let tasks = readTasks();
  if (!tasks.find(t => t.id === req.params.id)) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks = tasks.filter(t => t.id !== req.params.id);
  writeTasks(tasks);
  res.json({ message: 'Task deleted' });
});

// DELETE /api/tasks/completed/all — bulk delete completed
router.delete('/completed/all', (req, res) => {
  let tasks = readTasks();
  tasks = tasks.filter(t => !t.completed);
  writeTasks(tasks);
  res.json({ message: 'Cleared completed tasks' });
});

module.exports = router;
