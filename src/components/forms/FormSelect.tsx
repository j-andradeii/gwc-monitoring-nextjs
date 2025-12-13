'use client';

import React, { useId } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Controller, useFormContext } from 'react-hook-form';
import { FormSelectItem } from '@/models/enums';
import FormError from './FormError';
import './styles/form-input.css';

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  showSpinner?: boolean;
  options: FormSelectItem<unknown>[];
  readonly?: boolean;
  showRequired?: boolean;
  showLabel?: boolean;
  displayDisabled?: boolean;
  showRightIcon?: boolean;
  rightIcon?: string;
  feedback?: boolean;
  disabled?: boolean;
  optionDisabled?: string | null;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  placeholder,
  options = [],
  showRequired = false,
  showLabel = true,
  displayDisabled = false,
  showRightIcon = false,
  disabled = false,
  optionDisabled = null,
}) => {
  const { control, formState: { errors } } = useFormContext();

  const getNestedError = (errors: Record<string, unknown>, path: string): string | undefined => {
    const parts = path.split('.');
    let current: Record<string, unknown> = errors;

    for (const part of parts) {
      if (!current[part]) return undefined;
      current = current[part] as Record<string, unknown>;
    }

    return (current as { message?: string }).message;
  };

  const error = getNestedError(errors, name);
  const reactId = useId();
  const uniqueId = `${name}-${reactId}`;

  return (
    <div className="grid grid-nogutter w-100">
      {showLabel && label && (
        <label htmlFor={uniqueId} className="col-12">
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}

      <div className="col-12 input-container w-100">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <span className="p-input-icon-right w-100 flex">
              {showRightIcon && (
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
              )}

              <Dropdown
                id={field.name}
                value={field.value || ''}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  field.onBlur();
                }}
                onBlur={field.onBlur}
                options={options}
                optionLabel="label"
                optionDisabled={optionDisabled ?? undefined}
                placeholder={placeholder}
                className={`acps-dropdown w-100 ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''}`}
                name={uniqueId}
                disabled={disabled}
              />
            </span>
          )}
        />
        {error && <FormError error={error} />}
      </div>
    </div>
  );
};

export default FormSelect;
