/** A tenant's status as a small pill: Active, Suspended, Archived. */

import React from 'react';
import { formatLabel } from './format';

export function TenantStatusBadge({ status }: { status: string }) {
  const tone = status === 'ACTIVE' ? 'is-active' : status === 'SUSPENDED' ? 'is-suspended' : 'is-archived';
  return <span className={`platform-status ${tone}`}>{formatLabel(status)}</span>;
}

export default TenantStatusBadge;
