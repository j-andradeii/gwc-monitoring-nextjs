'use client';

import FormMaskedDate from '@/components/forms/FormMaskedDate';

/**
 * Thin backward-compatible wrapper around FormMaskedDate.
 * SodEnrollmentClient renders this unchanged — the field name,
 * label, and showRequired props are locked to the SOD birthdate field.
 */
export default function SodBirthdateField() {
  return <FormMaskedDate name="birthdate" label="Birthdate" showRequired />;
}
