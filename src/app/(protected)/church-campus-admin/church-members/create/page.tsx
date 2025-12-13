/**
 * Create Member Page
 *
 * Multi-step form for creating new members
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Steps } from 'primereact/steps';
import { PageHeader } from '@/components/layout/Breadcrumbs';
import { CardDiv } from '@/components/cards/CardDiv';
import { FormInput } from '@/components/forms/FormInput';
import { FormSelect } from '@/components/forms/FormSelect';
import { FormCalendar } from '@/components/forms/FormCalendar';
import { FormTextarea } from '@/components/forms/FormTextarea';
import { Button } from '@/components/ui/Button';
import { usePageBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { useAuth } from '@/hooks/useAuth';
import { memberService } from '@/services/member.service';
import { memberCreationSchema, type MemberCreationFormData } from '@/models/schemas/member.schema';
import { GENDER_OPTIONS, CIVIL_STATUS_OPTIONS, AFFILIATION_OPTIONS } from '@/models/enums';
import { ROUTES } from '@/core/constants';

const steps = [
  { label: 'Personal Info' },
  { label: 'Contact Info' },
  { label: 'Additional Info' },
  { label: 'Review' },
];

export default function CreateMemberPage() {
  const router = useRouter();
  const { getChurchCampusId } = useAuth();
  usePageBreadcrumbs('Create Member');

  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<MemberCreationFormData>({
    resolver: zodResolver(memberCreationSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      middle_name: '',
      suffix_name: '',
      email: '',
      mobile_number: '',
      gender: undefined,
      birthdate: undefined,
      civil_status: undefined,
      affiliation: undefined,
      address: '',
      city: '',
      province: '',
      postal_code: '',
      country: 'Philippines',
      occupation: '',
      company: '',
      notes: '',
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch, trigger, formState: { isSubmitting } } = methods;
  const formData = watch();

  const validateStep = async (step: number): Promise<boolean> => {
    const fieldsToValidate: Record<number, (keyof MemberCreationFormData)[]> = {
      0: ['first_name', 'last_name', 'gender', 'birthdate'],
      1: ['email', 'mobile_number', 'address'],
      2: ['civil_status', 'affiliation'],
    };

    const fields = fieldsToValidate[step];
    if (!fields) return true;

    const result = await trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(activeStep);
    if (isValid && activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: MemberCreationFormData) => {
    const campusId = getChurchCampusId();
    if (!campusId) return;

    const memberData = {
      ...data,
      church_campus_id: campusId,
      birthdate: data.birthdate ? new Date(data.birthdate).toISOString() : undefined,
    };

    const result = await memberService.createMember(memberData);
    if (result) {
      router.push(ROUTES.CHURCH_MEMBERS);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="first_name"
              label="First Name"
              placeholder="Enter first name"
              showRequired
            />
            <FormInput
              name="last_name"
              label="Last Name"
              placeholder="Enter last name"
              showRequired
            />
            <FormInput
              name="middle_name"
              label="Middle Name"
              placeholder="Enter middle name"
            />
            <FormInput
              name="suffix_name"
              label="Suffix"
              placeholder="Jr., Sr., III, etc."
            />
            <FormSelect
              name="gender"
              label="Gender"
              options={GENDER_OPTIONS}
              placeholder="Select gender"
              showRequired
            />
            <FormCalendar
              name="birthdate"
              label="Birthdate"
              placeholder="Select birthdate"
              showRequired
            />
          </div>
        );

      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="email"
              label="Email"
              placeholder="Enter email address"
            />
            <FormInput
              name="mobile_number"
              label="Mobile Number"
              placeholder="Enter mobile number"
            />
            <div className="md:col-span-2">
              <FormInput
                name="address"
                label="Address"
                placeholder="Enter street address"
              />
            </div>
            <FormInput
              name="city"
              label="City"
              placeholder="Enter city"
            />
            <FormInput
              name="province"
              label="Province/State"
              placeholder="Enter province"
            />
            <FormInput
              name="postal_code"
              label="Postal Code"
              placeholder="Enter postal code"
            />
            <FormInput
              name="country"
              label="Country"
              placeholder="Enter country"
            />
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              name="civil_status"
              label="Civil Status"
              options={CIVIL_STATUS_OPTIONS}
              placeholder="Select civil status"
            />
            <FormSelect
              name="affiliation"
              label="Affiliation"
              options={AFFILIATION_OPTIONS}
              placeholder="Select affiliation"
            />
            <FormInput
              name="occupation"
              label="Occupation"
              placeholder="Enter occupation"
            />
            <FormInput
              name="company"
              label="Company/Organization"
              placeholder="Enter company name"
            />
            <div className="md:col-span-2">
              <FormTextarea
                name="notes"
                label="Notes"
                placeholder="Additional notes about the member"
                rows={4}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info Review */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="pi pi-user text-primary" />
                  Personal Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Name:</dt>
                    <dd className="font-medium">
                      {formData.first_name} {formData.middle_name} {formData.last_name} {formData.suffix_name}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Gender:</dt>
                    <dd className="font-medium">{formData.gender || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Birthdate:</dt>
                    <dd className="font-medium">
                      {formData.birthdate
                        ? new Date(formData.birthdate).toLocaleDateString()
                        : 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Contact Info Review */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="pi pi-phone text-primary" />
                  Contact Information
                </h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Email:</dt>
                    <dd className="font-medium">{formData.email || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Mobile:</dt>
                    <dd className="font-medium">{formData.mobile_number || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Address:</dt>
                    <dd className="font-medium text-right">
                      {[formData.address, formData.city, formData.province, formData.postal_code]
                        .filter(Boolean)
                        .join(', ') || 'Not specified'}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Additional Info Review */}
              <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <i className="pi pi-info-circle text-primary" />
                  Additional Information
                </h4>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Civil Status:</dt>
                    <dd className="font-medium">{formData.civil_status || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Affiliation:</dt>
                    <dd className="font-medium">{formData.affiliation || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Occupation:</dt>
                    <dd className="font-medium">{formData.occupation || 'Not specified'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Company:</dt>
                    <dd className="font-medium">{formData.company || 'Not specified'}</dd>
                  </div>
                </dl>
                {formData.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <dt className="text-gray-500 mb-1">Notes:</dt>
                    <dd className="text-gray-800">{formData.notes}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeader
        title="Create New Member"
        subtitle="Add a new member to your church"
      />

      <CardDiv>
        {/* Stepper */}
        <Steps
          model={steps}
          activeIndex={activeStep}
          onSelect={(e) => setActiveStep(e.index)}
          readOnly={false}
          className="mb-6"
        />

        {/* Form Content */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-[300px]">{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
              <Button
                type="button"
                label="Back"
                icon="pi pi-arrow-left"
                variant="secondary"
                onClick={handleBack}
                disabled={activeStep === 0}
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  label="Cancel"
                  variant="text"
                  onClick={() => router.push(ROUTES.CHURCH_MEMBERS)}
                />

                {activeStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    label="Next"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    onClick={handleNext}
                  />
                ) : (
                  <Button
                    type="submit"
                    label="Create Member"
                    icon="pi pi-check"
                    loading={isSubmitting}
                  />
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </CardDiv>
    </div>
  );
}
