/**
 * Women Network Page
 *
 * Display female members
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDiv } from '@/components/cards/CardDiv';
import { IconButton } from '@/components/ui/Button';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { usePrimeTablePagination } from '@/hooks/usePagination';
import { memberService } from '@/services/member.service';
import { formatDate } from '@/core/date-utils';
import { ROUTES } from '@/core/constants';
import type { MemberDto, MemberListResponseDto } from '@/models/member.types';

export default function WomenNetworkPage() {
  const router = useRouter();
  usePageBreadcrumbs('Women Network');

  const [members, setMembers] = useState<MemberDto[]>([]);
  const [loading, setLoading] = useState(true);

  const pagination = usePrimeTablePagination({
    initialPage: 1,
    initialPageSize: 10,
    initialSortBy: 'created_at',
    initialSortDirection: 'DESC',
  });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    // In a real app, you'd filter by gender on the backend
    const response: MemberListResponseDto | null = await memberService.getMembers({
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy: pagination.sortBy,
      sortDirection: pagination.sortDirection,
      search: 'FEMALE', // This would be a proper filter in production
    });

    if (response) {
      // Filter by gender on client side (temporary)
      const femaleMembers = (response.data || []).filter(
        (m) => m.gender === 'FEMALE'
      );
      setMembers(femaleMembers);
      pagination.setTotalRecords(femaleMembers.length);
    }
    setLoading(false);
  }, [pagination.page, pagination.pageSize, pagination.sortBy, pagination.sortDirection]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const avatarTemplate = (rowData: MemberDto) => {
    const initials = `${rowData.first_name?.charAt(0) || ''}${rowData.last_name?.charAt(0) || ''}`;

    return (
      <div className="flex items-center gap-3">
        <Avatar
          image={rowData.photo || undefined}
          label={!rowData.photo ? initials : undefined}
          size="normal"
          shape="circle"
          className="bg-pink-600 text-white"
        />
        <div>
          <p className="font-medium text-gray-800">
            {rowData.first_name} {rowData.last_name}
          </p>
          <p className="text-sm text-gray-500">{rowData.email || 'No email'}</p>
        </div>
      </div>
    );
  };

  const actionsTemplate = (rowData: MemberDto) => (
    <div className="flex gap-1">
      <IconButton
        icon="pi pi-eye"
        variant="text"
        onClick={() => router.push(`${ROUTES.CHURCH_MEMBERS}/${rowData.id}`)}
        tooltip="View"
      />
      <IconButton
        icon="pi pi-pencil"
        variant="text"
        onClick={() => router.push(`${ROUTES.CHURCH_MEMBERS}/${rowData.id}?edit=true`)}
        tooltip="Edit"
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Women Network"
        subtitle="View all female members"
      />

      <CardDiv>
        <DataTable
          value={members}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No female members found"
          className="p-datatable-sm"
          stripedRows
          rowHover
        >
          <Column
            header="Member"
            body={avatarTemplate}
            sortable
            sortField="first_name"
          />
          <Column
            field="mobile_number"
            header="Contact"
            sortable
          />
          <Column
            field="affiliation"
            header="Affiliation"
            sortable
          />
          <Column
            field="created_at"
            header="Joined"
            body={(row) => formatDate(row.created_at)}
            sortable
          />
          <Column
            header="Actions"
            body={actionsTemplate}
            style={{ width: '100px' }}
          />
        </DataTable>
      </CardDiv>
    </div>
  );
}
