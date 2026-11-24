/**
 * Breadcrumbs Component
 *
 * Admin breadcrumb trail, rendered at the top of the page area. Hidden when the
 * trail is a single crumb (the dashboard), so it never takes space to say "Home".
 * Styles: `.admin-breadcrumbs-*` in src/styles/admin-layout.css.
 */

'use client';

import React from 'react';
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
  // Builds the trail from the current path into the breadcrumbs store.
  useBreadcrumbs();
  const { items: storeItems } = useBreadcrumbsStore();
  const items = propItems || storeItems;

  if (!items || items.length <= 1) {
    return null;
  }

  // Long trails keep the first crumb and the last (maxItems - 1).
  const collapsed = items.length > maxItems;
  const displayItems = collapsed
    ? [items[0], ...items.slice(items.length - (maxItems - 1))]
    : items;

  return (
    <nav className={`admin-breadcrumbs ${className}`.trim()} aria-label="Breadcrumb">
      <ol className="admin-breadcrumbs-list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;

          return (
            <React.Fragment key={item.url || item.label}>
              <li className="admin-breadcrumbs-item">
                {item.url && !isLast ? (
                  <Link href={item.url} className="admin-breadcrumbs-link">
                    {isFirst && <i className="pi pi-home" aria-hidden="true" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="admin-breadcrumbs-current" aria-current="page">
                    {item.label}
                  </span>
                )}
              </li>

              {collapsed && isFirst && (
                <li className="admin-breadcrumbs-item" aria-hidden="true">
                  <i className="pi pi-chevron-right admin-breadcrumbs-separator" />
                  <span className="admin-breadcrumbs-ellipsis">…</span>
                </li>
              )}

              {!isLast && (
                <li className="admin-breadcrumbs-item" aria-hidden="true">
                  <i className="pi pi-chevron-right admin-breadcrumbs-separator" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

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
    color: '#000',
    margin: '0 0 4px',
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: '15px',
    color: '#000',
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
    color: '#000',
    lineHeight: 1.2,
  },
  label: {
    fontSize: '13px',
    color: '#000',
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
    color: '#000',
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
