/**
 * Men Network Page
 *
 * Admin placeholder until the men network directory is built.
 */

import { AdminComingSoon, AdminPageHeader } from '@/components/admin';

export default function MenNetwork() {
  return (
    <div className="admin-dashboard" >
      <AdminPageHeader
        eyebrow="Church Members"
        title="Men Network"
        subtitle={<>Directory and management for the men&apos;s ministry network.</>}
      />
      <AdminComingSoon
        icon="pi pi-user"
        label="Men Network content"
        description={<>The Men Network directory is under development. This area will list all active members in the men&apos;s ministry and support group management.</>}
      />
    </div>
  );
}
