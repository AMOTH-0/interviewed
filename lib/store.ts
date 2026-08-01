'use client';

import { User, Submission, JobPosting, ApplicantStage, TimelineEntry } from './types';
import { MOCK_POSTINGS } from './mockData';

const CURRENT_USER_KEY = 'it_current_user';
const USER_SUBMISSIONS_KEY = 'it_user_submissions';
const TRACKED_POSTINGS_KEY = 'it_tracked_postings';
const PENDING_POSTINGS_KEY = 'it_pending_postings';
const REGISTERED_USERS_KEY = 'it_registered_users';

// ─── DEMO USER SEED ────────────────────────────────────────────────────────
// Call once on app init to ensure the demo account exists
export function seedDemoUser(): void {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(REGISTERED_USERS_KEY);
  const users: Record<string, string> = raw ? JSON.parse(raw) : {};
  if (!users['demo@interviewed.ca']) {
    users['demo@interviewed.ca'] = 'demo1234';
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }
  if (!users['admin@interviewed.ca']) {
    users['admin@interviewed.ca'] = 'admin1234';
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }
  seedDuplicateRequests();
}

// ─── SEED DUPLICATE REQUESTS ───────────────────────────────────────────────
// Pre-populates example pending requests that intentionally overlap so the
// admin "Duplicates" tab has realistic data to demonstrate the detection.
const SEED_REQUESTS_KEY = 'it_seed_requests_done_v2';

export function seedDuplicateRequests(): void {
  if (typeof window === 'undefined') return;
  // Only seed once per browser
  if (localStorage.getItem(SEED_REQUESTS_KEY)) return;

  const requests = [
    // ── PAIR 1: Company alias (TD vs Toronto-Dominion) + same title ──────────
    // High confidence — alias normalises to same company, title is identical
    {
      id: 'seed_r1',
      company: 'TD Bank',
      title: 'Financial Analyst – New Graduate 2026',
      city: 'Toronto',
      province: 'ON',
      jobType: 'New Graduate',
      postingUrl: 'https://jobs.td.com/financial-analyst-ng-2026',
      description: 'Submitted by user A. Found on TD careers portal.',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      submittedBy: 'u_demo1',
    },
    {
      id: 'seed_r2',
      company: 'Toronto-Dominion Bank',
      title: 'Financial Analyst – New Graduate 2026',
      city: 'Toronto',
      province: 'ON',
      jobType: 'New Graduate',
      postingUrl: '',
      description: 'Saw this on LinkedIn. Not sure if same as the TD one.',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      submittedBy: 'u_demo2',
    },

    // ── PAIR 2: Same company, very similar title with minor wording diff ──────
    // Medium confidence — "Co-op" vs "Internship", otherwise identical
    {
      id: 'seed_r3',
      company: 'RBC',
      title: 'Capital Markets – Summer Co-op 2026',
      city: 'Toronto',
      province: 'ON',
      jobType: 'Internship / Co-op',
      postingUrl: 'https://jobs.rbc.com/capital-markets-coop',
      description: '',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      submittedBy: 'u_demo3',
    },
    {
      id: 'seed_r4',
      company: 'Royal Bank of Canada',
      title: 'Capital Markets – Summer Internship 2026',
      city: 'Toronto',
      province: 'ON',
      jobType: 'Internship / Co-op',
      postingUrl: '',
      description: 'Listed as internship on Glassdoor.',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      submittedBy: 'u_demo4',
    },

    // ── PAIR 3: Company alias (EY vs Ernst & Young) + overlapping title ───────
    // High confidence — alias match + high keyword overlap
    {
      id: 'seed_r5',
      company: 'EY',
      title: 'Tax Advisory – New Graduate Associate Toronto',
      city: 'Toronto',
      province: 'ON',
      jobType: 'New Graduate',
      postingUrl: 'https://careers.ey.com/tax-advisory-ng',
      description: 'From EY website. Closes Sept 1.',
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      submittedBy: 'u_demo5',
    },
    {
      id: 'seed_r6',
      company: 'Ernst & Young',
      title: 'Tax Advisory Associate – New Graduate 2026',
      city: 'Toronto',
      province: 'ON',
      jobType: 'New Graduate',
      postingUrl: '',
      description: 'Saw this reposted on LinkedIn. Could be same as EY one.',
      submittedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      submittedBy: 'u_demo6',
    },
  ];

  localStorage.setItem(PENDING_POSTINGS_KEY, JSON.stringify(requests));
  localStorage.setItem(SEED_REQUESTS_KEY, '1');
}


// ─── AUTH ──────────────────────────────────────────────────────────────────

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function login(email: string, password: string): User | null {
  const raw = localStorage.getItem(REGISTERED_USERS_KEY);
  const users: Record<string, string> = raw ? JSON.parse(raw) : {};
  // Allow login if account exists with matching password, OR for admin/demo accounts
  const storedPw = users[email];
  if (storedPw && storedPw !== password) return null;
  // If account doesn't exist yet, reject (must sign up first)
  if (!storedPw) return null;

  const id = 'u_' + btoa(email).replace(/=/g, '').slice(0, 12);
  const user: User = {
    id,
    email,
    createdAt: new Date().toISOString(),
    contributionCount: getUserSubmissions().length,
    trackedPostings: getTrackedPostings(),
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
}

export function signup(email: string, password: string): User | null {
  const raw = localStorage.getItem(REGISTERED_USERS_KEY);
  const users: Record<string, string> = raw ? JSON.parse(raw) : {};
  if (users[email]) return null; // already exists
  users[email] = password;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  return login(email, password);
}

export function logout(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// ─── SUBMISSIONS ───────────────────────────────────────────────────────────

export function getUserSubmissions(): Submission[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(USER_SUBMISSIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getUserSubmissionForPosting(postingId: string): Submission | null {
  const user = getCurrentUser();
  if (!user) return null;
  const subs = getUserSubmissions();
  return subs.find(s => s.postingId === postingId) || null;
}

export function upsertSubmission(
  postingId: string,
  stage: ApplicantStage,
  date: string,
  applicationDate: string
): Submission {
  const user = getCurrentUser();
  if (!user) throw new Error('Not logged in');

  const subs = getUserSubmissions();
  const existing = subs.find(s => s.postingId === postingId);

  if (existing) {
    // Update: add to timeline if stage is new or more recent
    const alreadyHasStage = existing.timeline.some(e => e.stage === stage);
    if (!alreadyHasStage) {
      existing.timeline.push({ stage, date });
      existing.timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    existing.currentStage = stage;
    existing.updatedAt = new Date().toISOString();
    const idx = subs.findIndex(s => s.postingId === postingId);
    subs[idx] = existing;
    localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(subs));
    return existing;
  } else {
    const newSub: Submission = {
      id: 'us_' + Date.now(),
      postingId,
      userId: user.id,
      currentStage: stage,
      timeline: [{ stage, date }],
      updatedAt: new Date().toISOString(),
      applicationDate,
    };
    subs.push(newSub);
    localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(subs));
    // Update contribution count
    const updatedUser = { ...user, contributionCount: subs.length };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    return newSub;
  }
}

export function deleteSubmission(postingId: string): void {
  const subs = getUserSubmissions().filter(s => s.postingId !== postingId);
  localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(subs));
}

// ─── TRACKED POSTINGS ──────────────────────────────────────────────────────

export function getTrackedPostings(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(TRACKED_POSTINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function toggleTrackPosting(postingId: string): boolean {
  const tracked = getTrackedPostings();
  const idx = tracked.indexOf(postingId);
  if (idx >= 0) {
    tracked.splice(idx, 1);
    localStorage.setItem(TRACKED_POSTINGS_KEY, JSON.stringify(tracked));
    return false;
  } else {
    tracked.push(postingId);
    localStorage.setItem(TRACKED_POSTINGS_KEY, JSON.stringify(tracked));
    return true;
  }
}

export function isTracked(postingId: string): boolean {
  return getTrackedPostings().includes(postingId);
}

// ─── POSTING REQUESTS (USER-SUBMITTED) ────────────────────────────────────

export interface PendingPostingRequest {
  id: string;
  company: string;
  title: string;
  city: string;
  province: string;
  jobType: string;
  postingUrl: string;
  description: string;
  submittedAt: string;
  submittedBy: string;
}

export function submitPostingRequest(data: Omit<PendingPostingRequest, 'id' | 'submittedAt' | 'submittedBy'>): void {
  const user = getCurrentUser();
  const requests: PendingPostingRequest[] = getPendingPostingRequests();
  requests.push({
    ...data,
    id: 'pr_' + Date.now(),
    submittedAt: new Date().toISOString(),
    submittedBy: user?.id || 'anonymous',
  });
  localStorage.setItem(PENDING_POSTINGS_KEY, JSON.stringify(requests));
}

export function getPendingPostingRequests(): PendingPostingRequest[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(PENDING_POSTINGS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function deletePostingRequest(id: string): void {
  const updated = getPendingPostingRequests().filter(r => r.id !== id);
  localStorage.setItem(PENDING_POSTINGS_KEY, JSON.stringify(updated));
}

export function approvePostingRequest(id: string): void {
  // In production this would move to approved DB. For MVP, just remove from pending.
  deletePostingRequest(id);
}

// ─── MERGE ─────────────────────────────────────────────────────────────────
// Merges two pending requests into one, removing the originals.
// Smart defaults: canonical company name, prefer URL, combine descriptions.

export interface MergePreview {
  company: string;   // normalized canonical name
  title: string;
  city: string;
  province: string;
  jobType: string;
  postingUrl: string;
  description: string;
}

// Known aliases → canonical
const CANONICAL_COMPANY: Record<string, string> = {
  'td': 'TD Bank', 'td bank': 'TD Bank', 'toronto-dominion': 'TD Bank',
  'toronto-dominion bank': 'TD Bank', 'toronto dominion bank': 'TD Bank',
  'toronto dominion': 'TD Bank', 'td canada trust': 'TD Bank',
  'rbc': 'RBC', 'royal bank': 'RBC', 'royal bank of canada': 'RBC',
  'bmo': 'BMO', 'bank of montreal': 'BMO', 'bmo financial': 'BMO',
  'scotiabank': 'Scotiabank', 'bns': 'Scotiabank', 'bank of nova scotia': 'Scotiabank',
  'cibc': 'CIBC', 'canadian imperial bank of commerce': 'CIBC',
  'deloitte': 'Deloitte', 'deloitte canada': 'Deloitte',
  'ey': 'EY', 'ernst & young': 'EY', 'ernst and young': 'EY',
  'kpmg': 'KPMG', 'kpmg canada': 'KPMG',
  'pwc': 'PwC', 'pricewaterhousecoopers': 'PwC', 'price waterhouse coopers': 'PwC',
  'mckinsey': 'McKinsey', 'mckinsey & company': 'McKinsey',
  'bcg': 'BCG', 'boston consulting group': 'BCG',
};

function canonicalCompany(name: string): string {
  const key = name.toLowerCase().replace(/[^a-z0-9 &-]/g, '').trim();
  return CANONICAL_COMPANY[key] || name.trim();
}

export function buildMergePreview(a: PendingPostingRequest, b: PendingPostingRequest): MergePreview {
  // Pick canonical company
  const company = canonicalCompany(a.company);

  // Prefer the title from whichever has a URL (more likely to be verified)
  const title = a.postingUrl ? a.title : b.postingUrl ? b.title : a.title;

  // Prefer whichever URL is non-empty
  const postingUrl = a.postingUrl || b.postingUrl;

  // Combine descriptions, deduplicating blanks
  const descParts = [a.description, b.description].filter(Boolean);
  const description = descParts.length > 1
    ? `[From submission 1] ${a.description}\n[From submission 2] ${b.description}`
    : descParts[0] || '';

  return {
    company,
    title,
    city: a.city,
    province: a.province,
    jobType: a.jobType,
    postingUrl,
    description,
  };
}

export function mergePostingRequests(
  idA: string,
  idB: string,
  preview: MergePreview
): void {
  // Remove both originals
  const remaining = getPendingPostingRequests().filter(r => r.id !== idA && r.id !== idB);
  // Add merged entry
  const merged: PendingPostingRequest = {
    ...preview,
    id: 'merged_' + Date.now(),
    submittedAt: new Date().toISOString(),
    submittedBy: 'admin_merge',
  };
  remaining.unshift(merged); // put at top of list
  localStorage.setItem(PENDING_POSTINGS_KEY, JSON.stringify(remaining));
}


// ─── ENRICHED POSTING DATA ─────────────────────────────────────────────────
// Merge mock data with any localStorage user submissions

export function getEnrichedPosting(postingId: string): JobPosting | null {
  const posting = MOCK_POSTINGS.find(p => p.id === postingId);
  if (!posting) return null;
  const userSub = getUserSubmissionForPosting(postingId);
  if (!userSub) return posting;

  // Add user's submission to the posting (if not already there)
  const alreadyInMock = posting.submissions.some(s => s.id === userSub.id);
  if (alreadyInMock) return posting;

  const enriched = {
    ...posting,
    submissions: [...posting.submissions, userSub],
    stats: {
      ...posting.stats,
      totalApplicants: posting.stats.totalApplicants + 1,
      byStage: {
        ...posting.stats.byStage,
        [userSub.currentStage]: (posting.stats.byStage[userSub.currentStage] || 0) + 1,
      },
    },
  };
  return enriched;
}
