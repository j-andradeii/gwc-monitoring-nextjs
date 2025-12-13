'use client';

import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Password } from 'primereact/password';
import FormError from './FormError';
import './styles/form-input.css';

interface FormPasswordProps {
  name: string;
  label?: string;
  placeholder?: string;
  showSpinner?: boolean;
  enableOnlyInteger?: boolean;
  readonly?: boolean;
  showRequired?: boolean;
  showLabel?: boolean;
  displayDisabled?: boolean;
  showRightIcon?: boolean;
  rightIcon?: string;
  feedback?: boolean;
}

export const FormPassword: React.FC<FormPasswordProps> = ({
  name,
  label,
  placeholder,
  showRequired = false,
  showLabel = true,
  displayDisabled = false,
  showRightIcon = false,
  feedback = false,
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
    <div className="grid grid-cols-12 gap-0">
      {showLabel && label && (
        <label htmlFor={uniqueId} className="col-span-12">
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}

      <div className="col-span-12 input-container">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => (
            <span className="p-input-icon-right flex">
              {showRightIcon && (
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
              )}

              <Password
                id={field.name}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                className={`w-100 ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''}`}
                feedback={feedback}
                name={uniqueId}
                toggleMask
                placeholder={placeholder}
              />
            </span>
          )}
        />
        {error && <FormError error={error} />}
      </div>
    </div>
  );
};

export default FormPassword;
