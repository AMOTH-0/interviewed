'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchPostings } from '@/lib/mockData';
import { JobPosting, COMPANIES, JOB_TYPES, Company, JobType } from '@/lib/types';
import PostingCard from '@/components/PostingCard';

const CITIES = ['Toronto', 'Vancouver', 'Winnipeg', 'Calgary', 'Ottawa', 'Montreal'];

function BrowseContent() {
  const searchParams = useSearchParams();
  const [query, setQuery]   = useState(searchParams.get('q') || '');
  const [company, setCompany] = useState<Company | ''>(searchParams.get('company') as Company || '');
  const [jobType, setJobType] = useState<JobType | ''>('');
  const [city, setCity]       = useState('');
  const [sortBy, setSortBy]   = useState<'activity' | 'applicants' | 'recent'>('activity');
  const [results, setResults] = useState<JobPosting[]>([]);

  useEffect(() => {
    let res = searchPostings(query, company || undefined, jobType || undefined, city || undefined);
    if (sortBy === 'applicants') {
      res = [...res].sort((a, b) => b.stats.totalApplicants - a.stats.totalApplicants);
    } else if (sortBy === 'recent') {
      res = [...res].sort((a, b) => new Date(b.stats.lastUpdated).getTime() - new Date(a.stats.lastUpdated).getTime());
    } else {
      res = [...res].sort((a, b) => {
        const aA = (a.stats.byStage['First Interview'] || 0) + (a.stats.byStage['Offer'] || 0);
        const bA = (b.stats.byStage['First Interview'] || 0) + (b.stats.byStage['Offer'] || 0);
        return bA - aA;
      });
    }
    setResults(res);
  }, [query, company, jobType, city, sortBy]);

  const hasFilters = !!(query || company || jobType || city);

  return (
    <div className="container page-content">
      <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>Browse Postings</h1>

      {/* Filter bar */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.625rem',
        alignItems: 'flex-end', padding: '1rem', marginBottom: '1.25rem',
        background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8,
      }}>
        <div className="form-group" style={{ flex: '2 1 180px' }}>
          <label className="form-label" htmlFor="browse-search">Search</label>
          <input
            id="browse-search"
            className="form-input"
            placeholder="Company, role, city…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 130px' }}>
          <label className="form-label" htmlFor="filter-company">Firm</label>
          <select id="filter-company" className="form-select" value={company} onChange={e => setCompany(e.target.value as Company | '')}>
            <option value="">All firms</option>
            {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: '1 1 120px' }}>
          <label className="form-label" htmlFor="filter-type">Type</label>
          <select id="filter-type" className="form-select" value={jobType} onChange={e => setJobType(e.target.value as JobType | '')}>
            <option value="">All types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: '1 1 120px' }}>
          <label className="form-label" htmlFor="filter-city">City</label>
          <select id="filter-city" className="form-select" value={city} onChange={e => setCity(e.target.value)}>
            <option value="">All cities</option>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: '1 1 130px' }}>
          <label className="form-label" htmlFor="sort-by">Sort</label>
          <select id="sort-by" className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
            <option value="activity">Most active</option>
            <option value="applicants">Most applicants</option>
            <option value="recent">Recently updated</option>
          </select>
        </div>
        {hasFilters && (
          <button className="btn btn--ghost btn--sm" style={{ alignSelf: 'flex-end' }}
            onClick={() => { setQuery(''); setCompany(''); setJobType(''); setCity(''); }}>
            Clear ✕
          </button>
        )}
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.875rem' }}>
        {results.length} posting{results.length !== 1 ? 's' : ''} found
      </p>

      {/* Results */}
      {results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🔍</div>
          <p className="empty-state__title">No postings found</p>
          <p className="empty-state__text">Try adjusting your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {results.map(p => <PostingCard key={p.id} posting={p} />)}
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="container page-content" style={{ color: 'var(--text-muted)' }}>Loading…</div>}>
      <BrowseContent />
    </Suspense>
  );
}
