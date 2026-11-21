/**
 * Women Network Page
 *
 * Admin placeholder until the women network directory is built.
 */

import { AdminComingSoon, AdminPageHeader } from '@/components/admin';

export default function WomenNetwork() {
  return (
    <div className="admin-dashboard">
      <AdminPageHeader
        eyebrow="Church Members"
        title="Women Network"
        subtitle={<>Directory and management for the women&apos;s ministry network.</>}
      />
      <AdminComingSoon
        icon="pi pi-user"
        label="Women Network content"
        description={<>The Women Network directory is under development. This area will list all active members in the women&apos;s ministry and support group management.</>}
      />
    </div>
  );
}
