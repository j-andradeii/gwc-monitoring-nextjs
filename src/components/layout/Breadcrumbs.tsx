/**
 * Breadcrumbs Component
 *
 * Modern, elegant breadcrumb navigation with unified design
 * Features gold accent colors matching landing page theme
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useBreadcrumbsStore, type BreadcrumbItem } from '@/stores/breadcrumbs.store';

export interface BreadcrumbsProps {
  /** Override items from store */
  items?: BreadcrumbItem[];
  /** Additional CSS classes */
  className?: string;
  /** Separator character/icon */
  separator?: string;
  /** Max items to show before collapsing */
  maxItems?: number;
}

export function Breadcrumbs({
  items: propItems,
  className = '',
  separator = 'pi pi-chevron-right',
  maxItems = 5,
}: BreadcrumbsProps) {
  const { items: storeItems } = useBreadcrumbsStore();
  const items = propItems || storeItems;

  if (!items || items.length === 0) {
    return null;
  }

  // Handle collapsing if too many items
  let displayItems = items;
  let showEllipsis = false;

  if (items.length > maxItems) {
    displayItems = [
      items[0],
      ...items.slice(items.length - (maxItems - 1)),
    ];
    showEllipsis = true;
  }

  return (
    <nav className={`breadcrumbs-nav ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;
          const showEllipsisHere = showEllipsis && isFirst;

          return (
            <React.Fragment key={item.url || item.label}>
              <li className={`breadcrumb-item ${isLast ? 'current' : ''}`}>
                {item.url && !isLast ? (
                  <Link href={item.url} className="breadcrumb-link">
                    {isFirst && <i className="pi pi-home home-icon" />}
                    {item.icon && !isFirst && <i className={`${item.icon} item-icon`} />}
                    <span className="breadcrumb-text">{item.label}</span>
                  </Link>
                ) : (
                  <span className="breadcrumb-current">
                    {item.icon && <i className={`${item.icon} item-icon`} />}
                    <span className="breadcrumb-text">{item.label}</span>
                  </span>
                )}
              </li>

              {/* Separator */}
              {!isLast && (
                <li className="breadcrumb-separator" aria-hidden="true">
                  <i className={separator} />
                </li>
              )}

              {/* Ellipsis */}
              {showEllipsisHere && (
                <>
                  <li className="breadcrumb-ellipsis">
                    <span>...</span>
                  </li>
                  <li className="breadcrumb-separator" aria-hidden="true">
                    <i className={separator} />
                  </li>
                </>
              )}
            </React.Fragment>
          );
        })}
      </ol>

      <style jsx>{`
        .breadcrumbs-nav {
          display: flex;
          align-items: center;
        }

        .breadcrumbs-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
        }

        .breadcrumb-item :global(.breadcrumb-link) {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .breadcrumb-item :global(.breadcrumb-link:hover) {
          background: rgba(192, 160, 103, 0.1);
          color: var(--primary-gold-accent, #c0a067);
        }

        .breadcrumb-item :global(.home-icon) {
          font-size: 14px;
        }

        .breadcrumb-item :global(.item-icon) {
          font-size: 12px;
        }

        .breadcrumb-current {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .breadcrumb-separator {
          display: flex;
          align-items: center;
          padding: 0 4px;
          color: #d1d5db;
        }

        .breadcrumb-separator i {
          font-size: 10px;
        }

        .breadcrumb-ellipsis {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          font-size: 13px;
          color: #9ca3af;
        }

        .breadcrumb-text {
          white-space: nowrap;
        }

        @media (max-width: 767px) {
          .breadcrumb-item :global(.breadcrumb-link),
          .breadcrumb-current {
            padding: 4px 8px;
            font-size: 12px;
          }

          .breadcrumb-item :global(.home-icon) {
            font-size: 12px;
          }

          .breadcrumb-separator i {
            font-size: 8px;
          }
        }
      `}</style>
    </nav>
  );
}

/**
 * Page Header with Breadcrumbs
 *
 * Modern page header component with breadcrumbs, title, subtitle and action area
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
    <div className={`page-header ${className}`}>
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumbs items={breadcrumbItems} className="header-breadcrumbs" />
      )}
      <div className="header-content">
        <div className="header-text">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="header-actions">{action}</div>}
      </div>

      <style jsx>{`
        .page-header {
          margin-bottom: 24px;
        }

        .page-header :global(.header-breadcrumbs) {
          margin-bottom: 16px;
        }

        .header-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .header-text {
          flex: 1;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px;
          line-height: 1.3;
        }

        .page-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .header-actions {
          flex-shrink: 0;
        }

        @media (max-width: 767px) {
          .header-content {
            flex-direction: column;
            gap: 12px;
          }

          .page-title {
            font-size: 24px;
          }

          .header-actions {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Quick Stats Component
 *
 * Display key metrics in a horizontal card layout
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
    <div className={`quick-stats ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          {stat.icon && (
            <div className="stat-icon">
              <i className={stat.icon} />
            </div>
          )}
          <div className="stat-content">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
          {stat.change && (
            <div className={`stat-change ${stat.changeType || 'neutral'}`}>
              <i className={`pi ${stat.changeType === 'positive' ? 'pi-arrow-up' : stat.changeType === 'negative' ? 'pi-arrow-down' : 'pi-minus'}`} />
              <span>{stat.change}</span>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(0, 0, 0, 0.04);
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(192, 160, 103, 0.12) 0%, rgba(212, 188, 142, 0.08) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon i {
          font-size: 20px;
          color: var(--primary-gold-accent, #c0a067);
        }

        .stat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
          margin-top: 2px;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .stat-change.positive {
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
        }

        .stat-change.negative {
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
        }

        .stat-change.neutral {
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
        }

        .stat-change i {
          font-size: 10px;
        }

        @media (max-width: 767px) {
          .quick-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default Breadcrumbs;
