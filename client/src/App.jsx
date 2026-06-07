import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function App() {
  const [filters, setFilters] = useState({ status: 'all', priority: '', search: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const { tasks, stats, loading, error, addTask, updateTask, deleteTask, clearCompleted } = useTasks(filters);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleSubmit(data) {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        showToast('Task updated ✓');
        setEditingTask(null);
      } else {
        await addTask(data);
        showToast('Task created ✓');
      }
      setShowForm(false);
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function handleDelete(id) {
    if (window.confirm('Delete this task?')) {
      await deleteTask(id);
      showToast('Task deleted', 'error');
    }
  }

  async function handleToggle(id) {
    const task = tasks.find(t => t.id === id);
    await updateTask(id, { completed: !task.completed });
  }

  function handleEdit(task) {
    setEditingTask(task);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Noise texture overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
      }} />

      {/* Ambient glows */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 50% 40% at 80% 0%, rgba(139,92,246,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 30% 30% at 0% 100%, rgba(34,197,94,0.05) 0%, transparent 60%)
        `,
      }} />

      {/* Sidebar */}
      <Sidebar
        stats={stats}
        filters={filters}
        setFilters={setFilters}
        onClearCompleted={clearCompleted}
      />

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Header
          filters={filters}
          setFilters={setFilters}
          showForm={showForm}
          onToggleForm={() => { setEditingTask(null); setShowForm(s => !s); }}
        />

        <main style={{ flex: 1, padding: '0 2rem 3rem', maxWidth: 860, width: '100%' }}>
          {/* Form */}
          {showForm && (
            <div style={{ marginBottom: '1.5rem', animation: 'slideDown 0.25s cubic-bezier(0.4,0,0.2,1)' }}>
              <TaskForm
                onSubmit={handleSubmit}
                editingTask={editingTask}
                onCancel={() => { setShowForm(false); setEditingTask(null); }}
              />
            </div>
          )}

          {/* Task list */}
          {loading ? <SkeletonList /> : error ? <ErrorState /> : (
            <TaskList
              tasks={tasks}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 999,
          padding: '13px 22px', borderRadius: 'var(--r)',
          background: toast.type === 'error' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`,
          color: toast.type === 'error' ? 'var(--red)' : 'var(--green)',
          fontSize: 14, fontWeight: 500, backdropFilter: 'blur(12px)',
          animation: 'toastIn 0.25s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 8px 32px ${toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
        }}>
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(12px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

function SkeletonList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[80, 110, 90].map((h, i) => (
        <div key={i} style={{
          height: h, borderRadius: 'var(--r)',
          background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
          backgroundSize: '400px 100%',
          animation: `shimmer 1.4s ease infinite`,
          animationDelay: `${i * 0.15}s`,
        }} />
      ))}
    </div>
  );
}

function ErrorState() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--red)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚠</div>
      <p style={{ fontWeight: 600, fontSize: 16 }}>Cannot reach server</p>
      <p style={{ color: 'var(--text-sub)', fontSize: 13, marginTop: 6 }}>Make sure the backend is running on port 5000</p>
    </div>
  );
}
