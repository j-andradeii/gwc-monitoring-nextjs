/**
 * Campus Admin Dashboard
 *
 * Landing page of the admin: a navy welcome banner (campus, greeting, date,
 * primary action), campus stats, quick actions and the signed-in account.
 * Only real data is shown — stats read "—" until the members API is connected,
 * and quick actions to unbuilt pages are marked "Soon" instead of linking.
 * Styles: src/styles/admin-dashboard.css.
 */

'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/core/constants';
import { formatEnumLabel } from '@/core/utils';
import { ADMIN_QUICK_ACTIONS } from '@/components/layout/admin-navigation';
import '@/styles/admin-dashboard.css';

interface StatCard {
  label: string;
  icon: string;
  /** theme ink for the card — gold, navy, purple or burgundy only */
  tone: 'gold' | 'navy' | 'purple' | 'burgundy';
}

const stats: StatCard[] = [
  { label: 'Total members', icon: 'pi pi-users', tone: 'gold' },
  { label: 'Men network', icon: 'pi pi-user', tone: 'navy' },
  { label: 'Women network', icon: 'pi pi-user', tone: 'purple' },
  { label: 'Pastoral staff', icon: 'pi pi-id-card', tone: 'burgundy' },
];

// Asia/Manila on both server and client, so the pre-rendered date matches.
const todayLabel = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Manila',
  });

export default function ChurchCampusAdmin() {
  const { user } = useAuth();
  const member = user?.member;
  const staff = user?.church_campus_staff;
  const campus = staff?.church_campus;

  const firstName = member?.first_name || 'there';
  const fullName = `${member?.first_name ?? ''} ${member?.last_name ?? ''}`.trim() || 'Signed-in user';
  const initials =
    `${member?.first_name?.charAt(0) ?? ''}${member?.last_name?.charAt(0) ?? ''}`.toUpperCase() || 'U';
  const role = formatEnumLabel(staff?.role);
  const campusName = campus?.name || campus?.church?.name || 'Gateway Church';

  const details = [
    { term: 'Role', value: role },
    { term: 'Campus', value: campus?.name },
    { term: 'Campus type', value: formatEnumLabel(campus?.type) },
    { term: 'Church', value: campus?.church?.name },
  ].filter((row) => row.value);

  return (
    <div className="admin-dashboard">
      {/* Welcome banner */}
      <section className="admin-dash-hero" aria-labelledby="admin-dash-hero-title">
        <div className="admin-dash-hero-text">
          <p className="admin-dash-hero-kicker">{campusName}</p>
          <h1 id="admin-dash-hero-title" className="admin-dash-hero-title">
            Welcome back, {firstName}
          </h1>
          <p className="admin-dash-hero-subtitle">
            <i className="pi pi-calendar" aria-hidden="true" />
            <span>{todayLabel()}</span>
          </p>
        </div>
        <div className="admin-dash-hero-actions">
          <Link href={ROUTES.CHURCH_MEMBERS} className="admin-dash-btn-primary">
            <i className="pi pi-users" aria-hidden="true" />
            <span>View members</span>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Campus statistics">
        <div className="admin-dash-stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className={`admin-dash-stat-card is-${stat.tone}`}>
              <div className="admin-dash-stat-head">
                <span className="admin-dash-stat-icon" aria-hidden="true">
                  <i className={stat.icon} />
                </span>
                <span className="admin-dash-stat-label">{stat.label}</span>
              </div>
              <span className="admin-dash-stat-value" aria-label={`${stat.label}: not available yet`}>
                —
              </span>
              <span className="admin-dash-stat-caption">Not connected yet</span>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-dash-grid">
        {/* Quick actions */}
        <section className="admin-dash-panel" aria-labelledby="admin-dash-actions-title">
          <div className="admin-dash-panel-header">
            <h2 id="admin-dash-actions-title" className="admin-dash-panel-title">Quick actions</h2>
            <span className="admin-dash-panel-hint">Jump to a section</span>
          </div>
          <ul className="admin-dash-action-list">
            {ADMIN_QUICK_ACTIONS.map((action) => {
              const content = (
                <>
                  <span className="admin-dash-action-icon" aria-hidden="true">
                    <i className={action.icon} />
                  </span>
                  <span className="admin-dash-action-text">
                    <span className="admin-dash-action-label">{action.label}</span>
                    <span className="admin-dash-action-description">{action.description}</span>
                  </span>
                  {action.available ? (
                    <i className="pi pi-arrow-right admin-dash-action-arrow" aria-hidden="true" />
                  ) : (
                    <span className="admin-dash-soon-pill">Soon</span>
                  )}
                </>
              );

              return (
                <li key={action.label}>
                  {action.available ? (
                    <Link href={action.href} className="admin-dash-action">
                      {content}
                    </Link>
                  ) : (
                    <div className="admin-dash-action is-soon" aria-disabled="true">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="admin-dash-side">
          {/* Account */}
          <section className="admin-dash-panel" aria-labelledby="admin-dash-account-title">
            <div className="admin-dash-panel-header">
              <h2 id="admin-dash-account-title" className="admin-dash-panel-title">Your account</h2>
            </div>
            <div className="admin-dash-account">
              <span className="admin-dash-account-avatar" aria-hidden="true">{initials}</span>
              <span>
                <span className="admin-dash-account-name">{fullName}</span>
                {role && <span className="admin-dash-account-role">{role}</span>}
              </span>
            </div>
            {details.length > 0 && (
              <dl className="admin-dash-details">
                {details.map((row) => (
                  <div key={row.term} className="admin-dash-details-row">
                    <dt>{row.term}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>

          {/* Activity */}
          <section className="admin-dash-panel" aria-labelledby="admin-dash-activity-title">
            <div className="admin-dash-panel-header">
              <h2 id="admin-dash-activity-title" className="admin-dash-panel-title">Recent activity</h2>
            </div>
            <div className="admin-dash-empty-state">
              <span className="admin-dash-empty-icon" aria-hidden="true">
                <i className="pi pi-inbox" />
              </span>
              <div>
                <p className="admin-dash-empty-title">Nothing yet</p>
                <p className="admin-dash-empty-text">
                  Updates from members and staff will show here.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
