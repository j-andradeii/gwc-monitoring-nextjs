'use client';

import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import FormError from './FormError';
import './styles/form-input.css';

interface FormInputNumberProps {
  name: string;
  label?: string;
  showLabel?: boolean;
  showRequired?: boolean;
  showRightIcon?: boolean;
  readonly?: boolean;
  displayDisabled?: boolean;
  placeholder?: string;
  disabled?: boolean;
  max?: number | null;
  min?: number;
}

export const FormInputNumber: React.FC<FormInputNumberProps> = ({
  name,
  label,
  placeholder = '',
  readonly = false,
  showLabel = true,
  showRequired = false,
  showRightIcon = false,
  displayDisabled = false,
  disabled = false,
  max = null,
  min = 0,
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
    <>
      <div className="grid grid-nogutter">
        {showLabel && label && (
          <label htmlFor={uniqueId} className="col-12">
            {label}
            {showRequired && <span className="form-required">*</span>}
          </label>
        )}

        <div className="col-12 input-container">
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

                <InputNumber
                  className={`w-100 ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''}`}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.value);
                    field.onBlur();
                  }}
                  onKeyDown={(e) => e.preventDefault()}
                  onBlur={field.onBlur}
                  placeholder={placeholder}
                  readOnly={readonly}
                  id={uniqueId}
                  name={uniqueId}
                  disabled={disabled}
                  showButtons
                  buttonLayout="horizontal"
                  step={1}
                  decrementButtonClassName="p-button-danger"
                  incrementButtonClassName="p-button-success"
                  incrementButtonIcon="pi pi-plus"
                  decrementButtonIcon="pi pi-minus"
                  max={max ?? undefined}
                  min={min}
                />
              </span>
            )}
          />
          {error && <FormError error={error} />}
        </div>
      </div>
    </>
  );
};

export default FormInputNumber;
