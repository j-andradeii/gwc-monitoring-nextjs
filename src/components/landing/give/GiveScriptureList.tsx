'use client';

import React from 'react';
import { deriveBookBadge } from '@/lib/sermon-parser';

export interface GiveScriptureListItem {
  verse: string;
  text: string;
  kicker?: string;
}

interface GiveScriptureListProps {
  items: GiveScriptureListItem[];
  description?: string;
  className?: string;
  ariaLabel?: string;
  maxLines?: number;
}

export const GiveScriptureList: React.FC<GiveScriptureListProps> = ({
  items,
  description,
  className = '',
  ariaLabel = 'Giving scriptures',
  maxLines,
}) => {
  if (items.length === 0) return null;

  return (
    <div
      className={`give-scripture-list-wrap${maxLines ? ' give-scripture-list-wrap--clamped' : ''}${className ? ` ${className}` : ''}`}
      style={maxLines ? ({ '--give-scripture-max-lines': maxLines } as React.CSSProperties) : undefined}
    >
      {description && (
        <div className="give-scripture-list-intro">
          <p>{description}</p>
        </div>
      )}

      <div className="give-scripture-list" role="list" aria-label={ariaLabel}>
        {items.map((item, index) => {
          const bibleUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(item.verse)}&version=NKJV`;

          return (
            <a
              key={`${item.verse}-${index}`}
              className="give-scripture-item"
              href={bibleUrl}
              target="_blank"
              rel="noopener noreferrer"
              role="listitem"
              aria-label={`Open ${item.verse} on Bible Gateway`}
            >
              <div className="give-scripture-badge" aria-hidden="true">
                {deriveBookBadge(item.verse)}
              </div>
              <div className="give-scripture-item__body">
                {item.kicker && <span className="give-scripture-kicker">{item.kicker}</span>}
                <h3>{item.verse}</h3>
                <blockquote className="give-scripture-quote">
                  <p>{item.text}</p>
                </blockquote>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GiveScriptureList;
