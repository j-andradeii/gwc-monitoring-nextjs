/**
 * StatsWidget Component
 *
 * Dashboard statistics widget
 */

'use client';

import React from 'react';
import { CardDiv } from './CardDiv';

export type StatsTrend = 'up' | 'down' | 'neutral';

export interface StatsWidgetProps {
  /** Widget title */
  title: string;
  /** Main value */
  value: string | number;
  /** Value suffix (e.g., '%', 'k') */
  suffix?: string;
  /** Value prefix (e.g., '$') */
  prefix?: string;
  /** Icon class */
  icon: string;
  /** Icon background color class */
  iconBgColor?: string;
  /** Icon color class */
  iconColor?: string;
  /** Trend direction */
  trend?: StatsTrend;
  /** Trend value */
  trendValue?: string;
  /** Trend label */
  trendLabel?: string;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
}

export function StatsWidget({
  title,
  value,
  suffix,
  prefix,
  icon,
  iconBgColor = 'bg-primary/10',
  iconColor = 'text-primary',
  trend,
  trendValue,
  trendLabel,
  loading = false,
  className = '',
  onClick,
}: StatsWidgetProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return 'pi pi-arrow-up';
      case 'down':
        return 'pi pi-arrow-down';
      default:
        return 'pi pi-minus';
    }
  };

  if (loading) {
    return (
      <CardDiv className={className} hover={!!onClick} onClick={onClick}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-full" />
          </div>
        </div>
      </CardDiv>
    );
  }

  return (
    <CardDiv className={className} hover={!!onClick} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>

          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
              <i className={getTrendIcon()} style={{ fontSize: '0.75rem' }} />
              <span className="font-medium">{trendValue}</span>
              {trendLabel && (
                <span className="text-gray-500 ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center ${iconBgColor}`}
        >
          <i className={`${icon} ${iconColor}`} style={{ fontSize: '1.25rem' }} />
        </div>
      </div>
    </CardDiv>
  );
}

/**
 * Stats Grid Container
 */
export function StatsGrid({
  children,
  columns = 4,
  className = '',
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-4 ${gridCols[columns]} ${className}`}>
      {children}
    </div>
  );
}

export default StatsWidget;
