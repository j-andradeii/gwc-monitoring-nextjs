/**
 * Breadcrumbs Component
 *
 * Modern breadcrumb navigation
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBreadcrumbsStore, type BreadcrumbItem } from '@/stores/breadcrumbs.store';
import { useBreadcrumbs } from '@/hooks';

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  maxItems?: number;
}

export function Breadcrumbs({
  items: propItems,
  className = '',
  maxItems = 5,
}: BreadcrumbsProps) {

  const breadcrumbs = useBreadcrumbs();
  const { items: storeItems } = useBreadcrumbsStore();
  const items = propItems || storeItems;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);


  useEffect(()=>{ 
    console.log("bredcrumbs", items);
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  let displayItems = items;
  let showEllipsis = false;

  if (items.length > maxItems) {
    displayItems = [items[0], ...items.slice(items.length - (maxItems - 1))];
    showEllipsis = true;
  }

  return (
    <nav style={styles.nav} className={className} aria-label="Breadcrumb">
      <ol style={styles.list}>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;
          const showEllipsisHere = showEllipsis && isFirst;
          const isHovered = hoveredIndex === index;

          return (
            <React.Fragment key={item.url || item.label}>
              <li style={styles.item}>
                {item.url && !isLast ? (
                  <Link
                    href={item.url}
                    style={{
                      ...styles.link,
                      ...(isHovered && styles.linkHover),
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {isFirst && <i className="pi pi-home" style={styles.homeIcon} />}
                    {item.icon && !isFirst && <i className={item.icon} style={styles.itemIcon} />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span style={styles.current}>
                    {item.icon && <i className={item.icon} style={styles.itemIcon} />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>

              {!isLast && (
                <li style={styles.separator} aria-hidden="true">
                  <i className="pi pi-chevron-right" style={styles.separatorIcon} />
                </li>
              )}

              {showEllipsisHere && (
                <>
                  <li style={styles.ellipsis}>
                    <span>...</span>
                  </li>
                  <li style={styles.separator} aria-hidden="true">
                    <i className="pi pi-chevron-right" style={styles.separatorIcon} />
                  </li>
                </>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: 'flex',
    alignItems: 'center',
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 0,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 500,
    color: '#4b5563',
    transition: 'all 0.2s ease',
  },
  linkHover: {
    background: 'rgba(192, 160, 103, 0.1)',
    color: '#c0a067',
  },
  homeIcon: {
    fontSize: '14px',
    color: '#6b7280',
  },
  itemIcon: {
    fontSize: '12px',
    color: '#6b7280',
  },
  current: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#111827',
  },
  separator: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 4px',
  },
  separatorIcon: {
    fontSize: '10px',
    color: '#9ca3af',
  },
  ellipsis: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 8px',
    fontSize: '13px',
    color: '#6b7280',
  },
};

/**
 * Page Header with Breadcrumbs
 */
export function PageHeader({
  title,
  subtitle,
  action,
  breadcrumbItems,
  className = '',
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  breadcrumbItems?: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <div style={pageHeaderStyles.container} className={className}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <div style={pageHeaderStyles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      )}
      <div style={pageHeaderStyles.content}>
        <div style={pageHeaderStyles.text}>
          <h1 style={pageHeaderStyles.title}>{title}</h1>
          {subtitle && <p style={pageHeaderStyles.subtitle}>{subtitle}</p>}
        </div>
        {action && <div style={pageHeaderStyles.actions}>{action}</div>}
      </div>
    </div>
  );
}

const pageHeaderStyles: Record<string, React.CSSProperties> = {
  container: {
    marginBottom: '24px',
  },
  breadcrumbs: {
    marginBottom: '16px',
  },
  content: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 4px',
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
    lineHeight: 1.5,
  },
  actions: {
    flexShrink: 0,
  },
};

/**
 * Quick Stats Component
 */
export function QuickStats({
  stats,
  className = '',
}: {
  stats: Array<{
    label: string;
    value: string | number;
    icon?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }>;
  className?: string;
}) {
  return (
    <div style={statsStyles.container} className={className}>
      {stats.map((stat, index) => (
        <div key={index} style={statsStyles.card}>
          {stat.icon && (
            <div style={statsStyles.icon}>
              <i className={stat.icon} style={{ fontSize: '20px', color: '#c0a067' }} />
            </div>
          )}
          <div style={statsStyles.content}>
            <span style={statsStyles.value}>{stat.value}</span>
            <span style={statsStyles.label}>{stat.label}</span>
          </div>
          {stat.change && (
            <div
              style={{
                ...statsStyles.change,
                ...(stat.changeType === 'positive' && statsStyles.changePositive),
                ...(stat.changeType === 'negative' && statsStyles.changeNegative),
              }}
            >
              <i
                className={`pi ${
                  stat.changeType === 'positive'
                    ? 'pi-arrow-up'
                    : stat.changeType === 'negative'
                      ? 'pi-arrow-down'
                      : 'pi-minus'
                }`}
                style={{ fontSize: '10px' }}
              />
              <span>{stat.change}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const statsStyles: Record<string, React.CSSProperties> = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e9ecef',
  },
  icon: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'rgba(192, 160, 103, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  value: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1.2,
  },
  label: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '2px',
  },
  change: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    background: 'rgba(107, 114, 128, 0.1)',
    color: '#6b7280',
  },
  changePositive: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#16a34a',
  },
  changeNegative: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
  },
};

export default Breadcrumbs;
