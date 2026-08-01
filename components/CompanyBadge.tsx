import { Company, COMPANY_COLORS, COMPANY_TEXT_COLORS } from '@/lib/types';

export default function CompanyBadge({ company, size = 'md' }: { company: Company; size?: 'sm' | 'md' | 'lg' }) {
  const color = COMPANY_TEXT_COLORS[company];
  const bg    = COMPANY_COLORS[company] + '18';
  const border= COMPANY_COLORS[company] + '40';
  const padding = size === 'sm' ? '0.15rem 0.5rem' : size === 'lg' ? '0.35rem 0.75rem' : '0.2rem 0.6rem';
  const fontSize= size === 'sm' ? '0.72rem' : size === 'lg' ? '0.9rem' : '0.78rem';

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding, borderRadius: 4, fontSize, fontWeight: 600,
      color, background: bg, border: `1px solid ${border}`,
      whiteSpace: 'nowrap',
    }}>
      {company}
    </span>
  );
}
