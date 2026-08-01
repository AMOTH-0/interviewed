'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, submitPostingRequest } from '@/lib/store';
import { JOB_TYPES, JobType } from '@/lib/types';

const CANADIAN_PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
];

const CITIES_BY_PROVINCE: Record<string, string[]> = {
  ON: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London', 'Waterloo', 'Kitchener'],
  BC: ['Vancouver', 'Victoria', 'Burnaby', 'Surrey', 'Kelowna'],
  AB: ['Calgary', 'Edmonton'],
  QC: ['Montreal', 'Quebec City'],
  MB: ['Winnipeg'],
  NS: ['Halifax'],
  SK: ['Saskatoon', 'Regina'],
  NB: ['Fredericton', 'Moncton', 'Saint John'],
};

const QUICK_COMPANIES = ['Deloitte', 'EY', 'KPMG', 'PwC', 'TD Bank', 'RBC', 'BMO', 'Scotiabank', 'CIBC', 'McKinsey', 'BCG', 'Accenture'];

export default function NewPostingPage() {
  const router = useRouter();
  const [company, setCompany]       = useState('');
  const [title, setTitle]           = useState('');
  const [jobType, setJobType]       = useState<JobType>('New Graduate');
  const [province, setProvince]     = useState('ON');
  const [city, setCity]             = useState('Toronto');
  const [postingUrl, setPostingUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);

  useEffect(() => {
    if (!getCurrentUser()) router.push('/login?next=/jobs/new');
  }, [router]);

  // Reset city when province changes
  useEffect(() => {
    const cities = CITIES_BY_PROVINCE[province];
    if (cities) setCity(cities[0]);
    else setCity('');
  }, [province]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    submitPostingRequest({ company: company.trim(), title: title.trim(), city, province, jobType, postingUrl, description });
    setDone(true);
    setLoading(false);
  };

  if (done) {
    return (
      <div className="container--narrow page-content">
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem' }}>Posting submitted</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            <strong>{company} — {title}</strong> has been sent for review.
            Once approved it will appear on the browse page.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/browse" className="btn btn--primary">Browse postings</Link>
            <button className="btn btn--secondary" onClick={() => { setDone(false); setCompany(''); setTitle(''); }}>
              Submit another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableCities = CITIES_BY_PROVINCE[province];

  return (
    <div className="container--narrow page-content">
      <Link href="/browse" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem' }}>
        ← Browse
      </Link>

      <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>Add a job posting</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Know of a posting that isn't listed? Submit it for review.
        Any Canadian company is welcome — not just Big Four.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Company — free text + quick-selects */}
        <div className="form-group">
          <label className="form-label" htmlFor="company">Company *</label>
          <input
            id="company"
            className="form-input"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder="e.g. Deloitte, TD Bank, RBC, McKinsey…"
            required
          />
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quick select:</span>
            {QUICK_COMPANIES.map(q => (
              <button
                key={q}
                type="button"
                onClick={() => setCompany(q)}
                style={{
                  padding: '0.18rem 0.5rem',
                  fontSize: '0.72rem',
                  borderRadius: 4,
                  border: `1px solid ${company === q ? 'var(--accent)' : 'var(--border)'}`,
                  background: company === q ? 'var(--accent-light)' : '#fff',
                  color: company === q ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: company === q ? 600 : 400,
                  transition: 'all 0.12s',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Job type */}
        <div className="form-group">
          <label className="form-label" htmlFor="job-type">Job type *</label>
          <select id="job-type" className="form-select" value={jobType} onChange={e => setJobType(e.target.value as JobType)} required style={{ maxWidth: 280 }}>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="title">Job title *</label>
          <input
            id="title"
            className="form-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Audit Associate — New Graduate 2026"
            required
          />
        </div>

        {/* Province + City */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="province">Province *</label>
            <select id="province" className="form-select" value={province} onChange={e => setProvince(e.target.value)} required>
              {CANADIAN_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="city">City *</label>
            {availableCities ? (
              <select id="city" className="form-select" value={city} onChange={e => setCity(e.target.value)} required>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            ) : (
              <input
                id="city"
                className="form-input"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City name"
                required
              />
            )}
          </div>
        </div>

        {/* Posting URL */}
        <div className="form-group">
          <label className="form-label" htmlFor="posting-url">Posting URL <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--text-muted)' }}>(optional but recommended)</span></label>
          <input
            id="posting-url"
            className="form-input"
            type="url"
            value={postingUrl}
            onChange={e => setPostingUrl(e.target.value)}
            placeholder="https://careers.company.com/..."
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Helps reviewers confirm the posting exists.
          </p>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="description">Notes <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--text-muted)' }}>(optional)</span></label>
          <textarea
            id="description"
            className="form-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Deadline, rotation details, application cycle, etc."
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Disclaimer */}
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', padding: '0.7rem 0.875rem', background: 'var(--bg-subtle)', borderRadius: 6, border: '1px solid var(--border)', lineHeight: 1.6 }}>
          Submissions are reviewed before going live. Only include publicly advertised positions.
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn btn--primary" disabled={loading || !company.trim() || !title.trim()}>
            {loading ? 'Submitting…' : 'Submit for review'}
          </button>
          <Link href="/browse" className="btn btn--ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
