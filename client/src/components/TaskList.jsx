import TaskItem from './TaskItem';

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '5rem 2rem', gap: '1rem',
        border: '1px dashed var(--border)', borderRadius: 'var(--r)',
        marginTop: '1rem',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, border: '1px solid var(--border)',
        }}>✦</div>
        <p style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
          Nothing here
        </p>
        <p style={{ color: 'var(--text-sub)', fontSize: 14, textAlign: 'center', maxWidth: 280 }}>
          No tasks match your current filter. Try switching views or add a new task.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: '1rem' }}>
      {tasks.map((task, i) => (
        <div
          key={task.id}
          style={{ animation: `fadeUp 0.25s cubic-bezier(0.4,0,0.2,1) both`, animationDelay: `${i * 0.05}s` }}
        >
          <TaskItem task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ))}
    </div>
  );
}
