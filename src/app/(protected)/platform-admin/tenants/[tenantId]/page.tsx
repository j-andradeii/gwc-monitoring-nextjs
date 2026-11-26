/**
 * Platform Admin — One tenant
 *
 * A tenant's churches, each with its campuses (type, reference id, tag line, description, established date,
 * addresses). Read-only. Uses the directory's cached list (one API route serves both pages).
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminPageHeader } from '@/components/admin';
import {
  PlatformStatePanel,
  TenantStatusBadge,
  countCampuses,
  formatAddress,
  formatDate,
  formatLabel,
  plural,
} from '@/components/platform-admin';
import { ROUTES } from '@/core/constants';
import { usePlatformTenants } from '@/hooks/queries/usePlatformTenants';

export default function PlatformTenantPage() {
  const params = useParams<{ tenantId: string }>();
  const tenantId = decodeURIComponent(params?.tenantId ?? '');
  const { data, isPending, isError, refetch } = usePlatformTenants();
  const tenant = data?.data?.tenants.find((t) => t.id === tenantId);

  const backLink = (
    <Link href={ROUTES.PLATFORM_ADMIN} className="platform-back-link">
      <i className="pi pi-arrow-left" aria-hidden="true" />
      <span>All tenants</span>
    </Link>
  );

  if (isPending) {
    return (
      <div className="admin-dashboard platform-page">
        {backLink}
        <PlatformStatePanel icon="pi-spinner" busy title="Loading tenant..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-dashboard platform-page">
        {backLink}
        <PlatformStatePanel
          icon="pi-exclamation-triangle"
          title="We couldn't load this tenant."
          text="Check your connection and try again."
          action={
            <button type="button" className="admin-dash-btn-primary" onClick={() => void refetch()}>
              Try again
            </button>
          }
        />
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="admin-dashboard platform-page">
        {backLink}
        <PlatformStatePanel
          icon="pi-question-circle"
          title="Tenant not found"
          text="It may have been removed, or the link is wrong."
        />
      </div>
    );
  }

  return (
    <div className="admin-dashboard platform-page">
      {backLink}
      <AdminPageHeader
        eyebrow="Tenant"
        title={tenant.name}
        subtitle={
          <span className="platform-tenant-summary">
            <TenantStatusBadge status={tenant.status} />
            <code>{tenant.slug}</code>
            <span>
              {plural(tenant.churches.length, 'church', 'churches')} ·{' '}
              {plural(countCampuses(tenant), 'campus', 'campuses')}
            </span>
            {formatDate(tenant.created_at) && <span>Since {formatDate(tenant.created_at)}</span>}
          </span>
        }
      />

      {tenant.churches.length === 0 ? (
        <PlatformStatePanel icon="pi-home" title="This tenant has no churches yet." />
      ) : (
        <div className="platform-church-list">
          {tenant.churches.map((church) => (
            <section
              key={church.id}
              className="admin-dash-panel platform-church"
              aria-labelledby={`church-${church.id}`}
            >
              <div className="admin-dash-panel-header">
                <h2 id={`church-${church.id}`} className="admin-dash-panel-title">
                  <i className="pi pi-home platform-church-glyph" aria-hidden="true" />
                  {church.name}
                </h2>
                <span className="admin-dash-panel-hint">
                  {plural(church.church_campuses.length, 'campus', 'campuses')}
                  {church.timezone ? ` · ${church.timezone}` : ''}
                </span>
              </div>

              {church.church_campuses.length === 0 ? (
                <div className="admin-dash-empty-state">
                  <span className="admin-dash-empty-icon" aria-hidden="true">
                    <i className="pi pi-map-marker" />
                  </span>
                  <p className="admin-dash-empty-title">No campuses yet.</p>
                </div>
              ) : (
                <ul className="platform-campus-grid">
                  {church.church_campuses.map((campus) => (
                    <li key={campus.id} className="platform-campus">
                      <div className="platform-campus-head">
                        <span className="platform-campus-type">
                          {formatLabel(campus.church_campus_type)}
                        </span>
                        <span className="platform-campus-ref">Ref {campus.reference_id}</span>
                      </div>
                      {campus.tag_line && <p className="platform-campus-tagline">{campus.tag_line}</p>}
                      {campus.description && (
                        <p className="platform-campus-description">{campus.description}</p>
                      )}
                      <dl className="platform-campus-details">
                        {formatDate(campus.established_date) && (
                          <div>
                            <dt>Established</dt>
                            <dd>{formatDate(campus.established_date)}</dd>
                          </div>
                        )}
                        {campus.addresses.map((address) => (
                          <div key={address.id}>
                            <dt>{address.location_name || 'Address'}</dt>
                            <dd>{formatAddress(address)}</dd>
                          </div>
                        ))}
                        {campus.addresses.length === 0 && (
                          <div>
                            <dt>Address</dt>
                            <dd className="platform-muted">None on file</dd>
                          </div>
                        )}
                      </dl>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
