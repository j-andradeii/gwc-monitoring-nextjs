/** Display helpers for the platform admin directory. */

import type { PlatformChurchCampusDto, PlatformTenantDto } from '@/models/platform-admin.types';

export const countCampuses = (tenant: PlatformTenantDto): number =>
  tenant.churches.reduce((sum, church) => sum + church.church_campuses.length, 0);

export const plural = (count: number, one: string, many = `${one}s`) =>
  `${count} ${count === 1 ? one : many}`;

/** "MAIN" → "Main", "SATELLITE_CAMPUS" → "Satellite campus". */
export const formatLabel = (value?: string | null): string => {
  if (!value) return '';
  const text = value.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** A date (ISO or `YYYY-MM-DD`) as "Jan 5, 2026"; empty when missing or invalid. */
export const formatDate = (value?: string | null): string => {
  if (!value) return '';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const formatAddress = (address: PlatformChurchCampusDto['addresses'][number]): string =>
  [address.street, address.city, address.state, address.zip_code].filter(Boolean).join(', ');
