import Link from 'next/link';
import { RecentActivity, STAGE_COLORS, STAGE_ICONS } from '@/lib/types';
import CompanyLogo from './CompanyLogo';

export default function ActivityFeed({ items }: { items: RecentActivity[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, i) => (
        <Link key={i} href={`/jobs/${item.postingId}`} style={{ textDecoration: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.6rem 0.75rem',
              borderRadius: 8,
              background: '#fff',
              border: '1px solid var(--border)',
              transition: 'border-color 0.15s, box-shadow 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Company logo */}
            <CompanyLogo company={item.company} size={30} />

            {/* Details */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.78rem', fontWeight: 600,
                color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.company}
              </div>
              <div style={{
                fontSize: '0.72rem', color: 'var(--text-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {item.title}
              </div>
            </div>

            {/* Stage + time */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: STAGE_COLORS[item.stage] }}>
                {STAGE_ICONS[item.stage]} {item.stage}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1 }}>
                {item.timeAgo}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
