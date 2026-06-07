import { useState, useEffect, useCallback } from 'react';

const API = 'https://personal-task-manager-hzh4.onrender.com/api/tasks';

export function useTasks(filters = {}) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      if (filters.search) params.set('search', filters.search);
      const res = await fetch(`${API}?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      setTasks(await res.json());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.search]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/stats`);
      setStats(await res.json());
    } catch {}
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  async function addTask(data) {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add');
    const created = await res.json();
    setTasks(prev => [created, ...prev]);
    fetchStats();
    return created;
  }

  async function updateTask(id, updates) {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update');
    const updated = await res.json();
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    fetchStats();
    return updated;
  }

  async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setTasks(prev => prev.filter(t => t.id !== id));
    fetchStats();
  }

  async function clearCompleted() {
    await fetch(`${API}/completed/all`, { method: 'DELETE' });
    setTasks(prev => prev.filter(t => !t.completed));
    fetchStats();
  }

  return { tasks, stats, loading, error, addTask, updateTask, deleteTask, clearCompleted, refetch: fetchTasks };
}
