/**
 * Church Info Page
 *
 * Display and edit church campus information
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDivTitle } from '@/components/cards/CardDivTitle';
import { FormInput } from '@/components/forms/FormInput';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { churchCampusService } from '@/services/church-campus.service';
import { churchCampusUpdateSchema, type ChurchCampusUpdateFormData } from '@/models/schemas/church.schema';
import type { ChurchCampusDto } from '@/models/church.types';

export default function ChurchInfoPage() {
  const { getChurchCampusId } = useAuth();
  usePageBreadcrumbs('Church Info');

  const [campus, setCampus] = useState<ChurchCampusDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const campusId = getChurchCampusId();

  const methods = useForm<ChurchCampusUpdateFormData>({
    resolver: zodResolver(churchCampusUpdateSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      contact_number: '',
      email: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting, isDirty } } = methods;

  useEffect(() => {
    const fetchCampus = async () => {
      if (!campusId) return;

      setLoading(true);
      const data = await churchCampusService.getChurchCampusById(campusId);
      if (data) {
        setCampus(data);
        reset({
          name: data.name || '',
          description: data.description || '',
          address: data.address || '',
          contact_number: data.contact_number || '',
          email: data.email || '',
        });
      }
      setLoading(false);
    };

    fetchCampus();
  }, [campusId, reset]);

  const onSubmit = async (data: ChurchCampusUpdateFormData) => {
    if (!campusId) return;

    const result = await churchCampusService.updateChurchCampus(campusId, data);
    if (result) {
      setCampus(result);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (campus) {
      reset({
        name: campus.name || '',
        description: campus.description || '',
        address: campus.address || '',
        contact_number: campus.contact_number || '',
        email: campus.email || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <Spinner center label="Loading church info..." />;
  }

  return (
    <div>
      <PageHeader
        title="Church Info"
        subtitle="View and manage your church campus information"
        action={
          !isEditing ? (
            <Button
              label="Edit"
              icon="pi pi-pencil"
              variant="primary"
              onClick={() => setIsEditing(true)}
            />
          ) : undefined
        }
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardDivTitle title="Campus Details" icon="pi pi-building">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="name"
                label="Campus Name"
                placeholder="Enter campus name"
                displayDisabled={!isEditing}
                showRequired
              />

              <FormInput
                name="email"
                label="Email"
                placeholder="Enter email"
                displayDisabled={!isEditing}
              />

              <FormInput
                name="contact_number"
                label="Contact Number"
                placeholder="Enter contact number"
                displayDisabled={!isEditing}
              />

              <FormInput
                name="address"
                label="Address"
                placeholder="Enter address"
                displayDisabled={!isEditing}
              />

              <div className="md:col-span-2">
                <FormTextarea
                  name="description"
                  label="Description"
                  placeholder="Enter campus description"
                  rows={4}
                  displayDisabled={!isEditing}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  label="Cancel"
                  variant="secondary"
                  onClick={handleCancel}
                />
                <Button
                  type="submit"
                  label="Save Changes"
                  icon="pi pi-check"
                  loading={isSubmitting}
                  disabled={!isDirty}
                />
              </div>
            )}
          </CardDivTitle>
        </form>
      </FormProvider>

      {/* Church Info Display */}
      <CardDivTitle title="Parent Church" icon="pi pi-sitemap" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Church Name</p>
            <p className="font-medium text-gray-800">
              {campus?.church?.name || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Church ID</p>
            <p className="font-medium text-gray-800">
              {campus?.church_id || 'N/A'}
            </p>
          </div>
        </div>
      </CardDivTitle>
    </div>
  );
}
