/**
 * CardDivTitle Component
 *
 * Card with title header
 */

'use client';

import React from 'react';
import { CardDiv, type CardDivProps } from './CardDiv';

export interface CardDivTitleProps extends Omit<CardDivProps, 'children'> {
  /** Card title */
  title: string;
  /** Card subtitle */
  subtitle?: string;
  /** Title icon */
  icon?: string;
  /** Header action button/element */
  action?: React.ReactNode;
  /** Card content */
  children: React.ReactNode;
  /** Collapsible */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
}

export function CardDivTitle({
  title,
  subtitle,
  icon,
  action,
  children,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
  ...cardProps
}: CardDivTitleProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <CardDiv className={className} {...cardProps} padding="none">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 border-b border-gray-100 ${
          collapsible ? 'cursor-pointer' : ''
        }`}
        onClick={toggleCollapse}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
      >
        <div className="flex items-center gap-3">
          {icon && <i className={`${icon} text-primary text-xl`} />}
          <div>
            <h3 className="font-semibold text-black">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          {collapsible && (
            <i
              className={`pi ${
                isCollapsed ? 'pi-chevron-down' : 'pi-chevron-up'
              } text-gray-400 transition-transform`}
            />
          )}
        </div>
      </div>

      {/* Content */}
      {(!collapsible || !isCollapsed) && (
        <div className="p-4">{children}</div>
      )}
    </CardDiv>
  );
}

export default CardDivTitle;
