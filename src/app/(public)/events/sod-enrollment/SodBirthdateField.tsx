'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormCalendar, CalendarViewType, FormError } from '@/components/forms';

/**
 * DD/MM/YYYY mask helpers. The displayed value always carries the remaining
 * placeholder letters (e.g. "12/1m/yyyy") so the field reads as a live template
 * as the user types — exactly:
 *   dd/mm/yyyy → 1d/mm/yyyy → 12/mm/yyyy → 12/1m/yyyy → 12/10/yyyy
 *             → 12/10/1yyy → 12/10/19yy → 12/10/199y → 12/10/1992
 */
const TEMPLATE = 'dd/mm/yyyy';
const SLASH_POS = new Set([2, 5]);
const DIGIT_SLOTS = [0, 1, 3, 4, 6, 7, 8, 9];

function buildDisplay(digits: string): string {
  let out = '';
  let di = 0;
  for (let i = 0; i < TEMPLATE.length; i++) {
    if (SLASH_POS.has(i)) {
      out += '/';
    } else {
      out += di < digits.length ? digits[di++] : TEMPLATE[i];
    }
  }
  return out;
}

/** Caret index that sits immediately after the n-th entered digit. */
function caretAfter(n: number): number {
  if (n <= 0) return 0;
  if (n >= 8) return TEMPLATE.length;
  let pos = DIGIT_SLOTS[n - 1] + 1;
  if (SLASH_POS.has(pos)) pos += 1; // skip the literal "/" so the next digit lands cleanly
  return pos;
}

/**
 * Convert the entered digits into a Date. Returns undefined while incomplete or
 * when the date is invalid (bad month/day, or a calendar rollover like 31/02).
 */
function digitsToDate(digits: string): Date | undefined {
  if (digits.length !== 8) return undefined;

  const day = parseInt(digits.slice(0, 2), 10);
  const month = parseInt(digits.slice(2, 4), 10);
  const year = parseInt(digits.slice(4, 8), 10);

  if (month < 1 || month > 12) return undefined;
  if (day < 1 || day > 31) return undefined;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined;
  }

  return date;
}

/**
 * SodBirthdateField — desktop (>768 px) renders the PrimeReact Calendar picker
 * unchanged; mobile (≤768 px) renders a plain dd/mm/yyyy masked text input that
 * never opens a calendar overlay.
 *
 * The mask is an append-only controlled input: on every change we keep only the
 * digits, rebuild the display, and pin the caret right after the last digit in a
 * synchronous useLayoutEffect (before paint). This is deterministic and avoids
 * PrimeReact InputMask's async caret-restore race that scrambles fast input.
 * The shared RHF `birthdate` field (Date | undefined) stays in sync.
 */
export default function SodBirthdateField() {
  const { setValue, trigger, formState: { errors } } = useFormContext();

  const birthdateError = (errors.birthdate as { message?: string } | undefined)?.message;

  // Mobile detection — default false so SSR/first client render = desktop
  // (avoids hydration mismatch). Updated once after mount.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');

    // Defer the initial sync to avoid the set-state-in-effect lint rule.
    const t = setTimeout(() => setIsMobile(mq.matches), 0);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mq.addEventListener('change', handleChange);
    return () => {
      clearTimeout(t);
      mq.removeEventListener('change', handleChange);
    };
  }, []);

  const [digits, setDigits] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Pin the caret right after the last entered digit on every change (append-only).
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && document.activeElement === el) {
      const pos = caretAfter(digits.length);
      el.setSelectionRange(pos, pos);
    }
  }, [digits, isMobile]);

  const commit = (next: string) => {
    setDigits(next);
    setValue('birthdate', (digitsToDate(next) ?? undefined) as Date, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  if (!isMobile) {
    return (
      <FormCalendar
        name="birthdate"
        label="Birthdate"
        placeholder="mm/dd/yyyy"
        showRequired
        calendarView={CalendarViewType.DATE}
        format="mm/dd/yy"
      />
    );
  }

  return (
    <div className="grid grid-cols-12 gap-0">
      <label htmlFor="sod-birthdate-mobile" className="col-span-12">
        Birthdate
        <span className="form-required" aria-hidden="true">*</span>
      </label>
      <div className="col-span-12 input-container w-100">
        <input
          ref={inputRef}
          id="sod-birthdate-mobile"
          name="sod-birthdate-mobile"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-label="Birthdate, day slash month slash year"
          className={`p-inputtext w-full${birthdateError ? ' p-invalid' : ''}`}
          value={buildDisplay(digits)}
          onKeyDown={(e) => {
            if (e.key === 'Backspace') {
              e.preventDefault();
              commit(digits.slice(0, -1));
            }
          }}
          onChange={(e) => {
            const next = e.target.value.replace(/\D/g, '').slice(0, 8);
            commit(next);
          }}
          onBlur={() => {
            void trigger('birthdate');
          }}
        />
        {birthdateError && <FormError error={birthdateError} />}
      </div>
    </div>
  );
}
