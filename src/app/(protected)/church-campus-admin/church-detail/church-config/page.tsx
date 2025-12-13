/**
 * Church Config Page
 *
 * Church campus configuration settings (Senior Pastor only)
 */

'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDivTitle } from '@/components/cards/CardDivTitle';
import { RoleGuard } from '@/guards/AuthGuard';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { Button } from '@/components/ui/Button';

export default function ChurchConfigPage() {
  usePageBreadcrumbs('Church Config');

  return (
    <RoleGuard allowedRoles={['SENIOR_PASTOR']}>
      <div>
        <PageHeader
          title="Church Configuration"
          subtitle="Manage your church campus settings"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <CardDivTitle title="General Settings" icon="pi pi-cog">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Enable Member Registration</p>
                  <p className="text-sm text-gray-500">Allow new members to register</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Enable Cell Groups</p>
                  <p className="text-sm text-gray-500">Allow cell group management</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Enable Campaigns</p>
                  <p className="text-sm text-gray-500">Allow campaign management</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </CardDivTitle>

          {/* Notification Settings */}
          <CardDivTitle title="Notification Settings" icon="pi pi-bell">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Email Notifications</p>
                  <p className="text-sm text-gray-500">Send email updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Send SMS updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">Birthday Reminders</p>
                  <p className="text-sm text-gray-500">Notify on member birthdays</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>
          </CardDivTitle>

          {/* Data Management */}
          <CardDivTitle title="Data Management" icon="pi pi-database">
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Export Data</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Download all church data in various formats
                </p>
                <div className="flex gap-2">
                  <Button label="Export CSV" icon="pi pi-file" variant="outlined" size="small" />
                  <Button label="Export Excel" icon="pi pi-file-excel" variant="outlined" size="small" />
                </div>
              </div>

              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <h4 className="font-medium text-red-800 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-600 mb-3">
                  These actions are irreversible. Please be careful.
                </p>
                <Button label="Clear All Data" icon="pi pi-trash" variant="danger" size="small" />
              </div>
            </div>
          </CardDivTitle>

          {/* Integration Settings */}
          <CardDivTitle title="Integrations" icon="pi pi-link">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-envelope text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Email Service</p>
                    <p className="text-sm text-gray-500">SendGrid</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Connected</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="pi pi-whatsapp text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">WhatsApp</p>
                    <p className="text-sm text-gray-500">Not configured</p>
                  </div>
                </div>
                <Button label="Connect" variant="outlined" size="small" />
              </div>
            </div>
          </CardDivTitle>
        </div>
      </div>
    </RoleGuard>
  );
}
