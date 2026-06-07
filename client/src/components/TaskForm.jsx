import { useState, useEffect } from 'react';

const field = {
  width: '100%', padding: '11px 14px',
  background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: 14,
  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
};

const PRIORITIES = [
  { value: 'high',   label: '● High',   color: 'var(--red)',   bg: 'var(--red-dim)' },
  { value: 'medium', label: '● Medium', color: 'var(--amber)', bg: 'var(--amber-dim)' },
  { value: 'low',    label: '● Low',    color: 'var(--green)', bg: 'var(--green-dim)' },
];

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setPriority(editingTask.priority || 'medium');
      setTags(editingTask.tags || []);
    } else {
      setTitle(''); setDescription(''); setDueDate(''); setPriority('medium'); setTags([]);
    }
  }, [editingTask]);

  function addTag(e) {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const t = tagInput.replace(',','').trim();
      if (t && !tags.includes(t)) setTags(p => [...p, t]);
      setTagInput('');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try { await onSubmit({ title: title.trim(), description, dueDate, priority, tags }); }
    finally { setSaving(false); }
  }

  const focus = e => { e.target.style.borderColor = 'var(--purple-glow)'; e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.1)'; };
  const blur  = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r)', overflow: 'hidden',
    }}>
      {/* Form header */}
      <div style={{
        padding: '14px 18px', background: 'var(--surface2)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--purple)', boxShadow: '0 0 8px var(--purple-glow)' }} />
        <p style={{ fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </p>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Task title *"
          required
          style={{ ...field, fontSize: 16, fontWeight: 500, fontFamily: 'Cabinet Grotesk, sans-serif' }}
          onFocus={focus} onBlur={blur}
        />

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          style={{ ...field, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={focus} onBlur={blur}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Priority */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Priority</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {PRIORITIES.map(p => (
                <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 'var(--r-xs)',
                    border: `1px solid ${priority === p.value ? p.color : 'var(--border)'}`,
                    background: priority === p.value ? p.bg : 'var(--surface2)',
                    color: priority === p.value ? p.color : 'var(--text-dim)',
                    fontSize: 11, cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s',
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              style={{ ...field, colorScheme: 'dark' }} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label style={{ display: 'block', fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Tags</label>
          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {tags.map(t => (
                <span key={t} style={{ padding: '3px 10px', borderRadius: 99, background: 'var(--purple-dim)', color: 'var(--purple)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, border: '1px solid rgba(139,92,246,0.2)' }}>
                  #{t}
                  <button type="button" onClick={() => setTags(p => p.filter(x => x !== t))}
                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
            placeholder="Type a tag and press Enter"
            style={field} onFocus={focus} onBlur={blur} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
          <button type="button" onClick={onCancel}
            style={{ padding: '10px 20px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', background: 'none', color: 'var(--text-sub)', cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
          <button type="submit" disabled={saving}
            style={{
              padding: '10px 24px', borderRadius: 'var(--r-sm)', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--purple), #7c3aed)',
              color: '#fff', fontSize: 14, fontWeight: 700,
              fontFamily: 'Cabinet Grotesk, sans-serif',
              opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s',
              boxShadow: '0 4px 16px var(--purple-glow)',
            }}>
            {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </form>
  );
}
