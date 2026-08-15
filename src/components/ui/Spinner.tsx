/**
 * Spinner Component
 *
 * Loading spinner with various styles
 */

'use client';

import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export interface SpinnerProps {
  /** Spinner size */
  size?: 'small' | 'medium' | 'large';
  /** Stroke width */
  strokeWidth?: string;
  /** Fill color */
  fill?: string;
  /** Animation duration */
  animationDuration?: string;
  /** Additional CSS classes */
  className?: string;
  /** Center in parent */
  center?: boolean;
  /** Overlay mode */
  overlay?: boolean;
  /** Show label */
  label?: string;
}

const sizeMap = {
  small: '30px',
  medium: '50px',
  large: '80px',
};

export function Spinner({
  size = 'medium',
  strokeWidth = '4',
  fill = 'var(--surface-ground)',
  animationDuration = '.5s',
  className = '',
  center = false,
  overlay = false,
  label,
}: SpinnerProps) {
  const spinnerSize = sizeMap[size];

  const spinner = (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <ProgressSpinner
        style={{ width: spinnerSize, height: spinnerSize }}
        strokeWidth={strokeWidth}
        fill={fill}
        animationDuration={animationDuration}
      />
      {label && <span className="text-sm text-black">{label}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  if (center) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[200px]">
        {spinner}
      </div>
    );
  }

  return spinner;
}

/**
 * Full page loading spinner
 */
export function PageSpinner({ label = 'Loading...' }: { label?: string }) {
  return <Spinner overlay label={label} size="large" />;
}

/**
 * Inline loading spinner
 */
export function InlineSpinner({ className = '' }: { className?: string }) {
  return (
    <i className={`pi pi-spinner pi-spin ${className}`} style={{ fontSize: '1rem' }} />
  );
}

/**
 * Button loading spinner
 */
export function ButtonSpinner() {
  return <i className="pi pi-spinner pi-spin mr-2" />;
}

export default Spinner;
