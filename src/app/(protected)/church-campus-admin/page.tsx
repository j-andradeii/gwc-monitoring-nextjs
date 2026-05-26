'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/core/constants';

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
  { label: 'Men Network', value: '—', icon: 'pi pi-user', trend: 'Active', accent: '#3b82f6' },
  { label: 'Women Network', value: '—', icon: 'pi pi-user', trend: 'Active', accent: '#ec4899' },
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
    <div style={styles.container}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>Welcome back, {firstName}</h1>
          <p style={styles.subtitle}>
            Here&apos;s an overview of your church campus today.
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.secondaryBtn} type="button">
            <i className="pi pi-download" style={{ fontSize: 13 }} />
            <span>Export</span>
          </button>
          <Link href={ROUTES.CREATE_MEMBER} style={styles.primaryBtn}>
            <i className="pi pi-plus" style={{ fontSize: 13 }} />
            <span>Add Member</span>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <section style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: `${stat.accent}1A`, color: stat.accent }}>
              <i className={stat.icon} style={{ fontSize: 18 }} />
            </div>
            <div style={styles.statBody}>
              <span style={styles.statLabel}>{stat.label}</span>
              <span style={styles.statValue}>{stat.value}</span>
              {stat.trend && <span style={styles.statTrend}>{stat.trend}</span>}
            </div>
          </div>
        ))}
      </section>

      {/* Quick actions */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <span style={styles.sectionHint}>Jump into common admin tasks</span>
        </div>
        <div style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} style={styles.actionCard}>
              <span style={styles.actionIcon}>
                <i className={action.icon} style={{ fontSize: 16 }} />
              </span>
              <span style={styles.actionLabel}>{action.label}</span>
              <span style={styles.actionDescription}>{action.description}</span>
              <span style={styles.actionArrow}>
                <i className="pi pi-arrow-right" style={{ fontSize: 12 }} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity placeholder */}
      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Activity</h2>
          <span style={styles.sectionHint}>Latest updates across your campus</span>
        </div>
        <div style={styles.emptyState}>
          <i className="pi pi-inbox" style={styles.emptyIcon} />
          <span style={styles.emptyTitle}>No recent activity</span>
          <span style={styles.emptyText}>Activity will appear here as members and staff make updates.</span>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    margin: '6px 0 0',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#374151',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
  },
  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(145deg, #c0a067 0%, #a8894f 100%)',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(192, 160, 103, 0.3)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: 18,
    background: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: 12,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1f2937',
    lineHeight: 1.2,
  },
  statTrend: {
    fontSize: 11,
    color: '#9ca3af',
  },
  section: {
    background: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: 12,
    padding: 20,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#1f2937',
    margin: 0,
  },
  sectionHint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 12,
  },
  actionCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 16,
    borderRadius: 10,
    border: '1px solid #e5e7eb',
    background: '#fafafa',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: 'rgba(192, 160, 103, 0.12)',
    color: '#c0a067',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1f2937',
  },
  actionDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 1.5,
  },
  actionArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
    color: '#c0a067',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '32px 16px',
    color: '#9ca3af',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    color: '#d1d5db',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
  },
  emptyText: {
    fontSize: 12,
    color: '#9ca3af',
    maxWidth: 320,
  },
};
