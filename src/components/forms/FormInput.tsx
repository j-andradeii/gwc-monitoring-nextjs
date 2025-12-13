'use client';

import React, { useId } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, useFormContext } from 'react-hook-form';
import FormError from './FormError';
import './styles/form-input.css';

// Input processing utilities
interface InputProcessingOptions {
  enableOnlyInteger?: boolean;
  enablePhoneNumberFormat?: boolean;
  enableAllowNumbersSpacesPlusDash?: boolean;
  enableCreditCardInputFormat?: boolean;
}

/**
 * Validates if the input contains only integers
 * @returns true if valid, false if invalid
 */
const validateIntegerOnly = (value: string): boolean => {
  return value === '' || /^[0-9]+$/.test(value);
};

/**
 * Formats a string as a phone number
 */
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digits
  let input = value.replace(/\D/g, '');

  // Ensure it starts with '+' sign
  if (!value.startsWith('+')) {
    input = '+' + input;
  }

  // Format the input as a phone number with country code
  let formattedInput = '';
  if (input.length > 1) {
    formattedInput = `${input.slice(0, 3)}`; // Country code (+XX)
    if (input.length > 3) {
      formattedInput += ` ${input.slice(3, 6)}`; // First part of the number
      if (input.length > 6) {
        formattedInput += ` ${input.slice(6, 10)}`; // Second part of the number
        if (input.length > 10) {
          formattedInput += ` ${input.slice(10, 14)}`; // Third part of the number
        } else {
          formattedInput += input.slice(10);
        }
      } else {
        formattedInput += input.slice(6);
      }
    } else {
      formattedInput += input.slice(3);
    }
  } else {
    formattedInput = input;
  }

  return formattedInput;
};

/**
 * Formats a string to allow only numbers, spaces, plus signs, and dashes
 */
const formatAllowNumbersSpacesPlusDash = (value: string): string => {
  return value.replace(/[^0-9 \-+]/g, '');
};

const formatCreditCardInputFormat = (value: string): string => {
  const formatted = value.replace(/\D/g, '');
  return formatted.replace(/(\d{1,4})/g, '$1 ').trim();
};

/**
 * Process input through validation and formatting pipeline
 * @returns formatted value or null if validation fails
 */
const processInput = (value: string, options: InputProcessingOptions): string | null => {
  let processedValue = value;

  // Validation phase - return null if validation fails
  if (options.enableOnlyInteger && !validateIntegerOnly(value)) {
    return null;
  }

  // Formatting phase - apply formatters in sequence
  if (options.enablePhoneNumberFormat) {
    processedValue = formatPhoneNumber(processedValue);
  }

  if (options.enableAllowNumbersSpacesPlusDash) {
    processedValue = formatAllowNumbersSpacesPlusDash(processedValue);
  }

  if (options.enableCreditCardInputFormat) {
    processedValue = formatCreditCardInputFormat(processedValue);
  }

  return processedValue;
};

interface FormInputProps {
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
  enablePhoneNumberFormat?: boolean;
  enableAllowNumbersSpacesPlusDash?: boolean;
  enableCreditCardInputFormat?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  placeholder,
  enableOnlyInteger = false,
  readonly = false,
  showRequired = false,
  showLabel = true,
  displayDisabled = false,
  showRightIcon = false,
  enablePhoneNumberFormat = false,
  enableAllowNumbersSpacesPlusDash = false,
  enableCreditCardInputFormat = false,
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

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: { onChange: (value: string) => void; onBlur: () => void }
  ) => {
    const value = e.clipboardData.getData('text/plain');
    const processedValue = processInput(value, {
      enableOnlyInteger,
      enablePhoneNumberFormat,
      enableAllowNumbersSpacesPlusDash,
      enableCreditCardInputFormat,
    });

    if (processedValue !== null) {
      field.onChange(processedValue);
      setTimeout(() => {
        field.onBlur();
      }, 0);
    }

    e.preventDefault();
  };

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
            <span className="p-input-icon-right w-100 flex">
              {showRightIcon && (
                <span className="p-inputgroup-addon">
                  <i className="pi pi-user"></i>
                </span>
              )}

              <InputText
                className={`w-100 ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''}`}
                value={field.value || ''}
                onPaste={(e) => handlePaste(e, field)}
                onChange={(e) => {
                  const value = e.target.value;
                  const processedValue = processInput(value, {
                    enableOnlyInteger,
                    enablePhoneNumberFormat,
                    enableAllowNumbersSpacesPlusDash,
                    enableCreditCardInputFormat,
                  });

                  if (processedValue !== null) {
                    field.onChange(processedValue);
                  }
                }}
                onBlur={field.onBlur}
                placeholder={placeholder}
                readOnly={readonly}
                id={uniqueId}
                name={uniqueId}
                autoComplete="off"
              />
            </span>
          )}
        />
        {error && <FormError error={error} />}
      </div>
    </div>
  );
};

export default FormInput;
