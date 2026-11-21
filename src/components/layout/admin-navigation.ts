/**
 * Admin Navigation
 *
 * One source for the admin sidebar and the dashboard quick actions.
 * `available: false` marks a page that isn't built yet: the UI shows it with a
 * "Soon" pill and never renders it as a link, so nothing in the admin leads to a
 * 404. Flip the flag (and add the `ROUTES` entry) when the page lands.
 */

import { ROUTES } from '@/core/constants';
import { ChurchRole } from '@/models/enums';

export interface SidebarMenuItem {
  label: string;
  icon: string;
  path?: string;
  /** false → page not built yet: rendered as "Soon", not a link */
  available?: boolean;
  children?: SidebarMenuItem[];
  roles?: string[];
  badge?: string | number;
}

export interface SidebarSection {
  label: string;
  items: SidebarMenuItem[];
}

export const ADMIN_NAV_SECTIONS: SidebarSection[] = [
  {
    label: 'Home',
    items: [
      { label: 'Dashboard', icon: 'pi pi-th-large', path: ROUTES.DASHBOARD, available: true },
      {
        label: 'Church Information',
        icon: 'pi pi-building',
        children: [
          { label: 'Church Detail', icon: 'pi pi-info-circle', path: ROUTES.CHURCH_INFO, available: false },
          { label: 'Pastoral Staffs', icon: 'pi pi-users', path: ROUTES.PASTORAL_STAFFS, available: false },
          {
            label: 'Configuration',
            icon: 'pi pi-cog',
            path: ROUTES.CHURCH_CONFIG,
            available: false,
            roles: [ChurchRole.SENIOR_PASTOR],
          },
        ],
      },
      { label: 'Campaigns', icon: 'pi pi-megaphone', path: ROUTES.CHURCH_CAMPAIGNS, available: false },
    ],
  },
  {
    label: 'Members',
    items: [
      {
        label: 'Gateway Church Members',
        icon: 'pi pi-users',
        children: [
          { label: 'All Members', icon: 'pi pi-list', path: ROUTES.CHURCH_MEMBERS, available: true },
          { label: 'Men Network', icon: 'pi pi-user', path: ROUTES.MEN_NETWORK, available: true },
          { label: 'Women Network', icon: 'pi pi-user', path: ROUTES.WOMEN_NETWORK, available: true },
        ],
      },
    ],
  },
  {
    label: 'Winning',
    items: [
      { label: 'Prayer of 3', icon: 'pi pi-heart', path: '/church-campus-admin/prayer-of-three', available: false },
      { label: 'Evangelize', icon: 'pi pi-send', path: '/church-campus-admin/evangelize', available: false },
    ],
  },
  {
    label: 'Consolidation',
    items: [{ label: 'SUYNIL', icon: 'pi pi-book', path: '/church-campus-admin/suynil', available: false }],
  },
  {
    label: 'Gateway Events',
    items: [{ label: 'Events', icon: 'pi pi-calendar', path: '/church-campus-admin/events', available: false }],
  },
];

export interface AdminQuickAction {
  label: string;
  description: string;
  icon: string;
  href: string;
  available: boolean;
}

/** Dashboard shortcuts — built pages first, the rest flagged "Soon". */
export const ADMIN_QUICK_ACTIONS: AdminQuickAction[] = [
  {
    label: 'Church Members',
    description: 'Browse the congregation roster',
    icon: 'pi pi-users',
    href: ROUTES.CHURCH_MEMBERS,
    available: true,
  },
  {
    label: 'Men Network',
    description: 'Men’s ministry directory',
    icon: 'pi pi-user',
    href: ROUTES.MEN_NETWORK,
    available: true,
  },
  {
    label: 'Women Network',
    description: 'Women’s ministry directory',
    icon: 'pi pi-user',
    href: ROUTES.WOMEN_NETWORK,
    available: true,
  },
  {
    label: 'Church Information',
    description: 'Campus details and contacts',
    icon: 'pi pi-building',
    href: ROUTES.CHURCH_INFO,
    available: false,
  },
  {
    label: 'Pastoral Staffs',
    description: 'Pastoral team roster',
    icon: 'pi pi-id-card',
    href: ROUTES.PASTORAL_STAFFS,
    available: false,
  },
  {
    label: 'Campaigns',
    description: 'Active church campaigns',
    icon: 'pi pi-megaphone',
    href: ROUTES.CHURCH_CAMPAIGNS,
    available: false,
  },
];

/**
 * Exact match on purpose: menu paths nest (`church-members` is the parent of
 * `church-members/men-network`), so a prefix match would light up two items.
 */
export const isPathActive = (pathname: string, path?: string): boolean =>
  !!path && pathname.replace(/\/$/, '') === path;

/** True when the item or one of its children is the current page. */
export const isItemActive = (pathname: string, item: SidebarMenuItem): boolean =>
  isPathActive(pathname, item.path) ||
  !!item.children?.some((child) => isItemActive(pathname, child));
