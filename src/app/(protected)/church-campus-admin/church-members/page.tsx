/**
 * Church Members Page
 *
 * Admin placeholder until the church members directory is built.
 */

import { AdminComingSoon, AdminPageHeader } from '@/components/admin';

export default function ChurchMembers() {
  return (
    <div className="admin-dashboard">
      <AdminPageHeader
        eyebrow="Church Members"
        title="Church Members"
        subtitle={<>Browse and manage your congregation roster.</>}
      />
      <AdminComingSoon
        icon="pi pi-users"
        label="Church members content"
        description={<>The members directory is being prepared. It will list every member of your campus with search and filters.</>}
      />
    </div>
  );
}
