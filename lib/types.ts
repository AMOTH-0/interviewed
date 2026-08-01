export type ApplicantStage =
  | 'Applied'
  | 'Assessment'
  | 'Recruiter Contact'
  | 'Interview Invitation'
  | 'First Interview'
  | 'Final Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export const APPLICANT_STAGES: ApplicantStage[] = [
  'Applied',
  'Assessment',
  'Recruiter Contact',
  'Interview Invitation',
  'First Interview',
  'Final Interview',
  'Offer',
  'Rejected',
  'Withdrawn',
];

export const STAGE_COLORS: Record<ApplicantStage, string> = {
  'Applied': 'var(--stage-applied)',
  'Assessment': 'var(--stage-assessment)',
  'Recruiter Contact': 'var(--stage-recruiter)',
  'Interview Invitation': 'var(--stage-invite)',
  'First Interview': 'var(--stage-first)',
  'Final Interview': 'var(--stage-final)',
  'Offer': 'var(--stage-offer)',
  'Rejected': 'var(--stage-rejected)',
  'Withdrawn': 'var(--stage-withdrawn)',
};

export const STAGE_ICONS: Record<ApplicantStage, string> = {
  'Applied': '📋',
  'Assessment': '📝',
  'Recruiter Contact': '📞',
  'Interview Invitation': '✉️',
  'First Interview': '🎤',
  'Final Interview': '🏆',
  'Offer': '🎉',
  'Rejected': '❌',
  'Withdrawn': '↩️',
};

export type JobType = 'Internship' | 'Co-op' | 'New Graduate' | 'Entry-Level Full-Time';

export const JOB_TYPES: JobType[] = [
  'Internship',
  'Co-op',
  'New Graduate',
  'Entry-Level Full-Time',
];

export type Company = 'Deloitte' | 'EY' | 'KPMG' | 'PwC';

export const COMPANIES: Company[] = ['Deloitte', 'EY', 'KPMG', 'PwC'];

export const COMPANY_COLORS: Record<Company, string> = {
  'Deloitte': '#86BC25',
  'EY': '#FFE600',
  'KPMG': '#00338D',
  'PwC': '#D93025',
};

export const COMPANY_TEXT_COLORS: Record<Company, string> = {
  'Deloitte': '#86BC25',
  'EY': '#c4b200',
  'KPMG': '#4d85d1',
  'PwC': '#e05c5c',
};

export interface TimelineEntry {
  stage: ApplicantStage;
  date: string; // ISO date string
}

export interface Submission {
  id: string;
  postingId: string;
  userId: string; // anonymized
  currentStage: ApplicantStage;
  timeline: TimelineEntry[];
  updatedAt: string;
  applicationDate: string;
}

export interface PostingStats {
  totalApplicants: number;
  byStage: Partial<Record<ApplicantStage, number>>;
  firstAssessmentDate: string | null;
  firstInterviewDate: string | null;
  firstOfferDate: string | null;
  firstRejectionDate: string | null;
  lastUpdated: string;
}

export interface JobPosting {
  id: string;
  company: Company;
  title: string;
  city: string;
  province: string;
  jobType: JobType;
  postingUrl: string;
  description: string;
  deadline: string | null;
  postedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  stats: PostingStats;
  submissions: Submission[];
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  contributionCount: number;
  trackedPostings: string[]; // posting IDs
}

export interface RecentActivity {
  postingId: string;
  company: Company;
  title: string;
  city: string;
  stage: ApplicantStage;
  timeAgo: string;
}
