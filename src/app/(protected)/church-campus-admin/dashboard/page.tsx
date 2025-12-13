/**
 * Dashboard Page
 *
 * Main admin dashboard with statistics and charts
 */

'use client';

import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { StatsWidget, StatsGrid } from '@/components/cards/StatsWidget';
import { CardDivTitle } from '@/components/cards/CardDivTitle';
import { useAuth } from '@/hooks/useAuth';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';

interface DashboardStats {
  totalMembers: number;
  newMembersThisMonth: number;
  activeMembers: number;
  cellGroups: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  usePageBreadcrumbs('Dashboard', { icon: 'pi pi-home', replace: true });

  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    newMembersThisMonth: 0,
    activeMembers: 0,
    cellGroups: 0,
  });

  const [loading, setLoading] = useState(true);

  // Simulated data - replace with actual API calls
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStats({
        totalMembers: 1234,
        newMembersThisMonth: 45,
        activeMembers: 1100,
        cellGroups: 28,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  // Chart data
  const memberGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Members',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: '#3B82F6',
        tension: 0.4,
      },
      {
        label: 'Active Members',
        data: [28, 48, 40, 19, 86, 27],
        fill: false,
        borderColor: '#10B981',
        tension: 0.4,
      },
    ],
  };

  const memberDistributionData = {
    labels: ['Men', 'Women', 'Youth', 'Children'],
    datasets: [
      {
        data: [300, 350, 200, 150],
        backgroundColor: ['#3B82F6', '#EC4899', '#F59E0B', '#10B981'],
        hoverBackgroundColor: ['#2563EB', '#DB2777', '#D97706', '#059669'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const campusName = user?.church_campus_staff?.church_campus?.name || 'Your Church';

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome to ${campusName}`}
      />

      {/* Stats Grid */}
      <StatsGrid columns={4} className="mb-6">
        <StatsWidget
          title="Total Members"
          value={stats.totalMembers}
          icon="pi pi-users"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          trend="up"
          trendValue="+12%"
          trendLabel="vs last month"
          loading={loading}
        />
        <StatsWidget
          title="New This Month"
          value={stats.newMembersThisMonth}
          icon="pi pi-user-plus"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          trend="up"
          trendValue="+8%"
          trendLabel="vs last month"
          loading={loading}
        />
        <StatsWidget
          title="Active Members"
          value={stats.activeMembers}
          icon="pi pi-check-circle"
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          trend="neutral"
          trendValue="0%"
          trendLabel="no change"
          loading={loading}
        />
        <StatsWidget
          title="Cell Groups"
          value={stats.cellGroups}
          icon="pi pi-sitemap"
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          loading={loading}
        />
      </StatsGrid>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CardDivTitle title="Member Growth" icon="pi pi-chart-line">
          <div style={{ height: '300px' }}>
            <Chart type="line" data={memberGrowthData} options={chartOptions} />
          </div>
        </CardDivTitle>

        <CardDivTitle title="Member Distribution" icon="pi pi-chart-pie">
          <div style={{ height: '300px' }}>
            <Chart type="doughnut" data={memberDistributionData} options={chartOptions} />
          </div>
        </CardDivTitle>
      </div>

      {/* Recent Activity */}
      <CardDivTitle title="Recent Activity" icon="pi pi-clock">
        <div className="space-y-4">
          {[
            { icon: 'pi-user-plus', text: 'John Doe joined the church', time: '2 hours ago', color: 'text-green-600' },
            { icon: 'pi-pencil', text: 'Jane Smith updated their profile', time: '4 hours ago', color: 'text-blue-600' },
            { icon: 'pi-users', text: 'New cell group "Youth Leaders" created', time: '1 day ago', color: 'text-purple-600' },
            { icon: 'pi-calendar', text: 'Sunday service attendance: 450', time: '2 days ago', color: 'text-orange-600' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${activity.color}`}>
                <i className={`pi ${activity.icon}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{activity.text}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardDivTitle>
    </div>
  );
}
