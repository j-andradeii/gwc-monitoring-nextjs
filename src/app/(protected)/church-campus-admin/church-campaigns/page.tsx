/**
 * Church Campaigns Page
 *
 * Manage church campaigns
 */

'use client';

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDiv } from '@/components/cards/CardDiv';
import { CardDivTitle } from '@/components/cards/CardDivTitle';
import { StatsWidget, StatsGrid } from '@/components/cards/StatsWidget';
import { Button, IconButton } from '@/components/ui/Button';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { formatDate } from '@/core/date-utils';

interface Campaign {
  id: string;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  start_date: string;
  end_date: string;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING' | 'CANCELLED';
}

// Mock data - replace with actual API calls
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Building Fund 2024',
    description: 'Funds for the new church building expansion',
    target_amount: 1000000,
    current_amount: 750000,
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    status: 'ACTIVE',
  },
  {
    id: '2',
    name: 'Mission Trip Fund',
    description: 'Support for overseas mission trips',
    target_amount: 50000,
    current_amount: 50000,
    start_date: '2024-03-01',
    end_date: '2024-06-30',
    status: 'COMPLETED',
  },
  {
    id: '3',
    name: 'Youth Camp 2024',
    description: 'Annual youth camp sponsorship',
    target_amount: 25000,
    current_amount: 5000,
    start_date: '2024-07-01',
    end_date: '2024-08-31',
    status: 'UPCOMING',
  },
];

export default function ChurchCampaignsPage() {
  usePageBreadcrumbs('Campaigns');

  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [loading] = useState(false);

  const totalRaised = campaigns.reduce((sum, c) => sum + c.current_amount, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const completedCampaigns = campaigns.filter((c) => c.status === 'COMPLETED').length;

  const statusTemplate = (rowData: Campaign) => {
    const statusColors: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
      ACTIVE: 'success',
      COMPLETED: 'info',
      UPCOMING: 'warning',
      CANCELLED: 'danger',
    };

    return (
      <Tag
        value={rowData.status}
        severity={statusColors[rowData.status] || 'info'}
      />
    );
  };

  const progressTemplate = (rowData: Campaign) => {
    const progress = Math.round((rowData.current_amount / rowData.target_amount) * 100);

    return (
      <div className="w-full">
        <ProgressBar
          value={progress}
          showValue={false}
          style={{ height: '8px' }}
          className="mb-1"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>${rowData.current_amount.toLocaleString()}</span>
          <span>{progress}%</span>
        </div>
      </div>
    );
  };

  const dateRangeTemplate = (rowData: Campaign) => (
    <div className="text-sm">
      <p className="text-gray-800">{formatDate(rowData.start_date)}</p>
      <p className="text-gray-500">to {formatDate(rowData.end_date)}</p>
    </div>
  );

  const actionsTemplate = (rowData: Campaign) => (
    <div className="flex gap-1">
      <IconButton
        icon="pi pi-eye"
        variant="text"
        tooltip="View Details"
      />
      <IconButton
        icon="pi pi-pencil"
        variant="text"
        tooltip="Edit"
      />
      <IconButton
        icon="pi pi-trash"
        variant="text"
        className="text-red-500 hover:text-red-700"
        tooltip="Delete"
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Church Campaigns"
        subtitle="Manage and track church fundraising campaigns"
        action={
          <Button
            label="New Campaign"
            icon="pi pi-plus"
          />
        }
      />

      {/* Stats */}
      <StatsGrid columns={3} className="mb-6">
        <StatsWidget
          title="Total Raised"
          value={`$${totalRaised.toLocaleString()}`}
          icon="pi pi-dollar"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsWidget
          title="Active Campaigns"
          value={activeCampaigns}
          icon="pi pi-megaphone"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatsWidget
          title="Completed"
          value={completedCampaigns}
          icon="pi pi-check-circle"
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </StatsGrid>

      {/* Active Campaign Highlight */}
      {campaigns.filter(c => c.status === 'ACTIVE').length > 0 && (
        <CardDivTitle title="Featured Campaign" icon="pi pi-star" className="mb-6">
          {campaigns.filter(c => c.status === 'ACTIVE').map(campaign => (
            <div key={campaign.id} className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{campaign.name}</h3>
                  <p className="text-gray-600 mt-1">{campaign.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ${campaign.current_amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    of ${campaign.target_amount.toLocaleString()} goal
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar
                  value={Math.round((campaign.current_amount / campaign.target_amount) * 100)}
                  style={{ height: '12px' }}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>Started: {formatDate(campaign.start_date)}</span>
                <span>Ends: {formatDate(campaign.end_date)}</span>
              </div>
            </div>
          ))}
        </CardDivTitle>
      )}

      {/* All Campaigns Table */}
      <CardDiv>
        <DataTable
          value={campaigns}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          emptyMessage="No campaigns found"
          className="p-datatable-sm"
          stripedRows
          rowHover
        >
          <Column
            field="name"
            header="Campaign"
            sortable
            body={(row) => (
              <div>
                <p className="font-medium text-gray-800">{row.name}</p>
                <p className="text-sm text-gray-500 truncate max-w-xs">{row.description}</p>
              </div>
            )}
          />
          <Column
            header="Progress"
            body={progressTemplate}
            style={{ width: '200px' }}
          />
          <Column
            header="Duration"
            body={dateRangeTemplate}
          />
          <Column
            header="Status"
            body={statusTemplate}
            sortable
            sortField="status"
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
