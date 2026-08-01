import Link from 'next/link';
import { RecentActivity, STAGE_COLORS, STAGE_ICONS, COMPANY_TEXT_COLORS } from '@/lib/types';

export default function ActivityFeed({ items }: { items: RecentActivity[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {items.map((item, i) => (
        <Link key={i} href={`/jobs/${item.postingId}`} style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.625rem',
            padding: '0.6rem 0.75rem', borderRadius: 8,
            border: '1px solid var(--border)', background: '#fff',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <span style={{ fontSize: '0.85rem', flexShrink: 0, marginTop: 1 }}>{STAGE_ICONS[item.stage]}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: COMPANY_TEXT_COLORS[item.company] }}>
                {item.company}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.title} · {item.city}
              </div>
              <div style={{ fontSize: '0.72rem', color: STAGE_COLORS[item.stage], fontWeight: 500, marginTop: 1 }}>
                {item.stage}
              </div>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>{item.timeAgo}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
