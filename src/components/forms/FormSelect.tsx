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
  className?: string; // Container custom class
  dropdownClassName?: string; // Dropdown element custom class
  labelClassName?: string; // Label custom class
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
  className = '',
  dropdownClassName = '',
  labelClassName = '',
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
    <div className={`w-full ${className}`}>
      {showLabel && label && (
        <label htmlFor={uniqueId} className={`block mb-1 ${labelClassName}`}>
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}

      <div className="w-full input-container">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <div className="w-full">
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
                className={`acps-dropdown w-full ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''} ${dropdownClassName}`}
                name={uniqueId}
                disabled={disabled}
                style={{ width: '100%' }}
              />
            </div>
          )}
        />
        {error && <FormError error={error} />}
      </div>
    </div>
  );
};

export default FormSelect;
