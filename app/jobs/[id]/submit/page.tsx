'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPostingById } from '@/lib/mockData';
import { JobPosting, APPLICANT_STAGES, ApplicantStage, STAGE_COLORS, STAGE_ICONS } from '@/lib/types';
import { getCurrentUser, upsertSubmission, getUserSubmissionForPosting } from '@/lib/store';
import CompanyBadge from '@/components/CompanyBadge';

export default function SubmitPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [posting, setPosting] = useState<JobPosting | null>(null);
  const [stage, setStage] = useState<ApplicantStage>('Applied');
  const [stageDate, setStageDate] = useState(new Date().toISOString().slice(0, 10));
  const [applicationDate, setApplicationDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (!getCurrentUser()) { router.push('/login'); return; }
    const p = getPostingById(id);
    if (!p) { router.push('/browse'); return; }
    setPosting(p);
    const existing = getUserSubmissionForPosting(id);
    if (existing) {
      setIsUpdate(true);
      setApplicationDate(existing.applicationDate);
      setStage(existing.currentStage);
    }
  }, [id, router]);

  if (!posting) return <div className="container page-content" style={{ color: 'var(--text-muted)' }}>Loading…</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicationDate) { alert('Please enter your application date.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    upsertSubmission(id, stage, stageDate, applicationDate);
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="container--narrow page-content">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
          <h1 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            {isUpdate ? 'Stage updated' : 'Submission received'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Your stage (<strong>{stage}</strong>) has been {isUpdate ? 'updated' : 'added'}.
            Only the stage and date are shown — nothing identifies you.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/jobs/${id}`} className="btn btn--primary">View posting</Link>
            <Link href="/dashboard" className="btn btn--secondary">My applications</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container--narrow page-content">
      <Link href={`/jobs/${id}`} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}>
        ← Back
      </Link>

      <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        {isUpdate ? 'Update your stage' : 'Submit your stage'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
        Anonymous — only your stage and date are shown publicly.
      </p>

      {/* Posting pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1rem', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-subtle)', marginBottom: '1.75rem' }}>
        <CompanyBadge company={posting.company} size="sm" />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{posting.title}</span>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>· {posting.city}</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Application date */}
        <div className="form-group">
          <label className="form-label" htmlFor="app-date">Application date *</label>
          <input
            id="app-date"
            type="date"
            className="form-input"
            value={applicationDate}
            onChange={e => setApplicationDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            required
            disabled={isUpdate}
            style={{ maxWidth: 240, ...(isUpdate ? { opacity: 0.55 } : {}) }}
          />
          {isUpdate && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Locked after first submission.</p>
          )}
        </div>

        {/* Stage */}
        <div className="form-group">
          <label className="form-label">Current stage *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '0.5rem' }}>
            {APPLICANT_STAGES.map(s => (
              <button
                key={s}
                type="button"
                id={`stage-${s.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setStage(s)}
                style={{
                  padding: '0.6rem 0.875rem',
                  borderRadius: 6,
                  border: stage === s ? `2px solid ${STAGE_COLORS[s]}` : '1px solid var(--border)',
                  background: stage === s ? STAGE_COLORS[s] + '12' : '#fff',
                  color: stage === s ? STAGE_COLORS[s] : 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  fontWeight: stage === s ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.12s',
                }}
              >
                <span>{STAGE_ICONS[s]}</span>
                <span>{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stage date */}
        <div className="form-group">
          <label className="form-label" htmlFor="stage-date">Date you reached this stage *</label>
          <input
            id="stage-date"
            type="date"
            className="form-input"
            value={stageDate}
            onChange={e => setStageDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            required
            style={{ maxWidth: 240 }}
          />
        </div>

        {/* Privacy note */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.7rem 0.875rem', background: 'var(--bg-subtle)', borderRadius: 6, border: '1px solid var(--border)' }}>
          🔒 Your email and account are never shown. Only the stage and date are public.
        </div>

        <div>
          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? 'Saving…' : isUpdate ? 'Update stage' : 'Submit stage'}
          </button>
        </div>
      </form>
    </div>
  );
}
