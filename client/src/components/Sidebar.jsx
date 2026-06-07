export default function Sidebar({ stats, filters, setFilters, onClearCompleted }) {
  const s = stats || { total: 0, active: 0, completed: 0, overdue: 0, byPriority: {} };
  const completion = s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0;

  const navItems = [
    { label: 'All Tasks', value: 'all', icon: '◈', count: s.total },
    { label: 'Active', value: 'active', icon: '◉', count: s.active },
    { label: 'Completed', value: 'completed', icon: '◎', count: s.completed },
  ];

  const priorityItems = [
    { label: 'High', value: 'high', color: 'var(--red)', count: s.byPriority?.high || 0 },
    { label: 'Medium', value: 'medium', color: 'var(--amber)', count: s.byPriority?.medium || 0 },
    { label: 'Low', value: 'low', color: 'var(--green)', count: s.byPriority?.low || 0 },
  ];

  return (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '2rem 1rem',
      position: 'sticky', top: 0, height: '100vh',
      zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '2.5rem', paddingLeft: 8 }}>
        <h1 style={{
          fontFamily: 'Cabinet Grotesk, sans-serif',
          fontWeight: 900, fontSize: 22, letterSpacing: '-0.03em',
          color: 'var(--text)',
        }}>
          task<span style={{
            background: 'linear-gradient(135deg, var(--purple), #c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>flow</span>
        </h1>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3, letterSpacing: '0.05em' }}>
          PERSONAL WORKSPACE
        </p>
      </div>

      {/* Progress ring area */}
      <div style={{
        background: 'var(--surface2)', borderRadius: 'var(--r)',
        padding: '1rem', marginBottom: '1.5rem',
        border: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 500 }}>Overall Progress</span>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Cabinet Grotesk, sans-serif', color: 'var(--purple)' }}>
            {completion}%
          </span>
        </div>
        <div style={{ background: 'var(--surface3)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${completion}%`,
            background: 'linear-gradient(90deg, var(--purple), #c084fc)',
            borderRadius: 99,
            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 8px var(--purple-glow)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{s.completed} done</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{s.total} total</span>
        </div>
      </div>

      {/* Nav */}
      <p style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 6, paddingLeft: 8 }}>
        VIEWS
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: '1.5rem' }}>
        {navItems.map(item => {
          const active = filters.status === item.value && !filters.priority;
          return (
            <button
              key={item.value}
              onClick={() => setFilters(f => ({ ...f, status: item.value, priority: '' }))}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', borderRadius: 'var(--r-sm)',
                background: active ? 'var(--purple-dim)' : 'transparent',
                border: `1px solid ${active ? 'var(--purple-glow)' : 'transparent'}`,
                color: active ? 'var(--purple)' : 'var(--text-sub)',
                cursor: 'pointer', fontSize: 14, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s', textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-sub)'; }}}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                {item.label}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '1px 7px',
                borderRadius: 99, background: active ? 'var(--purple-glow)' : 'var(--surface3)',
                color: active ? 'var(--purple)' : 'var(--text-dim)',
              }}>
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Priority filter */}
      <p style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 6, paddingLeft: 8 }}>
        BY PRIORITY
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 'auto' }}>
        {priorityItems.map(item => {
          const active = filters.priority === item.value;
          return (
            <button
              key={item.value}
              onClick={() => setFilters(f => ({ ...f, priority: active ? '' : item.value, status: 'active' }))}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 'var(--r-sm)',
                background: active ? `${item.color}15` : 'transparent',
                border: `1px solid ${active ? `${item.color}40` : 'transparent'}`,
                color: active ? item.color : 'var(--text-sub)',
                cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s', textAlign: 'left',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-sub)'; }}}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, display: 'inline-block', boxShadow: active ? `0 0 6px ${item.color}` : 'none' }} />
                {item.label}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{item.count}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      {s.completed > 0 && (
        <button
          onClick={onClearCompleted}
          style={{
            marginTop: '1.5rem', width: '100%', padding: '9px',
            borderRadius: 'var(--r-sm)', border: '1px solid var(--border)',
            background: 'none', color: 'var(--text-dim)', cursor: 'pointer',
            fontSize: 12, transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red-dim)'; e.currentTarget.style.color = 'var(--red)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
        >
          Clear {s.completed} completed
        </button>
      )}
    </aside>
  );
}
