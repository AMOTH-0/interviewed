import { ApplicantStage, PostingStats, STAGE_COLORS } from '@/lib/types';

const FUNNEL_STAGES: ApplicantStage[] = [
  'Applied',
  'Assessment',
  'Interview Invitation',
  'First Interview',
  'Final Interview',
  'Offer',
];

export default function StageFunnel({ stats, compact = false }: { stats: PostingStats; compact?: boolean }) {
  const total = stats.totalApplicants || 1;

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '2px', height: 6, borderRadius: 3, overflow: 'hidden', background: '#f3f4f6' }}>
        {[...FUNNEL_STAGES, 'Rejected' as ApplicantStage].map(stage => {
          const count = stats.byStage[stage] || 0;
          const pct = (count / total) * 100;
          if (!pct) return null;
          return (
            <div key={stage} title={`${stage}: ${count}`} style={{
              width: `${pct}%`, background: STAGE_COLORS[stage], borderRadius: 3,
              animation: 'bar-fill 0.6s ease both',
            }} />
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {[...FUNNEL_STAGES, 'Rejected' as ApplicantStage, 'Withdrawn' as ApplicantStage].map(stage => {
        const count = stats.byStage[stage] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: 150, fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right', flexShrink: 0 }}>
              {stage}
            </span>
            <div style={{ flex: 1, height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${pct}%`, height: '100%',
                background: STAGE_COLORS[stage],
                borderRadius: 4,
                animation: 'bar-fill 0.6s ease both',
                minWidth: count > 0 ? 6 : 0,
              }} />
            </div>
            <span style={{ width: 28, fontSize: '0.8rem', fontWeight: 600, color: count > 0 ? STAGE_COLORS[stage] : 'var(--text-muted)', textAlign: 'right' }}>
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
