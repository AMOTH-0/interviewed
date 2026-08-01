import Link from 'next/link';
import { JobPosting, STAGE_COLORS } from '@/lib/types';
import CompanyBadge from './CompanyBadge';
import { formatDate } from '@/lib/mockData';

export default function PostingCard({ posting }: { posting: JobPosting }) {
  const { stats } = posting;
  const hasOffers    = (stats.byStage['Offer'] || 0) > 0;
  const hasInterview = (stats.byStage['First Interview'] || 0) + (stats.byStage['Final Interview'] || 0) > 0;
  const hasAssessment= (stats.byStage['Assessment'] || 0) > 0;

  let statusLabel = 'Applied only';
  let statusCls = 'badge--active';
  if (hasOffers)     { statusLabel = 'Offers out';         statusCls = 'badge--offer'; }
  else if (hasInterview)  { statusLabel = 'Interviews started'; statusCls = 'badge--new'; }
  else if (hasAssessment) { statusLabel = 'Assessments sent';   statusCls = 'badge--pending'; }

  const total = stats.totalApplicants || 1;

  return (
    <Link href={`/jobs/${posting.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div className="card card--clickable" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
              <CompanyBadge company={posting.company} size="sm" />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{posting.jobType}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{posting.city}, {posting.province}</span>
            </div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {posting.title}
            </h3>

            {/* Mini stage bar */}
            <div style={{ display: 'flex', gap: '2px', height: 5, borderRadius: 3, overflow: 'hidden', background: '#f3f4f6', marginBottom: '0.6rem', maxWidth: 320 }}>
              {(['Applied','Assessment','Interview Invitation','First Interview','Final Interview','Offer','Rejected'] as const).map(stage => {
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

            {/* Stats row */}
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <span><strong style={{ color: 'var(--text-primary)' }}>{stats.totalApplicants}</strong> applicants</span>
              {stats.firstAssessmentDate && <span>1st assess. {formatDate(stats.firstAssessmentDate)}</span>}
              {stats.firstInterviewDate  && <span>1st interview {formatDate(stats.firstInterviewDate)}</span>}
              {stats.firstOfferDate      && <span style={{ color: 'var(--green)', fontWeight: 500 }}>Offer {formatDate(stats.firstOfferDate)}</span>}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
            <span className={`badge ${statusCls}`}>{statusLabel}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Updated {formatDate(stats.lastUpdated)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
