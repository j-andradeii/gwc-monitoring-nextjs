/**
 * Member Detail Page
 *
 * View and edit member details
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar } from 'primereact/avatar';
import { TabView, TabPanel } from 'primereact/tabview';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDiv } from '@/components/cards/CardDiv';
import { CardDivTitle } from '@/components/cards/CardDivTitle';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormCalendar } from '@/components/forms/FormCalendar';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { memberService } from '@/services/member.service';
import { memberCreationSchema, type MemberCreationFormData } from '@/models/schemas/member.schema';
import { GENDER_OPTIONS, CIVIL_STATUS_OPTIONS, AFFILIATION_OPTIONS, Gender } from '@/models/enums';
import { formatDate } from '@/core/date-utils';
import { ROUTES } from '@/core/constants';
import type { MemberDto } from '@/models/member.types';

interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MemberDetailPage({ params }: MemberDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  const [member, setMember] = useState<MemberDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');

  usePageBreadcrumbs('Member Details');

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  const methods = useForm<MemberCreationFormData>({
    resolver: zodResolver(memberCreationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      mobile_number: '',
      gender: undefined,
      birthdate: undefined,
      civil_status: undefined,
      affiliation: undefined,
      address: '',
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting, isDirty } } = methods;

  useEffect(() => {
    const fetchMember = async () => {
      if (!resolvedParams?.id) return;

      setLoading(true);
      const data = await memberService.getMemberById(resolvedParams.id);
      if (data) {
        setMember(data);
        reset({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          middle_name: data.middle_name || '',
          suffix_name: data.suffix_name || '',
          email: data.email || '',
          mobile_number: data.mobile_number || '',
          gender: data.gender as Gender | undefined,
          birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
          civil_status: data.civil_status as MemberCreationFormData['civil_status'],
          affiliation: data.affiliation as MemberCreationFormData['affiliation'],
          address: data.address || '',
          city: data.city || '',
          province: data.province || '',
          postal_code: data.postal_code || '',
          country: data.country || 'Philippines',
          occupation: data.occupation || '',
          company: data.company || '',
          notes: data.notes || '',
        });
      }
      setLoading(false);
    };

    fetchMember();
  }, [resolvedParams?.id, reset]);

  const onSubmit = async (data: MemberCreationFormData) => {
    if (!resolvedParams?.id) return;

    const updateData = {
      ...data,
      birthdate: data.birthdate ? new Date(data.birthdate).toISOString() : undefined,
    };

    const result = await memberService.updateMember(resolvedParams.id, updateData);
    if (result) {
      setMember(result);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (!member) return;

    confirmDialog({
      message: `Are you sure you want to delete ${member.first_name} ${member.last_name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        const success = await memberService.deleteMember(member.id);
        if (success) {
          router.push(ROUTES.CHURCH_MEMBERS);
        }
      },
    });
  };

  const handleCancel = () => {
    if (member) {
      reset({
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        mobile_number: member.mobile_number || '',
        gender: member.gender as Gender | undefined,
        birthdate: member.birthdate ? new Date(member.birthdate) : undefined,
        civil_status: member.civil_status as MemberCreationFormData['civil_status'],
        affiliation: member.affiliation as MemberCreationFormData['affiliation'],
        address: member.address || '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <Spinner center label="Loading member details..." />;
  }

  if (!member) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="pi pi-user text-4xl text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Member Not Found</h2>
          <p className="text-gray-500 mb-4">The member you&apos;re looking for doesn&apos;t exist.</p>
          <Button
            label="Back to Members"
            icon="pi pi-arrow-left"
            onClick={() => router.push(ROUTES.CHURCH_MEMBERS)}
          />
        </div>
      </div>
    );
  }

  const fullName = `${member.first_name} ${member.last_name}`;
  const initials = `${member.first_name?.charAt(0) || ''}${member.last_name?.charAt(0) || ''}`;

  return (
    <div>
      <ConfirmDialog />

      <PageHeader
        title="Member Details"
        subtitle={fullName}
        action={
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  onClick={() => setIsEditing(true)}
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  variant="danger"
                  onClick={handleDelete}
                />
              </>
            ) : null}
          </div>
        }
      />

      {/* Member Header Card */}
      <CardDiv className="mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <Avatar
            image={member.photo || undefined}
            label={!member.photo ? initials : undefined}
            size="xlarge"
            shape="circle"
            className="bg-primary text-white w-24 h-24 text-2xl"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{fullName}</h2>
            <p className="text-gray-500">{member.email || 'No email'}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              {member.gender && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {member.gender}
                </span>
              )}
              {member.affiliation && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  {member.affiliation}
                </span>
              )}
              {member.civil_status && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                  {member.civil_status}
                </span>
              )}
            </div>
          </div>
          <div className="md:ml-auto text-center md:text-right">
            <p className="text-sm text-gray-500">Member since</p>
            <p className="font-medium text-gray-800">
              {member.created_at ? formatDate(member.created_at) : 'Unknown'}
            </p>
          </div>
        </div>
      </CardDiv>

      {/* Edit Form or View Tabs */}
      {isEditing ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardDivTitle title="Edit Member Information" icon="pi pi-pencil">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  name="first_name"
                  label="First Name"
                  showRequired
                />
                <FormInput
                  name="last_name"
                  label="Last Name"
                  showRequired
                />
                <FormInput
                  name="email"
                  label="Email"
                />
                <FormInput
                  name="mobile_number"
                  label="Mobile Number"
                />
                <FormSelect
                  name="gender"
                  label="Gender"
                  options={GENDER_OPTIONS}
                />
                <FormCalendar
                  name="birthdate"
                  label="Birthdate"
                />
                <FormSelect
                  name="civil_status"
                  label="Civil Status"
                  options={CIVIL_STATUS_OPTIONS}
                />
                <FormSelect
                  name="affiliation"
                  label="Affiliation"
                  options={AFFILIATION_OPTIONS}
                />
                <div className="md:col-span-2">
                  <FormInput
                    name="address"
                    label="Address"
                  />
                </div>
                <div className="md:col-span-2">
                  <FormTextarea
                    name="notes"
                    label="Notes"
                    rows={3}
                  />
                </div>
              </div>

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
            </CardDivTitle>
          </form>
        </FormProvider>
      ) : (
        <TabView>
          <TabPanel header="Personal Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium text-gray-800">{member.gender || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Birthdate</p>
                <p className="font-medium text-gray-800">
                  {member.birthdate ? formatDate(member.birthdate) : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Civil Status</p>
                <p className="font-medium text-gray-800">{member.civil_status || 'Not specified'}</p>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Contact Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{member.email || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mobile Number</p>
                <p className="font-medium text-gray-800">{member.mobile_number || 'Not specified'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">{member.address || 'Not specified'}</p>
              </div>
            </div>
          </TabPanel>

          <TabPanel header="Church Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Affiliation</p>
                <p className="font-medium text-gray-800">{member.affiliation || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cell Group</p>
                <p className="font-medium text-gray-800">{member.cell_group?.name || 'Not assigned'}</p>
              </div>
            </div>
          </TabPanel>
        </TabView>
      )}
    </div>
  );
}
