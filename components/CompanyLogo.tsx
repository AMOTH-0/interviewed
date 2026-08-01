'use client';

import { useState } from 'react';

// ── Company name → domain mapping ─────────────────────────────────────────────
// Add any company here to get its real logo from Clearbit.
// For unlisted companies, a coloured initial-letter avatar is used automatically.
const COMPANY_DOMAINS: Record<string, string> = {
  // Big Four
  'deloitte': 'deloitte.com',
  'ey': 'ey.com',
  'ernst & young': 'ey.com',
  'kpmg': 'kpmg.com',
  'pwc': 'pwc.com',
  'pricewaterhousecoopers': 'pwc.com',

  // Canadian Banks
  'td bank': 'td.com',
  'td': 'td.com',
  'toronto-dominion bank': 'td.com',
  'rbc': 'rbc.com',
  'royal bank of canada': 'rbc.com',
  'royal bank': 'rbc.com',
  'bmo': 'bmo.com',
  'bank of montreal': 'bmo.com',
  'scotiabank': 'scotiabank.com',
  'bank of nova scotia': 'scotiabank.com',
  'cibc': 'cibc.com',
  'canadian imperial bank of commerce': 'cibc.com',
  'national bank': 'nbc.ca',
  'national bank of canada': 'nbc.ca',

  // Consulting / Tech
  'mckinsey': 'mckinsey.com',
  'mckinsey & company': 'mckinsey.com',
  'bcg': 'bcg.com',
  'boston consulting group': 'bcg.com',
  'accenture': 'accenture.com',
  'oliver wyman': 'oliverwyman.com',
  'bain': 'bain.com',
  'bain & company': 'bain.com',
  'mbb': 'mckinsey.com',

  // Canadian Employers
  'cppib': 'cppinvestments.com',
  'cpp investments': 'cppinvestments.com',
  'omers': 'omers.com',
  'caisse': 'lacaisse.com',
  'teachers': 'otpp.com',
  'ontario teachers': 'otpp.com',
  'brookfield': 'brookfield.com',
  'manulife': 'manulife.com',
  'sunlife': 'sunlife.com',
  'sun life': 'sunlife.com',
  'great-west life': 'greatwestlife.com',
  'telus': 'telus.com',
  'bell': 'bell.ca',
  'rogers': 'rogers.com',
  'shopify': 'shopify.com',
  'cgi': 'cgi.com',
  'sap': 'sap.com',
  'ibm': 'ibm.com',
  'amazon': 'amazon.com',
  'google': 'google.com',
  'microsoft': 'microsoft.com',
  'meta': 'meta.com',
  'apple': 'apple.com',
};

function getDomain(company: string): string | null {
  return COMPANY_DOMAINS[company.toLowerCase().trim()] ?? null;
}

// ── Deterministic colour from company name ────────────────────────────────────
const AVATAR_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#dc2626',
  '#ea580c', '#ca8a04', '#16a34a', '#0891b2',
  '#4f46e5', '#be185d', '#b45309', '#15803d',
];

function nameToColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── CompanyLogo component ─────────────────────────────────────────────────────

interface CompanyLogoProps {
  company: string;
  size?: number; // px, default 32
  className?: string;
}

export default function CompanyLogo({ company, size = 32, className }: CompanyLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const domain = getDomain(company);
  const showLogo = domain && !imgFailed;
  const initial = (company.trim()[0] || '?').toUpperCase();
  const bgColor = nameToColor(company);
  const fontSize = Math.round(size * 0.42);

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: Math.round(size * 0.22),
    flexShrink: 0,
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0,0,0,0.07)',
    background: showLogo ? '#fff' : bgColor,
    fontSize,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.01em',
    userSelect: 'none',
  };

  return (
    <span style={containerStyle} className={className} title={company}>
      {showLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://logo.clearbit.com/${domain}?size=${size * 2}`}
          alt={company}
          width={size}
          height={size}
          style={{ objectFit: 'contain', display: 'block' }}
          onError={() => setImgFailed(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}
