import { Submission, STAGE_COLORS, STAGE_ICONS } from '@/lib/types';
import { formatDate, daysBetween } from '@/lib/mockData';

export default function TimelineFeed({ submissions }: { submissions: Submission[] }) {
  if (submissions.length < 3) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--bg-subtle)',
        borderRadius: 8,
        border: '1px dashed var(--border-strong)',
      }}>
        <p style={{ fontSize: '1.25rem', marginBottom: '0.375rem' }}>🔒</p>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Timelines unlock at 3+ submissions</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
          Contribute your stage to help unlock this posting.
        </p>
      </div>
    );
  }

  const sorted = [...submissions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
      {sorted.map(sub => (
        <TimelineRow key={sub.id} submission={sub} />
      ))}
    </div>
  );
}

function TimelineRow({ submission: sub }: { submission: Submission }) {
  const daysSinceApplied = daysBetween(sub.applicationDate, sub.updatedAt);

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '0.875rem 1rem',
      background: '#fff',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: STAGE_COLORS[sub.currentStage],
            display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: STAGE_COLORS[sub.currentStage] }}>
            {STAGE_ICONS[sub.currentStage]} {sub.currentStage}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Applied {formatDate(sub.applicationDate)}</span>
          <span>Day {daysSinceApplied}</span>
        </div>
      </div>

      {/* Timeline dots */}
      <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {sub.timeline.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div title={entry.stage} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: STAGE_COLORS[entry.stage] + '15',
                border: `2px solid ${STAGE_COLORS[entry.stage]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem',
              }}>
                {STAGE_ICONS[entry.stage]}
              </div>
              <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 3, maxWidth: 38, textAlign: 'center', lineHeight: 1.2 }}>
                {formatDate(entry.date).replace(/\d{4}/, '').trim().replace(/,$/, '')}
              </div>
            </div>
            {i < sub.timeline.length - 1 && (
              <div style={{ width: 20, height: 1, background: 'var(--border)', flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
