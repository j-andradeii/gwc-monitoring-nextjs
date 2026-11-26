/**
 * Platform Admin — Tenant directory
 *
 * Every tenant church organisation with its church and campus counts, searchable by name or slug. Read-only:
 * each row opens the tenant's churches and campuses.
 */

'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminPageHeader } from '@/components/admin';
import {
  PlatformStatePanel,
  TenantStatusBadge,
  countCampuses,
  plural,
} from '@/components/platform-admin';
import { platformAdminTenantRoute } from '@/core/constants';
import { usePlatformTenants } from '@/hooks/queries/usePlatformTenants';

export default function PlatformTenantsPage() {
  const { data, isPending, isError, refetch, isFetching } = usePlatformTenants();
  const [search, setSearch] = useState('');

  const tenants = useMemo(() => data?.data?.tenants ?? [], [data]);
  const totals = useMemo(
    () => ({
      tenants: tenants.length,
      churches: tenants.reduce((sum, t) => sum + t.churches.length, 0),
      campuses: tenants.reduce((sum, t) => sum + countCampuses(t), 0),
    }),
    [tenants]
  );
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tenants;
    return tenants.filter(
      (t) =>
        t.name.toLowerCase().includes(term) ||
        t.slug.toLowerCase().includes(term) ||
        t.churches.some((c) => c.name.toLowerCase().includes(term))
    );
  }, [tenants, search]);

  return (
    <div className="admin-dashboard platform-page">
      <AdminPageHeader
        eyebrow="Platform"
        title="Tenants"
        subtitle="Every church organisation on the platform, with its churches and campuses. View only."
        actions={
          <button
            type="button"
            className="admin-dash-btn-secondary"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <i className={`pi pi-refresh${isFetching ? ' pi-spin' : ''}`} aria-hidden="true" />
            <span>Refresh</span>
          </button>
        }
      />

      {isPending ? (
        <PlatformStatePanel icon="pi-spinner" busy title="Loading tenants..." />
      ) : isError ? (
        <PlatformStatePanel
          icon="pi-exclamation-triangle"
          title="We couldn't load the tenants."
          text="Check your connection and try again."
          action={
            <button type="button" className="admin-dash-btn-primary" onClick={() => void refetch()}>
              Try again
            </button>
          }
        />
      ) : (
        <>
          <div className="admin-dash-stats-grid platform-stats">
            {[
              { label: 'Tenants', value: totals.tenants, icon: 'pi-building', tone: 'is-gold' },
              { label: 'Churches', value: totals.churches, icon: 'pi-home', tone: 'is-navy' },
              { label: 'Campuses', value: totals.campuses, icon: 'pi-map-marker', tone: 'is-purple' },
            ].map((stat) => (
              <div key={stat.label} className={`admin-dash-stat-card ${stat.tone}`}>
                <div className="admin-dash-stat-head">
                  <span className="admin-dash-stat-icon" aria-hidden="true">
                    <i className={`pi ${stat.icon}`} />
                  </span>
                  <span className="admin-dash-stat-label">{stat.label}</span>
                </div>
                <span className="admin-dash-stat-value">{stat.value}</span>
              </div>
            ))}
          </div>

          <section className="admin-dash-panel" aria-labelledby="platform-tenants-title">
            <div className="admin-dash-panel-header platform-panel-header">
              <h2 id="platform-tenants-title" className="admin-dash-panel-title">
                All tenants
              </h2>
              <label className="platform-search">
                <i className="pi pi-search" aria-hidden="true" />
                <span className="sr-only">Search tenants</span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by tenant, slug or church"
                />
              </label>
            </div>

            {tenants.length === 0 ? (
              <div className="admin-dash-empty-state">
                <span className="admin-dash-empty-icon" aria-hidden="true">
                  <i className="pi pi-building" />
                </span>
                <div>
                  <p className="admin-dash-empty-title">No tenants yet.</p>
                  <p className="admin-dash-empty-text">
                    Tenants appear here once they are provisioned.
                  </p>
                </div>
              </div>
            ) : visible.length === 0 ? (
              <div className="admin-dash-empty-state">
                <span className="admin-dash-empty-icon" aria-hidden="true">
                  <i className="pi pi-search" />
                </span>
                <div>
                  <p className="admin-dash-empty-title">No tenant matches “{search.trim()}”.</p>
                  <p className="admin-dash-empty-text">Try another name or slug.</p>
                </div>
              </div>
            ) : (
              <ul className="platform-tenant-list">
                {visible.map((tenant) => (
                  <li key={tenant.id}>
                    <Link href={platformAdminTenantRoute(tenant.id)} className="platform-tenant-row">
                      <span className="platform-tenant-icon" aria-hidden="true">
                        {tenant.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="platform-tenant-text">
                        <span className="platform-tenant-name">{tenant.name}</span>
                        <span className="platform-tenant-meta">
                          <code>{tenant.slug}</code>
                          <span aria-hidden="true">·</span>
                          {plural(tenant.churches.length, 'church', 'churches')}
                          <span aria-hidden="true">·</span>
                          {plural(countCampuses(tenant), 'campus', 'campuses')}
                        </span>
                      </span>
                      <TenantStatusBadge status={tenant.status} />
                      <i className="pi pi-angle-right platform-tenant-arrow" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
