'use client';

import React, { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import FormError from './FormError';
import './styles/form-input.css';

interface FormTextareaProps {
  name: string;
  label?: string;
  placeholder?: string;
  showRequired?: boolean;
  showLabel?: boolean;
  displayDisabled?: boolean;
  readonly?: boolean;
  rows?: number;
  cols?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  className?: string;
  textareaClassName?: string;
  labelClassName?: string;
  isFloating?: boolean;
}

const getNestedError = (errors: Record<string, unknown>, path: string): string | undefined => {
  const parts = path.split('.');
  let current: Record<string, unknown> = errors;

  for (const part of parts) {
    if (!current[part]) return undefined;
    current = current[part] as Record<string, unknown>;
  }

  return (current as { message?: string }).message;
};

export const FormTextarea = React.memo<FormTextareaProps>(({
  name,
  label,
  placeholder,
  showRequired = false,
  showLabel = true,
  displayDisabled = false,
  readonly = false,
  rows = 4,
  cols,
  autoResize = false,
  maxLength,
  showCount = false,
  className = '',
  textareaClassName = '',
  labelClassName = '',
  isFloating = false,
}) => {
  const { control, formState: { errors } } = useFormContext();



  const error = getNestedError(errors, name);
  const reactId = useId();
  const uniqueId = `${name}-${reactId}`;

  return (
    <div className={`grid grid-cols-12 gap-0 ${className}`}>
      {showLabel && label && !isFloating && (
        <label htmlFor={uniqueId} className={`col-span-12 ${labelClassName}`}>
          {label}
          {showRequired && <span className="form-required">*</span>}
        </label>
      )}

      <div className="col-span-12 input-container">
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState }) => {
            const currentLength = (field.value as string)?.length || 0;

            return (
              <>
                <InputTextarea
                  id={uniqueId}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  placeholder={placeholder}
                  rows={rows}
                  cols={cols}
                  autoResize={autoResize}
                  maxLength={maxLength}
                  className={`w-full ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''} ${textareaClassName}`}
                  readOnly={readonly}
                  name={uniqueId}
                  style={{ width: '100%' }}
                />

                {showCount && maxLength && (
                  <div className="text-right">
                    <small className="text-gray-500">
                      {currentLength}/{maxLength}
                    </small>
                  </div>
                )}
              </>
            );
          }}
        />
        {isFloating && label && (
          <label htmlFor={uniqueId} className={labelClassName}>
            {label}
          </label>
        )}
        {error && <FormError error={error} />}
      </div>
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
