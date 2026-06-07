export default function Header({ filters, setFilters, showForm, onToggleForm }) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header style={{
      padding: '1.75rem 2rem 1rem',
      borderBottom: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', gap: '1rem',
      position: 'sticky', top: 0,
      background: 'rgba(6,6,10,0.85)', backdropFilter: 'blur(20px)',
      zIndex: 5,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
            {today}
          </p>
          <h2 style={{
            fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 800,
            fontSize: 26, letterSpacing: '-0.03em', color: 'var(--text)',
          }}>
            {filters.status === 'all' ? 'All Tasks' :
             filters.status === 'active' ? 'Active Tasks' : 'Completed Tasks'}
            {filters.priority && ` · ${filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1)} Priority`}
          </h2>
        </div>

        <button
          onClick={onToggleForm}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 'var(--r)',
            background: showForm
              ? 'var(--surface2)'
              : 'linear-gradient(135deg, var(--purple), #7c3aed)',
            color: '#fff', border: showForm ? '1px solid var(--border)' : 'none',
            cursor: 'pointer', fontSize: 14,
            fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700,
            transition: 'all 0.2s',
            boxShadow: showForm ? 'none' : '0 4px 20px var(--purple-glow)',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 300 }}>{showForm ? '×' : '+'}</span>
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', fontSize: 15, pointerEvents: 'none' }}>⌕</span>
        <input
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          placeholder="Search tasks by title or description..."
          style={{
            width: '100%', padding: '10px 14px 10px 38px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)', color: 'var(--text)', fontSize: 14,
            outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--purple-glow)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {filters.search && (
          <button
            onClick={() => setFilters(f => ({ ...f, search: '' }))}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
          >×</button>
        )}
      </div>
    </header>
  );
}
