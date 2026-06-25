'use client';

import { useCallback } from 'react';
import type { BaseSyntheticEvent } from 'react';
import type { FieldErrors } from 'react-hook-form';

/**
 * Elements that mark a field as being in an error state.
 *
 * - `.p-invalid` — added by every PrimeReact-backed field component
 *   (FormInput/Select/Password/Textarea/InputNumber/Calendar/Checkbox/
 *   RadioButton + the mobile birthdate input) when `fieldState.invalid`.
 * - `[data-form-error]` — added to the message node by `FormError` and to the
 *   wrapper of custom field groups (radio / checkbox / upload fieldsets and the
 *   social-media field-array root) that don't flag a single `.p-invalid` control.
 *
 * Either is a valid anchor to scroll to.
 */
const ERROR_ANCHOR_SELECTOR = '.p-invalid, [data-form-error]';

const FOCUSABLE_TEXT_SELECTOR =
  'input:not([type=checkbox]):not([type=radio]):not([type=file]):not([type=hidden]), textarea';

function isVisible(el: HTMLElement): boolean {
  // getClientRects is empty for display:none / detached nodes but works
  // regardless of position:fixed (unlike offsetParent), so it's reliable
  // inside modals too.
  return el.getClientRects().length > 0;
}

/**
 * Smooth-scroll the first (topmost) errored field into view and, when it's a
 * plain text input, focus it so mobile keyboards open.
 *
 * This restores the native browser "focus + scroll to the first invalid field"
 * behaviour that our Controller-wrapped fields lose, because they don't forward
 * a ref to the underlying control — so React Hook Form's `shouldFocusError` has
 * nothing to focus and the browser never auto-scrolls. Works the same on
 * desktop and mobile.
 *
 * @param root  Limit the search to one form. Falls back to the whole document.
 */
export function scrollToFirstError(root?: HTMLElement | Document | null): void {
  if (typeof window === 'undefined') return;

  // Defer past React's commit + one paint so freshly-failed fields have their
  // `.p-invalid` / `[data-form-error]` markers in the DOM before we query.
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const scope: ParentNode = root ?? document;
      const anchors = Array.from(
        scope.querySelectorAll<HTMLElement>(ERROR_ANCHOR_SELECTOR),
      ).filter(isVisible);

      if (anchors.length === 0) return;

      // First error in document flow = smallest viewport-relative top.
      const target = anchors.reduce((top, el) =>
        el.getBoundingClientRect().top < top.getBoundingClientRect().top ? el : top,
      );

      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const focusable = target.matches(FOCUSABLE_TEXT_SELECTOR)
        ? target
        : target.querySelector<HTMLElement>(FOCUSABLE_TEXT_SELECTOR);

      // preventScroll so focusing doesn't fight the smooth scroll above.
      focusable?.focus?.({ preventScroll: true });
    });
  });
}

/**
 * Returns a React Hook Form `handleSubmit` error handler that scrolls to the
 * first invalid field. Wire it as the 2nd argument:
 *
 *   const scrollToError = useScrollToFirstError();
 *   <form onSubmit={handleSubmit(onValid, scrollToError)} />
 *
 * The search is scoped to the submitted `<form>` (via the submit event), so it
 * stays correct even when several forms are mounted on the same page.
 */
export function useScrollToFirstError() {
  return useCallback((_errors: FieldErrors, event?: BaseSyntheticEvent) => {
    const form =
      event?.target instanceof HTMLElement ? event.target.closest('form') : null;
    scrollToFirstError(form);
  }, []);
}
