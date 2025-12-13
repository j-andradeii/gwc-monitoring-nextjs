/**
 * Pastoral Staffs Page
 *
 * Display church campus staff members
 */

'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDiv } from '@/components/cards/CardDiv';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { churchCampusService } from '@/services/church-campus.service';
import type { ChurchCampusStaffDto } from '@/models/church.types';

export default function PastoralStaffsPage() {
  const { getChurchCampusId } = useAuth();
  usePageBreadcrumbs('Pastoral Staffs');

  const [staffs, setStaffs] = useState<ChurchCampusStaffDto[]>([]);
  const [loading, setLoading] = useState(true);

  const campusId = getChurchCampusId();

  useEffect(() => {
    const fetchStaffs = async () => {
      if (!campusId) return;

      setLoading(true);
      const data = await churchCampusService.getChurchCampusStaffs(campusId);
      if (data) {
        setStaffs(data.items || []);
      }
      setLoading(false);
    };

    fetchStaffs();
  }, [campusId]);

  const avatarTemplate = (rowData: ChurchCampusStaffDto) => {
    const member = rowData.member;
    const initials = member
      ? `${member.first_name?.charAt(0) || ''}${member.last_name?.charAt(0) || ''}`
      : 'NA';

    return (
      <div className="flex items-center gap-3">
        <Avatar
          image={member?.photo || undefined}
          label={!member?.photo ? initials : undefined}
          size="normal"
          shape="circle"
          className="bg-primary text-white"
        />
        <div>
          <p className="font-medium text-gray-800">
            {member ? `${member.first_name} ${member.last_name}` : 'Unknown'}
          </p>
          <p className="text-sm text-gray-500">{member?.email || 'No email'}</p>
        </div>
      </div>
    );
  };

  const roleTemplate = (rowData: ChurchCampusStaffDto) => {
    const roleColors: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      SENIOR_PASTOR: 'success',
      PASTOR: 'info',
      STAFF: 'warning',
    };

    return (
      <Tag
        value={rowData.role}
        severity={roleColors[rowData.role] || 'info'}
      />
    );
  };

  const statusTemplate = (rowData: ChurchCampusStaffDto) => {
    const isActive = rowData.is_active;
    return (
      <Tag
        value={isActive ? 'Active' : 'Inactive'}
        severity={isActive ? 'success' : 'danger'}
      />
    );
  };

  const contactTemplate = (rowData: ChurchCampusStaffDto) => {
    const member = rowData.member;
    return (
      <div className="text-sm">
        {member?.mobile_number && (
          <p className="text-gray-600">
            <i className="pi pi-phone mr-1" style={{ fontSize: '0.75rem' }} />
            {member.mobile_number}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return <Spinner center label="Loading staff members..." />;
  }

  return (
    <div>
      <PageHeader
        title="Pastoral Staffs"
        subtitle="View all staff members of your church campus"
      />

      <CardDiv>
        <DataTable
          value={staffs}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No staff members found"
          className="p-datatable-sm"
          stripedRows
        >
          <Column
            header="Staff Member"
            body={avatarTemplate}
            sortable
            sortField="member.first_name"
          />
          <Column
            header="Role"
            body={roleTemplate}
            sortable
            sortField="role"
          />
          <Column
            header="Contact"
            body={contactTemplate}
          />
          <Column
            header="Status"
            body={statusTemplate}
            sortable
            sortField="is_active"
          />
        </DataTable>
      </CardDiv>
    </div>
  );
}
