'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPostingById, formatDate } from '@/lib/mockData';
import { JobPosting } from '@/lib/types';
import { getCurrentUser, isTracked, toggleTrackPosting, getUserSubmissionForPosting } from '@/lib/store';
import CompanyBadge from '@/components/CompanyBadge';
import StageFunnel from '@/components/StageFunnel';
import TimelineFeed from '@/components/TimelineFeed';

export default function JobPostingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [posting, setPosting] = useState<JobPosting | null>(null);
  const [tracked, setTracked] = useState(false);
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null);
  const [userSub, setUserSub] = useState<ReturnType<typeof getUserSubmissionForPosting>>(null);

  useEffect(() => {
    const p = getPostingById(id);
    if (!p || p.status !== 'approved') { router.push('/browse'); return; }
    setPosting(p);
    setTracked(isTracked(id));
    setUser(getCurrentUser());
    setUserSub(getUserSubmissionForPosting(id));
  }, [id, router]);

  if (!posting) return (
    <div className="container page-content" style={{ color: 'var(--text-muted)' }}>Loading…</div>
  );

  const { stats } = posting;

  const handleTrack = () => {
    if (!user) { router.push('/login'); return; }
    setTracked(toggleTrackPosting(id));
  };

  return (
    <div className="container--narrow page-content">
      {/* Back */}
      <Link href="/browse" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}>
        ← Browse
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <CompanyBadge company={posting.company} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{posting.jobType}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>·</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{posting.city}, {posting.province}</span>
              {posting.deadline && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>· Deadline {formatDate(posting.deadline)}</span>
              )}
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{posting.title}</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button id="track-btn" onClick={handleTrack} className="btn btn--secondary btn--sm">
              {tracked ? '🔔 Following' : '+ Follow'}
            </button>
            <Link href={user ? `/jobs/${id}/submit` : '/login'} className="btn btn--primary btn--sm">
              {userSub ? 'Update my stage' : 'Submit my stage'}
            </Link>
          </div>
        </div>

        {posting.description && (
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.875rem', lineHeight: 1.65 }}>
            {posting.description}
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.6rem 0.875rem', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 6, marginBottom: '1.5rem' }}>
        ⚠️ All data is community-reported and unverified. Not affiliated with {posting.company}.
      </div>

      {/* Your submission */}
      {userSub && (
        <div style={{ padding: '0.875rem 1rem', border: '1px solid #bfdbfe', borderRadius: 8, background: 'var(--accent-light)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem' }}>
            Your stage: <strong>{userSub.currentStage}</strong>
          </span>
          <Link href={`/jobs/${id}/submit`} className="btn btn--secondary btn--sm">Update →</Link>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.625rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Applicants', value: stats.totalApplicants },
          { label: 'Assessments', value: stats.byStage['Assessment'] || 0 },
          { label: 'Interviews', value: (stats.byStage['First Interview'] || 0) + (stats.byStage['Final Interview'] || 0) },
          { label: 'Offers', value: stats.byStage['Offer'] || 0 },
          { label: 'Rejections', value: stats.byStage['Rejected'] || 0 },
        ].map(s => (
          <div key={s.label} className="stat-box">
            <div className="stat-box__number">{s.value}</div>
            <div className="stat-box__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Milestone dates */}
      {(stats.firstAssessmentDate || stats.firstInterviewDate || stats.firstOfferDate) && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-subtle)' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>Milestone dates</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {stats.firstAssessmentDate && <Milestone label="First assessment" date={stats.firstAssessmentDate} />}
            {stats.firstInterviewDate  && <Milestone label="First interview"  date={stats.firstInterviewDate} />}
            {stats.firstOfferDate      && <Milestone label="First offer"      date={stats.firstOfferDate} color="var(--green)" />}
            {stats.firstRejectionDate  && <Milestone label="First rejection"  date={stats.firstRejectionDate} color="var(--red)" />}
          </div>
        </div>
      )}

      {/* Stage breakdown */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.875rem' }}>
          Stage breakdown
        </p>
        <StageFunnel stats={stats} />
      </div>

      {/* Timelines */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Applicant timelines
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{posting.submissions.length} reports</span>
        </div>
        <TimelineFeed submissions={posting.submissions} />
      </div>

      {/* Submit CTA */}
      {!userSub && (
        <div style={{ marginTop: '2rem', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-subtle)', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.3rem', fontSize: '0.9rem' }}>Applied to this posting?</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Share your stage anonymously — it only takes 30 seconds.
          </p>
          <Link href={user ? `/jobs/${id}/submit` : '/signup'} className="btn btn--primary btn--sm">
            {user ? 'Submit my stage' : 'Sign up to contribute'}
          </Link>
        </div>
      )}
    </div>
  );
}

function Milestone({ label, date, color }: { label: string; date: string; color?: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: color || 'var(--text-primary)' }}>{formatDate(date)}</div>
    </div>
  );
}
