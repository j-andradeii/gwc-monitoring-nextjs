'use client';

import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox } from 'primereact/checkbox';
import './styles/form-input.css';

interface FormCheckboxProps {
  name: string;
  label?: React.ReactNode;
  placeholder?: string;
  showLabel?: boolean;
  showRequired?: boolean;
  showRightIcon?: boolean;
  readonly?: boolean;
  displayDisabled?: boolean;
  disabled?: boolean;
  binary?: boolean;
  value?: unknown;
  alignItems?: string;
  labelMarginTop?: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({
  name,
  label,
  showLabel = true,
  showRequired = true,
  showRightIcon = false,
  readonly = false,
  displayDisabled = false,
  disabled = false,
  value = null,
  alignItems = 'align-items-center',
  labelMarginTop = '2px',
}) => {
  const { control } = useFormContext();

  const reactId = useId();
  const uniqueId = `${name}-${reactId}`;

  return (
    <div className={`p-0 flex w-100 ${alignItems}`} style={{ height: '20px' }}>
      <div className="col-fixed p-0" style={{ width: '25px', flexShrink: 0 }}>
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

              <Checkbox
                inputId={field.name}
                checked={value != null ? field.value === value : !!field.value}
                onChange={(e) => {
                  const checkBoxValue = value != null ? (e.checked ? value : false) : e.checked;
                  field.onChange(checkBoxValue);
                  field.onBlur();
                }}
                onBlur={field.onBlur}
                className={`w-100 ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''}`}
                disabled={disabled}
                readOnly={readonly}
              />
            </span>
          )}
        />
      </div>
      {showLabel && label && (
        <label
          htmlFor={uniqueId}
          className={`col-fixed p-0 ${displayDisabled ? 'disable' : ''}`}
          style={{
            width: '100%',
            position: 'relative',
            top: labelMarginTop,
            flexGrow: 1,
            whiteSpace: 'pre-line',
          }}
        >
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}
    </div>
  );
};

export default FormCheckbox;
