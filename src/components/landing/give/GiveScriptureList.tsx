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
}

export const GiveScriptureList: React.FC<GiveScriptureListProps> = ({
  items,
  description,
  className = '',
  ariaLabel = 'Giving scriptures',
}) => {
  if (items.length === 0) return null;

  return (
    <div className={`give-scripture-list-wrap${className ? ` ${className}` : ''}`}>
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
                {item.kicker && <strong>{item.kicker}</strong>}
                <h3>{item.verse}</h3>
                <p>{item.text}</p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GiveScriptureList;
