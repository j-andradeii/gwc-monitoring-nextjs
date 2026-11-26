/** Loading, error and empty states for the portal pages (one panel, three looks). */

'use client';

import React from 'react';

interface PlatformStatePanelProps {
  icon: string;
  title: string;
  text?: string;
  action?: React.ReactNode;
  busy?: boolean;
}

export function PlatformStatePanel({ icon, title, text, action, busy }: PlatformStatePanelProps) {
  return (
    <div className="admin-dash-panel platform-state" role={busy ? 'status' : undefined} aria-live="polite">
      <div className="admin-dash-empty-state">
        <span className="admin-dash-empty-icon" aria-hidden="true">
          <i className={`pi ${icon}${busy ? ' pi-spin' : ''}`} />
        </span>
        <div>
          <p className="admin-dash-empty-title">{title}</p>
          {text && <p className="admin-dash-empty-text">{text}</p>}
        </div>
        {action && <div className="platform-state-action">{action}</div>}
      </div>
    </div>
  );
}

export default PlatformStatePanel;
