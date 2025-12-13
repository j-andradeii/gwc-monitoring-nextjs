/**
 * All Members Page
 *
 * Display and manage all church members
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDiv } from '@/components/cards/CardDiv';
import { Button, IconButton } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { usePrimeTablePagination } from '@/hooks/usePagination';
import { memberService } from '@/services/member.service';
import { formatDate } from '@/core/date-utils';
import { ROUTES } from '@/core/constants';
import type { MemberDto, MemberListResponseDto } from '@/models/member.types';

export default function AllMembersPage() {
  const router = useRouter();
  usePageBreadcrumbs('All Members');

  const [members, setMembers] = useState<MemberDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const pagination = usePrimeTablePagination({
    initialPage: 1,
    initialPageSize: 10,
    initialSortBy: 'created_at',
    initialSortDirection: 'DESC',
  });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const response: MemberListResponseDto | null = await memberService.getMembers({
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy: pagination.sortBy,
      sortDirection: pagination.sortDirection,
      search: pagination.search,
    });

    if (response) {
      setMembers(response.data || []);
      pagination.setTotalRecords(response.total || 0);
    }
    setLoading(false);
  }, [pagination.page, pagination.pageSize, pagination.sortBy, pagination.sortDirection, pagination.search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    // Debounce search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      pagination.setSearch(value);
    }, 500);

    setSearchTimeout(timeout);
  };

  const handleDelete = (member: MemberDto) => {
    confirmDialog({
      message: `Are you sure you want to delete ${member.first_name} ${member.last_name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        const success = await memberService.deleteMember(member.id);
        if (success) {
          fetchMembers();
        }
      },
    });
  };

  const avatarTemplate = (rowData: MemberDto) => {
    const initials = `${rowData.first_name?.charAt(0) || ''}${rowData.last_name?.charAt(0) || ''}`;

    return (
      <div className="flex items-center gap-3">
        <Avatar
          image={rowData.photo || undefined}
          label={!rowData.photo ? initials : undefined}
          size="normal"
          shape="circle"
          className="bg-primary text-white"
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

  const contactTemplate = (rowData: MemberDto) => (
    <div className="text-sm">
      {rowData.mobile_number && (
        <p className="text-gray-600">
          <i className="pi pi-phone mr-1" style={{ fontSize: '0.75rem' }} />
          {rowData.mobile_number}
        </p>
      )}
    </div>
  );

  const dateTemplate = (rowData: MemberDto) => (
    <span className="text-gray-600 text-sm">
      {rowData.created_at ? formatDate(rowData.created_at) : 'N/A'}
    </span>
  );

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
      <IconButton
        icon="pi pi-trash"
        variant="text"
        className="text-red-500 hover:text-red-700"
        onClick={() => handleDelete(rowData)}
        tooltip="Delete"
      />
    </div>
  );

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="All Members"
        subtitle="View and manage all church members"
        action={
          <Button
            label="Add Member"
            icon="pi pi-plus"
            onClick={() => router.push(ROUTES.CREATE_MEMBER)}
          />
        }
      />

      <CardDiv>
        {/* Search Bar */}
        <div className="mb-4">
          <span className="p-input-icon-left w-full md:w-80">
            <i className="pi pi-search" />
            <InputText
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full"
            />
          </span>
        </div>

        {/* Data Table */}
        <DataTable
          value={members}
          loading={loading}
          paginator
          lazy
          first={pagination.first}
          rows={pagination.rows}
          totalRecords={pagination.totalRecords}
          onPage={pagination.onPage}
          onSort={pagination.onSort}
          sortField={pagination.sortField}
          sortOrder={pagination.sortOrder as 1 | -1}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} members"
          emptyMessage="No members found"
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
            field="gender"
            header="Gender"
            sortable
          />
          <Column
            header="Contact"
            body={contactTemplate}
          />
          <Column
            field="affiliation"
            header="Affiliation"
            sortable
          />
          <Column
            header="Joined"
            body={dateTemplate}
            sortable
            sortField="created_at"
          />
          <Column
            header="Actions"
            body={actionsTemplate}
            style={{ width: '120px' }}
          />
        </DataTable>
      </CardDiv>
    </div>
  );
}
