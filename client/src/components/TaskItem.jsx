import { useState } from 'react';

const PRIORITY = {
  high:   { color: 'var(--red)',    bg: 'var(--red-dim)',   glow: 'rgba(239,68,68,0.2)',   label: 'High' },
  medium: { color: 'var(--amber)',  bg: 'var(--amber-dim)', glow: 'rgba(245,158,11,0.2)',  label: 'Medium' },
  low:    { color: 'var(--green)',  bg: 'var(--green-dim)', glow: 'rgba(34,197,94,0.2)',   label: 'Low' },
};

function smartDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0,0,0,0); d.setHours(0,0,0,0);
  const diff = Math.round((d - now) / 86400000);
  if (diff < 0)  return { text: `${Math.abs(diff)}d overdue`, color: 'var(--red)', icon: '⚠' };
  if (diff === 0) return { text: 'Due today', color: 'var(--amber)', icon: '◷' };
  if (diff === 1) return { text: 'Due tomorrow', color: 'var(--amber)', icon: '◷' };
  if (diff <= 7)  return { text: `In ${diff} days`, color: 'var(--text-sub)', icon: '◷' };
  return { text: new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), color: 'var(--text-dim)', icon: '◷' };
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const p = PRIORITY[task.priority] || PRIORITY.medium;
  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const dateInfo = task.dueDate ? smartDate(task.dueDate) : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 'var(--r)',
        background: hovered ? 'var(--surface2)' : 'var(--surface)',
        border: `1px solid ${isOverdue && !task.completed ? 'rgba(239,68,68,0.25)' : hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        boxShadow: hovered ? '0 4px 24px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {/* Priority accent bar */}
      <div style={{
        height: 3,
        background: task.completed ? 'var(--surface3)' : `linear-gradient(90deg, ${p.color}, transparent)`,
        transition: 'all 0.3s',
      }} />

      <div style={{ padding: '16px 18px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task.id)}
            style={{
              width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
              border: `2px solid ${task.completed ? 'var(--green)' : p.color}`,
              background: task.completed ? 'var(--green)' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', color: '#000', fontSize: 12, fontWeight: 800,
              boxShadow: task.completed ? '0 0 8px rgba(34,197,94,0.4)' : hovered ? `0 0 8px ${p.glow}` : 'none',
            }}
          >{task.completed ? '✓' : ''}</button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontFamily: 'Cabinet Grotesk, sans-serif',
              fontWeight: 700, fontSize: 16, lineHeight: 1.3,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? 'var(--text-dim)' : 'var(--text)',
              transition: 'all 0.2s',
            }}>{task.title}</p>

            {task.description && (
              <p style={{ fontSize: 13, color: 'var(--text-sub)', marginTop: 5, lineHeight: 1.5 }}>
                {task.description}
              </p>
            )}
          </div>

          {/* Priority badge */}
          <span style={{
            flexShrink: 0, fontSize: 11, padding: '4px 10px', borderRadius: 99,
            background: p.bg, color: p.color, fontWeight: 600,
            letterSpacing: '0.04em', border: `1px solid ${p.color}30`,
          }}>
            {p.label}
          </span>
        </div>

        {/* Meta row: due date + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
          {dateInfo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 500 }}>Due Date:</span>
              <span style={{ fontSize: 13, color: dateInfo.color, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                {dateInfo.icon} {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                <span style={{ fontSize: 11, opacity: 0.8 }}>({dateInfo.text})</span>
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 500 }}>Status:</span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600,
              color: task.completed ? 'var(--green)' : 'var(--text-sub)',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', display: 'inline-block',
                background: task.completed ? 'var(--green)' : 'var(--text-dim)',
                boxShadow: task.completed ? '0 0 6px rgba(34,197,94,0.6)' : 'none',
              }} />
              {task.completed ? 'Completed' : 'Active'}
            </span>
          </div>

          {/* Tags */}
          {task.tags && task.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, padding: '2px 9px', borderRadius: 99,
              background: 'var(--purple-dim)', color: 'var(--purple)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}>#{tag}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => onToggle(task.id)}
            style={{
              padding: '7px 16px', borderRadius: 'var(--r-xs)',
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: task.completed
                ? 'linear-gradient(135deg, var(--amber), #d97706)'
                : 'linear-gradient(135deg, var(--green), #16a34a)',
              color: '#fff', transition: 'opacity 0.15s, transform 0.15s',
              boxShadow: task.completed ? '0 2px 10px rgba(245,158,11,0.3)' : '0 2px 10px rgba(34,197,94,0.3)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity='0.88'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            {task.completed ? '↩ Mark Incomplete' : '✓ Mark Complete'}
          </button>

          <button
            onClick={() => onEdit(task)}
            style={{
              padding: '7px 16px', borderRadius: 'var(--r-xs)',
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: 'linear-gradient(135deg, var(--purple), #7c3aed)',
              color: '#fff', transition: 'opacity 0.15s, transform 0.15s',
              boxShadow: '0 2px 10px var(--purple-glow)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity='0.88'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            ✎ Edit
          </button>

          <button
            onClick={() => onDelete(task.id)}
            style={{
              padding: '7px 16px', borderRadius: 'var(--r-xs)',
              border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, background: 'var(--red-dim)',
              color: 'var(--red)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--red)'; e.currentTarget.style.color='#fff'; e.currentTarget.style.transform='translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--red-dim)'; e.currentTarget.style.color='var(--red)'; e.currentTarget.style.transform='translateY(0)'; }}
          >
            ✕ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
