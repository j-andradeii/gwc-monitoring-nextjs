/**
 * Breadcrumbs Component
 *
 * Navigation breadcrumb trail
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
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap gap-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;
          const showEllipsisHere = showEllipsis && isFirst;

          return (
            <React.Fragment key={item.url || item.label}>
              <li className="flex items-center">
                {item.url && !isLast ? (
                  <Link
                    href={item.url}
                    className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
                  >
                    {item.icon && <i className={`${item.icon} text-xs`} />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1 ${
                      isLast ? 'text-gray-800 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {item.icon && <i className={`${item.icon} text-xs`} />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>

              {/* Separator */}
              {!isLast && (
                <li className="text-gray-400 mx-1" aria-hidden="true">
                  <i className={separator} style={{ fontSize: '0.625rem' }} />
                </li>
              )}

              {/* Ellipsis */}
              {showEllipsisHere && (
                <>
                  <li className="text-gray-400 mx-1">...</li>
                  <li className="text-gray-400 mx-1" aria-hidden="true">
                    <i className={separator} style={{ fontSize: '0.625rem' }} />
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
    <div className={`mb-6 ${className}`}>
      <Breadcrumbs items={breadcrumbItems} className="mb-2" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export default Breadcrumbs;
