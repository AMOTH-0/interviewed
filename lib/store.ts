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
