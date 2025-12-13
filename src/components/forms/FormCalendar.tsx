'use client';

import React, { useId, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { useBodyClick } from '@/hooks/useBodyClick';
import FormError from './FormError';
import './styles/form-input.css';

export enum CalendarViewType {
  DATE = 'date',
  MONTH = 'month',
  YEAR = 'year',
}

interface FormCalendarProps {
  name: string;
  label?: string;
  placeholder?: string;
  showSpinner?: boolean;
  readonly?: boolean;
  showRequired?: boolean;
  showLabel?: boolean;
  displayDisabled?: boolean;
  showRightIcon?: boolean;
  rightIcon?: string;
  calendarView?: CalendarViewType;
  format?: string;
  minDateStr?: string | null;
  maxDateStr?: string | null;
  showTime?: boolean;
  showButtonBar?: boolean;
  timeOnly?: boolean;
  showTimeOnlyFooter?: boolean;
  isStudentCommencedAndFinishedDates?: boolean;
}

export const FormCalendar: React.FC<FormCalendarProps> = ({
  name,
  label,
  placeholder,
  showRequired = false,
  showLabel = true,
  displayDisabled = false,
  showRightIcon = false,
  calendarView = CalendarViewType.MONTH,
  format = 'yy',
  minDateStr = null,
  showTime = false,
  showButtonBar = false,
  timeOnly = false,
}) => {
  const calendarInstanceRef = useRef<Calendar>(null);
  const triggerBodyClick = useBodyClick();

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

                <Calendar
                  ref={(el) => {
                    if (typeof field.ref === 'function') {
                      field.ref(el);
                    }
                    calendarInstanceRef.current = el;
                  }}
                  id={field.name}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.value);
                    triggerBodyClick();
                  }}
                  onBlur={field.onBlur}
                  className={`w-100 ${fieldState.invalid ? 'p-invalid' : ''} ${displayDisabled ? 'disable' : ''}`}
                  name={uniqueId}
                  placeholder={placeholder}
                  view={calendarView}
                  showTime={showTime}
                  minDate={minDateStr ? new Date(minDateStr) : undefined}
                  showButtonBar={showButtonBar}
                  timeOnly={timeOnly}
                  dateFormat={format}
                  hourFormat="12"
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

export default FormCalendar;
