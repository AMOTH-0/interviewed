import Link from 'next/link';
import { JobPosting } from '@/lib/types';
import CompanyBadge from './CompanyBadge';
import CompanyLogo from './CompanyLogo';
import StageFunnel from './StageFunnel';
import { formatDate } from '@/lib/mockData';

export default function PostingCard({ posting }: { posting: JobPosting }) {
  const { stats } = posting;
  const hasOffers     = (stats.byStage['Offer'] || 0) > 0;
  const hasInterview  = (stats.byStage['First Interview'] || 0) + (stats.byStage['Final Interview'] || 0) > 0;
  const hasAssessment = (stats.byStage['Assessment'] || 0) > 0;

  let statusBadge = { label: 'Applied', cls: 'badge--active' };
  if (hasOffers)          statusBadge = { label: '🎉 Offers out',        cls: 'badge--offer' };
  else if (hasInterview)  statusBadge = { label: '🎤 Interviews started', cls: 'badge--active' };
  else if (hasAssessment) statusBadge = { label: '📝 Assessments sent',   cls: 'badge--pending' };

  return (
    <Link href={`/jobs/${posting.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem 1.125rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          {/* Company logo */}
          <CompanyLogo company={posting.company} size={40} />

          {/* Title + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {posting.company}
              </span>
              <span className={`badge ${statusBadge.cls}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                {statusBadge.label}
              </span>
            </div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.35 }}>
              {posting.title}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              📍 {posting.city}, {posting.province} · {posting.jobType}
            </p>
          </div>
        </div>

        {/* Stage funnel bar */}
        <StageFunnel stats={stats} compact />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Stat label="Applicants"    value={stats.totalApplicants} />
          {stats.firstAssessmentDate && <Stat label="1st Assessment" value={formatDate(stats.firstAssessmentDate)} small />}
          {stats.firstInterviewDate  && <Stat label="1st Interview"  value={formatDate(stats.firstInterviewDate)}  small />}
          {stats.firstOfferDate      && <Stat label="1st Offer"      value={formatDate(stats.firstOfferDate)}      small accent />}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '0.5rem', borderTop: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Updated {formatDate(stats.lastUpdated)}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>View →</span>
        </div>
      </div>
    </Link>
  );
}

function Stat({ label, value, small, accent }: {
  label: string; value: string | number; small?: boolean; accent?: boolean;
}) {
  return (
    <div>
      <div style={{ fontSize: small ? '0.82rem' : '1rem', fontWeight: 700, color: accent ? 'var(--green)' : 'var(--text-primary)' }}>
        {value}
      </div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
