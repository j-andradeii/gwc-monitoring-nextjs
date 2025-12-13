/**
 * CardDiv Component
 *
 * Base card container component
 */

'use client';

import React from 'react';

export interface CardDivProps {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Card padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
  /** Card shadow */
  shadow?: boolean;
  /** Card border */
  border?: boolean;
  /** Hover effect */
  hover?: boolean;
  /** Click handler */
  onClick?: () => void;
}

const paddingMap = {
  none: '',
  small: 'p-3',
  medium: 'p-4',
  large: 'p-6',
};

export function CardDiv({
  children,
  className = '',
  padding = 'medium',
  shadow = true,
  border = false,
  hover = false,
  onClick,
}: CardDivProps) {
  const baseClasses = 'bg-white rounded-lg';
  const paddingClass = paddingMap[padding];
  const shadowClass = shadow ? 'shadow-md' : '';
  const borderClass = border ? 'border border-gray-200' : '';
  const hoverClass = hover ? 'transition-shadow hover:shadow-lg cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${paddingClass} ${shadowClass} ${borderClass} ${hoverClass} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

export default CardDiv;
