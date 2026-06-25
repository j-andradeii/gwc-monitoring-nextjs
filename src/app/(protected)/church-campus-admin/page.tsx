'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/core/constants';
import '@/styles/admin-dashboard.css';

interface StatCard {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  accent: string;
}

interface QuickAction {
  label: string;
  description: string;
  icon: string;
  href: string;
}

const stats: StatCard[] = [
  { label: 'Total Members', value: '—', icon: 'pi pi-users', trend: 'All members', accent: '#c0a067' },
  { label: 'Men Network',   value: '—', icon: 'pi pi-user',  trend: 'Active',      accent: '#3b82f6' },
  { label: 'Women Network', value: '—', icon: 'pi pi-user',  trend: 'Active',      accent: '#ec4899' },
  { label: 'Pastoral Staffs', value: '—', icon: 'pi pi-id-card', trend: 'On staff', accent: '#10b981' },
];

const quickActions: QuickAction[] = [
  {
    label: 'Church Information',
    description: 'View and update campus details',
    icon: 'pi pi-building',
    href: ROUTES.CHURCH_INFO,
  },
  {
    label: 'Pastoral Staffs',
    description: 'Manage pastoral team roster',
    icon: 'pi pi-id-card',
    href: ROUTES.PASTORAL_STAFFS,
  },
  {
    label: 'Church Members',
    description: 'Browse and add members',
    icon: 'pi pi-users',
    href: ROUTES.CHURCH_MEMBERS,
  },
  {
    label: 'Campaigns',
    description: 'Track active campaigns',
    icon: 'pi pi-megaphone',
    href: ROUTES.CHURCH_CAMPAIGNS,
  },
];

export default function ChurchCampusAdmin() {
  const { user } = useAuth();
  const firstName = user?.member?.first_name || 'Admin';

  return (
    <div className="admin-dashboard">
      {/* Page header */}
      <header className="admin-dash-page-header">
        <div className="admin-dash-header-meta">
          <p className="admin-dash-eyebrow" aria-hidden="true">Church Campus</p>
          <h1 className="admin-dash-title">Welcome back, {firstName}</h1>
          <p className="admin-dash-subtitle">
            Here&apos;s an overview of your church campus today.
          </p>
        </div>
        <div className="admin-dash-header-actions">
          <button className="admin-dash-btn-secondary" type="button">
            <i className="pi pi-download" aria-hidden="true" />
            <span>Export</span>
          </button>
          <Link href={ROUTES.CREATE_MEMBER} className="admin-dash-btn-primary">
            <i className="pi pi-plus" aria-hidden="true" />
            <span>Add Member</span>
          </Link>
        </div>
      </header>

      {/* Stats grid */}
      <section aria-label="Campus statistics">
        <div className="admin-dash-stats-grid">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="admin-dash-stat-card"
              style={{ ['--accent' as string]: stat.accent }}
            >
              <div className="admin-dash-stat-icon" aria-hidden="true">
                <i className={stat.icon} style={{ fontSize: 18 }} />
              </div>
              <div className="admin-dash-stat-body">
                <span className="admin-dash-stat-label">{stat.label}</span>
                <span className="admin-dash-stat-value">{stat.value}</span>
                {stat.trend && (
                  <span className="admin-dash-stat-trend">{stat.trend}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="admin-dash-section" aria-label="Quick actions">
        <div className="admin-dash-section-header">
          <h2 className="admin-dash-section-title">Quick Actions</h2>
          <span className="admin-dash-section-hint">Jump into common admin tasks</span>
        </div>
        <div className="admin-dash-actions-grid">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="admin-dash-action-card"
            >
              <span className="admin-dash-action-icon" aria-hidden="true">
                <i className={action.icon} style={{ fontSize: 16 }} />
              </span>
              <span className="admin-dash-action-label">{action.label}</span>
              <span className="admin-dash-action-description">{action.description}</span>
              <span className="admin-dash-action-arrow" aria-hidden="true">
                <i className="pi pi-arrow-right" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="admin-dash-section" aria-label="Recent activity">
        <div className="admin-dash-section-header">
          <h2 className="admin-dash-section-title">Recent Activity</h2>
          <span className="admin-dash-section-hint">Latest updates across your campus</span>
        </div>
        <div className="admin-dash-empty-state">
          <div className="admin-dash-empty-icon-tile" aria-hidden="true">
            <i className="pi pi-inbox" />
          </div>
          <p className="admin-dash-empty-title">No recent activity</p>
          <p className="admin-dash-empty-text">
            Activity will appear here as members and staff make updates.
          </p>
        </div>
      </section>
    </div>
  );
}
