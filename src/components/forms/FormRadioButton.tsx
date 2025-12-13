'use client';

import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RadioButton } from 'primereact/radiobutton';
import './styles/form-input.css';

interface FormRadioButtonProps {
  name: string;
  value: string | number | boolean;
  label?: React.ReactNode;
  showLabel?: boolean;
  showRequired?: boolean;
  showRightIcon?: boolean;
  readonly?: boolean;
  displayDisabled?: boolean;
  disabled?: boolean;
}

export const FormRadioButton: React.FC<FormRadioButtonProps> = ({
  name,
  value,
  label,
  showLabel = true,
  showRequired = false,
  showRightIcon = false,
  displayDisabled = false,
  disabled = false,
  readonly = false,
}) => {
  const { control } = useFormContext();

  const reactId = useId();
  const uniqueId = `${name}-${value}-${reactId}`;

  return (
    <div className="p-0 flex align-items-center w-100" style={{ height: '20px' }}>
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

              <RadioButton
                inputId={uniqueId}
                name={field.name}
                value={value}
                checked={field.value === value}
                onChange={(e) => {
                  field.onChange(e.value);
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
          className="col-fixed p-0 mt-1"
          style={{ width: '100%', position: 'relative', top: '2px', flexGrow: 1 }}
        >
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}
    </div>
  );
};

export default FormRadioButton;
