import { JobPosting, Submission, RecentActivity } from './types';

// ─── SEED DATA ─────────────────────────────────────────────────────────────

export const MOCK_POSTINGS: JobPosting[] = [
  // ── DELOITTE ──────────────────────────────────────────────────────────────
  {
    id: 'del-audit-ng-wpg-2025',
    company: 'Deloitte',
    title: 'Audit & Assurance – New Graduate',
    city: 'Winnipeg',
    province: 'MB',
    jobType: 'New Graduate',
    postingUrl: 'https://careers.deloitte.com',
    description: 'Join Deloitte\'s Audit & Assurance practice as a new graduate. Work with leading Canadian organizations across various industries.',
    deadline: '2025-09-15',
    postedDate: '2025-07-01',
    status: 'approved',
    stats: {
      totalApplicants: 28,
      byStage: {
        'Applied': 5,
        'Assessment': 8,
        'Recruiter Contact': 4,
        'Interview Invitation': 5,
        'First Interview': 3,
        'Final Interview': 1,
        'Offer': 1,
        'Rejected': 1,
      },
      firstAssessmentDate: '2025-07-18',
      firstInterviewDate: '2025-08-05',
      firstOfferDate: '2025-08-28',
      firstRejectionDate: '2025-08-20',
      lastUpdated: '2025-08-30',
    },
    submissions: [
      {
        id: 's001', postingId: 'del-audit-ng-wpg-2025', userId: 'user_a7x2',
        currentStage: 'Offer', updatedAt: '2025-08-28', applicationDate: '2025-07-05',
        timeline: [
          { stage: 'Applied', date: '2025-07-05' },
          { stage: 'Assessment', date: '2025-07-19' },
          { stage: 'Interview Invitation', date: '2025-08-02' },
          { stage: 'First Interview', date: '2025-08-12' },
          { stage: 'Final Interview', date: '2025-08-22' },
          { stage: 'Offer', date: '2025-08-28' },
        ],
      },
      {
        id: 's002', postingId: 'del-audit-ng-wpg-2025', userId: 'user_b3m9',
        currentStage: 'Rejected', updatedAt: '2025-08-20', applicationDate: '2025-07-06',
        timeline: [
          { stage: 'Applied', date: '2025-07-06' },
          { stage: 'Assessment', date: '2025-07-20' },
          { stage: 'Interview Invitation', date: '2025-08-03' },
          { stage: 'First Interview', date: '2025-08-13' },
          { stage: 'Rejected', date: '2025-08-20' },
        ],
      },
      {
        id: 's003', postingId: 'del-audit-ng-wpg-2025', userId: 'user_c1p4',
        currentStage: 'Final Interview', updatedAt: '2025-08-22', applicationDate: '2025-07-08',
        timeline: [
          { stage: 'Applied', date: '2025-07-08' },
          { stage: 'Assessment', date: '2025-07-22' },
          { stage: 'Interview Invitation', date: '2025-08-05' },
          { stage: 'First Interview', date: '2025-08-15' },
          { stage: 'Final Interview', date: '2025-08-22' },
        ],
      },
      {
        id: 's004', postingId: 'del-audit-ng-wpg-2025', userId: 'user_d8k7',
        currentStage: 'First Interview', updatedAt: '2025-08-14', applicationDate: '2025-07-10',
        timeline: [
          { stage: 'Applied', date: '2025-07-10' },
          { stage: 'Assessment', date: '2025-07-25' },
          { stage: 'Recruiter Contact', date: '2025-08-01' },
          { stage: 'Interview Invitation', date: '2025-08-06' },
          { stage: 'First Interview', date: '2025-08-14' },
        ],
      },
      {
        id: 's005', postingId: 'del-audit-ng-wpg-2025', userId: 'user_e5q2',
        currentStage: 'Assessment', updatedAt: '2025-07-18', applicationDate: '2025-07-12',
        timeline: [
          { stage: 'Applied', date: '2025-07-12' },
          { stage: 'Assessment', date: '2025-07-18' },
        ],
      },
    ],
  },
  {
    id: 'del-tax-ng-tor-2025',
    company: 'Deloitte',
    title: 'Tax – New Graduate',
    city: 'Toronto',
    province: 'ON',
    jobType: 'New Graduate',
    postingUrl: 'https://careers.deloitte.com',
    description: 'Launch your career in Deloitte\'s Tax practice. Work on complex tax engagements for multinational corporations and high-net-worth individuals.',
    deadline: '2025-09-01',
    postedDate: '2025-06-28',
    status: 'approved',
    stats: {
      totalApplicants: 47,
      byStage: {
        'Applied': 12,
        'Assessment': 14,
        'Recruiter Contact': 8,
        'Interview Invitation': 7,
        'First Interview': 4,
        'Final Interview': 2,
        'Offer': 2,
        'Rejected': 6,
        'Withdrawn': 2,
      },
      firstAssessmentDate: '2025-07-10',
      firstInterviewDate: '2025-07-29',
      firstOfferDate: '2025-08-20',
      firstRejectionDate: '2025-08-15',
      lastUpdated: '2025-08-29',
    },
    submissions: [
      {
        id: 's010', postingId: 'del-tax-ng-tor-2025', userId: 'user_f2n8',
        currentStage: 'Offer', updatedAt: '2025-08-20', applicationDate: '2025-07-01',
        timeline: [
          { stage: 'Applied', date: '2025-07-01' },
          { stage: 'Assessment', date: '2025-07-11' },
          { stage: 'Recruiter Contact', date: '2025-07-20' },
          { stage: 'Interview Invitation', date: '2025-07-27' },
          { stage: 'First Interview', date: '2025-08-04' },
          { stage: 'Final Interview', date: '2025-08-14' },
          { stage: 'Offer', date: '2025-08-20' },
        ],
      },
      {
        id: 's011', postingId: 'del-tax-ng-tor-2025', userId: 'user_g9r3',
        currentStage: 'Offer', updatedAt: '2025-08-21', applicationDate: '2025-07-02',
        timeline: [
          { stage: 'Applied', date: '2025-07-02' },
          { stage: 'Assessment', date: '2025-07-12' },
          { stage: 'Interview Invitation', date: '2025-07-28' },
          { stage: 'First Interview', date: '2025-08-05' },
          { stage: 'Final Interview', date: '2025-08-15' },
          { stage: 'Offer', date: '2025-08-21' },
        ],
      },
      {
        id: 's012', postingId: 'del-tax-ng-tor-2025', userId: 'user_h4s6',
        currentStage: 'Rejected', updatedAt: '2025-08-15', applicationDate: '2025-07-03',
        timeline: [
          { stage: 'Applied', date: '2025-07-03' },
          { stage: 'Assessment', date: '2025-07-13' },
          { stage: 'Recruiter Contact', date: '2025-07-22' },
          { stage: 'Interview Invitation', date: '2025-07-29' },
          { stage: 'First Interview', date: '2025-08-06' },
          { stage: 'Rejected', date: '2025-08-15' },
        ],
      },
    ],
  },
  {
    id: 'del-intern-van-2025',
    company: 'Deloitte',
    title: 'Audit Intern – Winter 2026',
    city: 'Vancouver',
    province: 'BC',
    jobType: 'Internship / Co-op',
    postingUrl: 'https://careers.deloitte.com',
    description: 'Eight-month internship in our Vancouver Audit practice. Gain hands-on experience working with publicly traded clients.',
    deadline: '2025-10-01',
    postedDate: '2025-08-01',
    status: 'approved',
    stats: {
      totalApplicants: 19,
      byStage: {
        'Applied': 8,
        'Assessment': 6,
        'Recruiter Contact': 3,
        'Interview Invitation': 2,
      },
      firstAssessmentDate: '2025-08-15',
      firstInterviewDate: null,
      firstOfferDate: null,
      firstRejectionDate: null,
      lastUpdated: '2025-08-28',
    },
    submissions: [
      {
        id: 's020', postingId: 'del-intern-van-2025', userId: 'user_i7t1',
        currentStage: 'Interview Invitation', updatedAt: '2025-08-22', applicationDate: '2025-08-05',
        timeline: [
          { stage: 'Applied', date: '2025-08-05' },
          { stage: 'Assessment', date: '2025-08-16' },
          { stage: 'Recruiter Contact', date: '2025-08-20' },
          { stage: 'Interview Invitation', date: '2025-08-22' },
        ],
      },
      {
        id: 's021', postingId: 'del-intern-van-2025', userId: 'user_j3u5',
        currentStage: 'Assessment', updatedAt: '2025-08-17', applicationDate: '2025-08-07',
        timeline: [
          { stage: 'Applied', date: '2025-08-07' },
          { stage: 'Assessment', date: '2025-08-17' },
        ],
      },
      {
        id: 's022', postingId: 'del-intern-van-2025', userId: 'user_k6v8',
        currentStage: 'Applied', updatedAt: '2025-08-10', applicationDate: '2025-08-10',
        timeline: [
          { stage: 'Applied', date: '2025-08-10' },
        ],
      },
    ],
  },

  // ── EY ────────────────────────────────────────────────────────────────────
  {
    id: 'ey-assurance-ng-cal-2025',
    company: 'EY',
    title: 'Assurance – New Graduate',
    city: 'Calgary',
    province: 'AB',
    jobType: 'New Graduate',
    postingUrl: 'https://careers.ey.com',
    description: 'Begin your career with EY\'s Assurance practice in Calgary. Work alongside experienced professionals on engagements across the energy sector.',
    deadline: '2025-09-10',
    postedDate: '2025-07-05',
    status: 'approved',
    stats: {
      totalApplicants: 33,
      byStage: {
        'Applied': 7,
        'Assessment': 10,
        'Recruiter Contact': 6,
        'Interview Invitation': 5,
        'First Interview': 3,
        'Offer': 1,
        'Rejected': 1,
      },
      firstAssessmentDate: '2025-07-20',
      firstInterviewDate: '2025-08-08',
      firstOfferDate: '2025-08-25',
      firstRejectionDate: '2025-08-22',
      lastUpdated: '2025-08-26',
    },
    submissions: [
      {
        id: 's030', postingId: 'ey-assurance-ng-cal-2025', userId: 'user_l2w4',
        currentStage: 'Offer', updatedAt: '2025-08-25', applicationDate: '2025-07-08',
        timeline: [
          { stage: 'Applied', date: '2025-07-08' },
          { stage: 'Assessment', date: '2025-07-21' },
          { stage: 'Recruiter Contact', date: '2025-08-01' },
          { stage: 'Interview Invitation', date: '2025-08-06' },
          { stage: 'First Interview', date: '2025-08-15' },
          { stage: 'Offer', date: '2025-08-25' },
        ],
      },
      {
        id: 's031', postingId: 'ey-assurance-ng-cal-2025', userId: 'user_m8x9',
        currentStage: 'First Interview', updatedAt: '2025-08-16', applicationDate: '2025-07-09',
        timeline: [
          { stage: 'Applied', date: '2025-07-09' },
          { stage: 'Assessment', date: '2025-07-22' },
          { stage: 'Interview Invitation', date: '2025-08-07' },
          { stage: 'First Interview', date: '2025-08-16' },
        ],
      },
      {
        id: 's032', postingId: 'ey-assurance-ng-cal-2025', userId: 'user_n5y3',
        currentStage: 'Rejected', updatedAt: '2025-08-22', applicationDate: '2025-07-10',
        timeline: [
          { stage: 'Applied', date: '2025-07-10' },
          { stage: 'Assessment', date: '2025-07-23' },
          { stage: 'Recruiter Contact', date: '2025-08-02' },
          { stage: 'Interview Invitation', date: '2025-08-08' },
          { stage: 'First Interview', date: '2025-08-17' },
          { stage: 'Rejected', date: '2025-08-22' },
        ],
      },
    ],
  },
  {
    id: 'ey-tax-coop-tor-2025',
    company: 'EY',
    title: 'Tax – Co-op Winter 2026',
    city: 'Toronto',
    province: 'ON',
    jobType: 'Internship / Co-op',
    postingUrl: 'https://careers.ey.com',
    description: 'Join EY\'s tax team as a co-op student for a four-month term starting January 2026. Ideal for accounting students in their 3rd or 4th year.',
    deadline: '2025-10-15',
    postedDate: '2025-08-05',
    status: 'approved',
    stats: {
      totalApplicants: 52,
      byStage: {
        'Applied': 20,
        'Assessment': 15,
        'Recruiter Contact': 9,
        'Interview Invitation': 5,
        'First Interview': 2,
        'Rejected': 1,
      },
      firstAssessmentDate: '2025-08-18',
      firstInterviewDate: '2025-09-05',
      firstOfferDate: null,
      firstRejectionDate: '2025-09-10',
      lastUpdated: '2025-09-11',
    },
    submissions: [
      {
        id: 's040', postingId: 'ey-tax-coop-tor-2025', userId: 'user_o1z6',
        currentStage: 'First Interview', updatedAt: '2025-09-06', applicationDate: '2025-08-08',
        timeline: [
          { stage: 'Applied', date: '2025-08-08' },
          { stage: 'Assessment', date: '2025-08-19' },
          { stage: 'Recruiter Contact', date: '2025-08-28' },
          { stage: 'Interview Invitation', date: '2025-09-02' },
          { stage: 'First Interview', date: '2025-09-06' },
        ],
      },
      {
        id: 's041', postingId: 'ey-tax-coop-tor-2025', userId: 'user_p4a7',
        currentStage: 'Rejected', updatedAt: '2025-09-10', applicationDate: '2025-08-09',
        timeline: [
          { stage: 'Applied', date: '2025-08-09' },
          { stage: 'Assessment', date: '2025-08-20' },
          { stage: 'Recruiter Contact', date: '2025-08-29' },
          { stage: 'Interview Invitation', date: '2025-09-03' },
          { stage: 'First Interview', date: '2025-09-07' },
          { stage: 'Rejected', date: '2025-09-10' },
        ],
      },
      {
        id: 's042', postingId: 'ey-tax-coop-tor-2025', userId: 'user_q9b2',
        currentStage: 'Assessment', updatedAt: '2025-08-21', applicationDate: '2025-08-10',
        timeline: [
          { stage: 'Applied', date: '2025-08-10' },
          { stage: 'Assessment', date: '2025-08-21' },
        ],
      },
    ],
  },

  // ── KPMG ──────────────────────────────────────────────────────────────────
  {
    id: 'kpmg-advisory-ng-tor-2025',
    company: 'KPMG',
    title: 'Management Consulting – New Graduate',
    city: 'Toronto',
    province: 'ON',
    jobType: 'New Graduate',
    postingUrl: 'https://home.kpmg/ca',
    description: 'KPMG\'s Management Consulting practice is seeking new graduates to join our growing team. Work on transformational projects across banking, insurance, and public sector.',
    deadline: '2025-09-05',
    postedDate: '2025-07-08',
    status: 'approved',
    stats: {
      totalApplicants: 41,
      byStage: {
        'Applied': 9,
        'Assessment': 11,
        'Recruiter Contact': 7,
        'Interview Invitation': 6,
        'First Interview': 4,
        'Final Interview': 2,
        'Offer': 1,
        'Rejected': 3,
      },
      firstAssessmentDate: '2025-07-22',
      firstInterviewDate: '2025-08-10',
      firstOfferDate: '2025-08-30',
      firstRejectionDate: '2025-08-25',
      lastUpdated: '2025-08-31',
    },
    submissions: [
      {
        id: 's050', postingId: 'kpmg-advisory-ng-tor-2025', userId: 'user_r3c5',
        currentStage: 'Offer', updatedAt: '2025-08-30', applicationDate: '2025-07-10',
        timeline: [
          { stage: 'Applied', date: '2025-07-10' },
          { stage: 'Assessment', date: '2025-07-23' },
          { stage: 'Recruiter Contact', date: '2025-08-02' },
          { stage: 'Interview Invitation', date: '2025-08-08' },
          { stage: 'First Interview', date: '2025-08-16' },
          { stage: 'Final Interview', date: '2025-08-25' },
          { stage: 'Offer', date: '2025-08-30' },
        ],
      },
      {
        id: 's051', postingId: 'kpmg-advisory-ng-tor-2025', userId: 'user_s7d1',
        currentStage: 'Rejected', updatedAt: '2025-08-26', applicationDate: '2025-07-11',
        timeline: [
          { stage: 'Applied', date: '2025-07-11' },
          { stage: 'Assessment', date: '2025-07-24' },
          { stage: 'Interview Invitation', date: '2025-08-09' },
          { stage: 'First Interview', date: '2025-08-17' },
          { stage: 'Final Interview', date: '2025-08-24' },
          { stage: 'Rejected', date: '2025-08-26' },
        ],
      },
      {
        id: 's052', postingId: 'kpmg-advisory-ng-tor-2025', userId: 'user_t2e8',
        currentStage: 'Final Interview', updatedAt: '2025-08-25', applicationDate: '2025-07-12',
        timeline: [
          { stage: 'Applied', date: '2025-07-12' },
          { stage: 'Assessment', date: '2025-07-25' },
          { stage: 'Recruiter Contact', date: '2025-08-04' },
          { stage: 'Interview Invitation', date: '2025-08-10' },
          { stage: 'First Interview', date: '2025-08-18' },
          { stage: 'Final Interview', date: '2025-08-25' },
        ],
      },
      {
        id: 's053', postingId: 'kpmg-advisory-ng-tor-2025', userId: 'user_u6f4',
        currentStage: 'First Interview', updatedAt: '2025-08-16', applicationDate: '2025-07-13',
        timeline: [
          { stage: 'Applied', date: '2025-07-13' },
          { stage: 'Assessment', date: '2025-07-26' },
          { stage: 'Interview Invitation', date: '2025-08-11' },
          { stage: 'First Interview', date: '2025-08-16' },
        ],
      },
    ],
  },
  {
    id: 'kpmg-audit-ng-wpg-2025',
    company: 'KPMG',
    title: 'Audit – New Graduate',
    city: 'Winnipeg',
    province: 'MB',
    jobType: 'New Graduate',
    postingUrl: 'https://home.kpmg/ca',
    description: 'Join KPMG\'s Winnipeg Audit team as a new graduate. A great opportunity for CPA students looking to earn their designation in a supportive environment.',
    deadline: '2025-09-20',
    postedDate: '2025-07-15',
    status: 'approved',
    stats: {
      totalApplicants: 22,
      byStage: {
        'Applied': 6,
        'Assessment': 7,
        'Recruiter Contact': 4,
        'Interview Invitation': 3,
        'First Interview': 1,
        'Rejected': 1,
      },
      firstAssessmentDate: '2025-07-28',
      firstInterviewDate: '2025-08-18',
      firstOfferDate: null,
      firstRejectionDate: '2025-08-22',
      lastUpdated: '2025-08-23',
    },
    submissions: [
      {
        id: 's060', postingId: 'kpmg-audit-ng-wpg-2025', userId: 'user_v1g9',
        currentStage: 'First Interview', updatedAt: '2025-08-18', applicationDate: '2025-07-17',
        timeline: [
          { stage: 'Applied', date: '2025-07-17' },
          { stage: 'Assessment', date: '2025-07-29' },
          { stage: 'Recruiter Contact', date: '2025-08-08' },
          { stage: 'Interview Invitation', date: '2025-08-14' },
          { stage: 'First Interview', date: '2025-08-18' },
        ],
      },
      {
        id: 's061', postingId: 'kpmg-audit-ng-wpg-2025', userId: 'user_w5h2',
        currentStage: 'Rejected', updatedAt: '2025-08-22', applicationDate: '2025-07-18',
        timeline: [
          { stage: 'Applied', date: '2025-07-18' },
          { stage: 'Assessment', date: '2025-07-30' },
          { stage: 'Interview Invitation', date: '2025-08-15' },
          { stage: 'First Interview', date: '2025-08-19' },
          { stage: 'Rejected', date: '2025-08-22' },
        ],
      },
      {
        id: 's062', postingId: 'kpmg-audit-ng-wpg-2025', userId: 'user_x8i6',
        currentStage: 'Interview Invitation', updatedAt: '2025-08-15', applicationDate: '2025-07-20',
        timeline: [
          { stage: 'Applied', date: '2025-07-20' },
          { stage: 'Assessment', date: '2025-08-01' },
          { stage: 'Recruiter Contact', date: '2025-08-10' },
          { stage: 'Interview Invitation', date: '2025-08-15' },
        ],
      },
    ],
  },

  // ── PWC ───────────────────────────────────────────────────────────────────
  {
    id: 'pwc-deals-ng-tor-2025',
    company: 'PwC',
    title: 'Deals – New Graduate',
    city: 'Toronto',
    province: 'ON',
    jobType: 'New Graduate',
    postingUrl: 'https://jobs.pwc.com/ca',
    description: 'PwC Deals helps clients navigate complex transactions. As a new graduate, you\'ll work on M&A, divestitures, restructuring, and valuations across Canada.',
    deadline: '2025-08-28',
    postedDate: '2025-06-20',
    status: 'approved',
    stats: {
      totalApplicants: 61,
      byStage: {
        'Applied': 10,
        'Assessment': 16,
        'Recruiter Contact': 12,
        'Interview Invitation': 10,
        'First Interview': 6,
        'Final Interview': 3,
        'Offer': 2,
        'Rejected': 8,
        'Withdrawn': 2,
      },
      firstAssessmentDate: '2025-07-05',
      firstInterviewDate: '2025-07-24',
      firstOfferDate: '2025-08-12',
      firstRejectionDate: '2025-08-08',
      lastUpdated: '2025-08-25',
    },
    submissions: [
      {
        id: 's070', postingId: 'pwc-deals-ng-tor-2025', userId: 'user_y3j0',
        currentStage: 'Offer', updatedAt: '2025-08-12', applicationDate: '2025-06-25',
        timeline: [
          { stage: 'Applied', date: '2025-06-25' },
          { stage: 'Assessment', date: '2025-07-06' },
          { stage: 'Recruiter Contact', date: '2025-07-15' },
          { stage: 'Interview Invitation', date: '2025-07-22' },
          { stage: 'First Interview', date: '2025-07-30' },
          { stage: 'Final Interview', date: '2025-08-08' },
          { stage: 'Offer', date: '2025-08-12' },
        ],
      },
      {
        id: 's071', postingId: 'pwc-deals-ng-tor-2025', userId: 'user_z6k4',
        currentStage: 'Offer', updatedAt: '2025-08-14', applicationDate: '2025-06-26',
        timeline: [
          { stage: 'Applied', date: '2025-06-26' },
          { stage: 'Assessment', date: '2025-07-07' },
          { stage: 'Recruiter Contact', date: '2025-07-16' },
          { stage: 'Interview Invitation', date: '2025-07-23' },
          { stage: 'First Interview', date: '2025-07-31' },
          { stage: 'Final Interview', date: '2025-08-09' },
          { stage: 'Offer', date: '2025-08-14' },
        ],
      },
      {
        id: 's072', postingId: 'pwc-deals-ng-tor-2025', userId: 'user_aa2l7',
        currentStage: 'Rejected', updatedAt: '2025-08-10', applicationDate: '2025-06-27',
        timeline: [
          { stage: 'Applied', date: '2025-06-27' },
          { stage: 'Assessment', date: '2025-07-08' },
          { stage: 'Recruiter Contact', date: '2025-07-17' },
          { stage: 'Interview Invitation', date: '2025-07-24' },
          { stage: 'First Interview', date: '2025-08-01' },
          { stage: 'Rejected', date: '2025-08-10' },
        ],
      },
      {
        id: 's073', postingId: 'pwc-deals-ng-tor-2025', userId: 'user_bb8m1',
        currentStage: 'Rejected', updatedAt: '2025-08-09', applicationDate: '2025-06-28',
        timeline: [
          { stage: 'Applied', date: '2025-06-28' },
          { stage: 'Assessment', date: '2025-07-09' },
          { stage: 'Interview Invitation', date: '2025-07-25' },
          { stage: 'First Interview', date: '2025-08-02' },
          { stage: 'Rejected', date: '2025-08-09' },
        ],
      },
      {
        id: 's074', postingId: 'pwc-deals-ng-tor-2025', userId: 'user_cc3n5',
        currentStage: 'Final Interview', updatedAt: '2025-08-11', applicationDate: '2025-06-29',
        timeline: [
          { stage: 'Applied', date: '2025-06-29' },
          { stage: 'Assessment', date: '2025-07-10' },
          { stage: 'Recruiter Contact', date: '2025-07-18' },
          { stage: 'Interview Invitation', date: '2025-07-26' },
          { stage: 'First Interview', date: '2025-08-03' },
          { stage: 'Final Interview', date: '2025-08-11' },
        ],
      },
    ],
  },
  {
    id: 'pwc-audit-ng-van-2025',
    company: 'PwC',
    title: 'Assurance – New Graduate',
    city: 'Vancouver',
    province: 'BC',
    jobType: 'New Graduate',
    postingUrl: 'https://jobs.pwc.com/ca',
    description: 'PwC Vancouver\'s Assurance team is hiring new graduates for 2025. Support audit engagements for a diverse portfolio of clients including tech, mining, and real estate.',
    deadline: '2025-09-12',
    postedDate: '2025-07-02',
    status: 'approved',
    stats: {
      totalApplicants: 35,
      byStage: {
        'Applied': 8,
        'Assessment': 10,
        'Recruiter Contact': 6,
        'Interview Invitation': 5,
        'First Interview': 3,
        'Offer': 1,
        'Rejected': 2,
      },
      firstAssessmentDate: '2025-07-16',
      firstInterviewDate: '2025-08-04',
      firstOfferDate: '2025-08-22',
      firstRejectionDate: '2025-08-18',
      lastUpdated: '2025-08-23',
    },
    submissions: [
      {
        id: 's080', postingId: 'pwc-audit-ng-van-2025', userId: 'user_dd9o2',
        currentStage: 'Offer', updatedAt: '2025-08-22', applicationDate: '2025-07-05',
        timeline: [
          { stage: 'Applied', date: '2025-07-05' },
          { stage: 'Assessment', date: '2025-07-17' },
          { stage: 'Recruiter Contact', date: '2025-07-28' },
          { stage: 'Interview Invitation', date: '2025-08-02' },
          { stage: 'First Interview', date: '2025-08-10' },
          { stage: 'Offer', date: '2025-08-22' },
        ],
      },
      {
        id: 's081', postingId: 'pwc-audit-ng-van-2025', userId: 'user_ee4p6',
        currentStage: 'Rejected', updatedAt: '2025-08-19', applicationDate: '2025-07-06',
        timeline: [
          { stage: 'Applied', date: '2025-07-06' },
          { stage: 'Assessment', date: '2025-07-18' },
          { stage: 'Interview Invitation', date: '2025-08-03' },
          { stage: 'First Interview', date: '2025-08-11' },
          { stage: 'Rejected', date: '2025-08-19' },
        ],
      },
      {
        id: 's082', postingId: 'pwc-audit-ng-van-2025', userId: 'user_ff7q3',
        currentStage: 'First Interview', updatedAt: '2025-08-12', applicationDate: '2025-07-08',
        timeline: [
          { stage: 'Applied', date: '2025-07-08' },
          { stage: 'Assessment', date: '2025-07-20' },
          { stage: 'Recruiter Contact', date: '2025-07-30' },
          { stage: 'Interview Invitation', date: '2025-08-04' },
          { stage: 'First Interview', date: '2025-08-12' },
        ],
      },
    ],
  },
  {
    id: 'pwc-coop-audit-wpg-2026',
    company: 'PwC',
    title: 'Assurance Co-op – Summer 2026',
    city: 'Winnipeg',
    province: 'MB',
    jobType: 'Internship / Co-op',
    postingUrl: 'https://jobs.pwc.com/ca',
    description: 'PwC is seeking co-op students for a four-month placement in Winnipeg\'s Assurance practice starting May 2026. Open to second and third year accounting students.',
    deadline: '2025-11-01',
    postedDate: '2025-08-10',
    status: 'approved',
    stats: {
      totalApplicants: 14,
      byStage: {
        'Applied': 10,
        'Assessment': 4,
      },
      firstAssessmentDate: '2025-08-24',
      firstInterviewDate: null,
      firstOfferDate: null,
      firstRejectionDate: null,
      lastUpdated: '2025-08-25',
    },
    submissions: [
      {
        id: 's090', postingId: 'pwc-coop-audit-wpg-2026', userId: 'user_gg1r9',
        currentStage: 'Assessment', updatedAt: '2025-08-24', applicationDate: '2025-08-12',
        timeline: [
          { stage: 'Applied', date: '2025-08-12' },
          { stage: 'Assessment', date: '2025-08-24' },
        ],
      },
      {
        id: 's091', postingId: 'pwc-coop-audit-wpg-2026', userId: 'user_hh5s4',
        currentStage: 'Applied', updatedAt: '2025-08-14', applicationDate: '2025-08-14',
        timeline: [
          { stage: 'Applied', date: '2025-08-14' },
        ],
      },
      {
        id: 's092', postingId: 'pwc-coop-audit-wpg-2026', userId: 'user_ii8t7',
        currentStage: 'Assessment', updatedAt: '2025-08-25', applicationDate: '2025-08-13',
        timeline: [
          { stage: 'Applied', date: '2025-08-13' },
          { stage: 'Assessment', date: '2025-08-25' },
        ],
      },
    ],
  },
  // Pending posting (for admin demo)
  {
    id: 'ey-coop-audit-ott-2025',
    company: 'EY',
    title: 'Audit Co-op – Winter 2026',
    city: 'Ottawa',
    province: 'ON',
    jobType: 'Internship / Co-op',
    postingUrl: 'https://careers.ey.com',
    description: 'EY Ottawa is looking for co-op students to join its Audit practice for a four-month term beginning January 2026.',
    deadline: '2025-10-20',
    postedDate: '2025-08-15',
    status: 'pending',
    stats: {
      totalApplicants: 0,
      byStage: {},
      firstAssessmentDate: null,
      firstInterviewDate: null,
      firstOfferDate: null,
      firstRejectionDate: null,
      lastUpdated: '2025-08-15',
    },
    submissions: [],
  },
];

// ─── RECENT ACTIVITY FEED ──────────────────────────────────────────────────

export const RECENT_ACTIVITY: RecentActivity[] = [
  { postingId: 'pwc-deals-ng-tor-2025', company: 'PwC', title: 'Deals – New Graduate', city: 'Toronto', stage: 'Offer', timeAgo: '2h ago' },
  { postingId: 'del-audit-ng-wpg-2025', company: 'Deloitte', title: 'Audit & Assurance – New Graduate', city: 'Winnipeg', stage: 'Final Interview', timeAgo: '4h ago' },
  { postingId: 'ey-tax-coop-tor-2025', company: 'EY', title: 'Tax – Co-op Winter 2026', city: 'Toronto', stage: 'First Interview', timeAgo: '6h ago' },
  { postingId: 'kpmg-advisory-ng-tor-2025', company: 'KPMG', title: 'Management Consulting – New Graduate', city: 'Toronto', stage: 'Rejected', timeAgo: '8h ago' },
  { postingId: 'del-intern-van-2025', company: 'Deloitte', title: 'Audit Intern – Winter 2026', city: 'Vancouver', stage: 'Assessment', timeAgo: '10h ago' },
  { postingId: 'pwc-audit-ng-van-2025', company: 'PwC', title: 'Assurance – New Graduate', city: 'Vancouver', stage: 'Offer', timeAgo: '12h ago' },
  { postingId: 'ey-assurance-ng-cal-2025', company: 'EY', title: 'Assurance – New Graduate', city: 'Calgary', stage: 'First Interview', timeAgo: '14h ago' },
  { postingId: 'kpmg-audit-ng-wpg-2025', company: 'KPMG', title: 'Audit – New Graduate', city: 'Winnipeg', stage: 'Interview Invitation', timeAgo: '1d ago' },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────

export function getPostingById(id: string): JobPosting | undefined {
  return MOCK_POSTINGS.find(p => p.id === id);
}

export function getApprovedPostings(): JobPosting[] {
  return MOCK_POSTINGS.filter(p => p.status === 'approved');
}

export function getPendingPostings(): JobPosting[] {
  return MOCK_POSTINGS.filter(p => p.status === 'pending');
}

export function searchPostings(query: string, company?: string, jobType?: string, city?: string): JobPosting[] {
  return MOCK_POSTINGS.filter(p => {
    if (p.status !== 'approved') return false;
    const q = query.toLowerCase();
    const matchesQuery = !q ||
      p.company.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.jobType.toLowerCase().includes(q);
    const matchesCompany = !company || p.company === company;
    const matchesJobType = !jobType || p.jobType === jobType;
    const matchesCity = !city || p.city.toLowerCase().includes(city.toLowerCase());
    return matchesQuery && matchesCompany && matchesJobType && matchesCity;
  });
}

export function getCompanyStats() {
  const approved = getApprovedPostings();
  return ['Deloitte', 'EY', 'KPMG', 'PwC'].map(company => {
    const postings = approved.filter(p => p.company === company);
    const totalApplicants = postings.reduce((sum, p) => sum + p.stats.totalApplicants, 0);
    const totalOffers = postings.reduce((sum, p) => sum + (p.stats.byStage['Offer'] || 0), 0);
    const activePostings = postings.filter(p => !p.stats.firstOfferDate || p.stats.byStage['Applied']! > 0).length;
    return { company, postings: postings.length, totalApplicants, totalOffers, activePostings };
  });
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function daysBetween(start: string, end: string): number {
  const a = new Date(start);
  const b = new Date(end);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}
