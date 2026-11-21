---
name: forms
description: |
  Forms in gwc-monitoring-nextjs: Zod 4 schemas in src/models/schemas (shared by the client form and the
  route handler), React Hook Form 7 with zodResolver + FormProvider + mode 'onChange', the PrimeReact field
  wrappers in src/components/forms (FormInput, FormSelect, FormCalendar, FormMaskedDate, FormTextarea,
  FormPassword, FormInputNumber, FormCheckbox, FormRadioButton, FormSocialMedia, ProofOfPaymentField,
  FormError), useScrollToFirstError, JSON vs multipart submission with useMutation, and the success/error
  panels.

  Use when: adding or changing a form, a Zod schema, a field wrapper in src/components/forms, a checkbox or
  radio group, a file upload, a birthdate field, or the route handler that receives a form.

  Keywords: zod, z.object, z.infer, z.date, z.enum, discriminatedUnion, refine, instanceof File, react-hook-form,
  useForm, zodResolver, FormProvider, useFormContext, Controller, useFieldArray, handleSubmit, defaultValues,
  reset, FormInput, FormSelect, FormCalendar, FormMaskedDate, ProofOfPaymentField, useScrollToFirstError,
  data-form-error, p-invalid, FormData, multipart
---

# Forms: Zod + React Hook Form + the `Form*` wrappers

One schema, validated twice: in the browser by `zodResolver` (UX) and in the route handler by `safeParse`
(security). Fields are thin PrimeReact wrappers that read the form from context, so a form is a schema, a
`useForm`, a `FormProvider`, and a list of `<Form* name="…" />`.

```
models/schemas/<x>.schema.ts ── z.object(...) + export type XData = z.infer<typeof xSchema>
        │                                            │
<Name>Client.tsx                                     app/api/<area>/<x>/route.ts
  useForm<XData>({ resolver: zodResolver(xSchema),     xSchema.safeParse(body) → 400 | side effects
                   mode: 'onChange', defaultValues })
  useMutation({ mutationFn, onSuccess: reset + scrollTo top })
  <FormProvider {...methods}>
    <form onSubmit={handleSubmit(onSubmit, scrollToError)}>
      <FormInput name="firstName" label="First Name" showRequired />  …  <button disabled={isPending}>
```

## Files in this skill

| File | What | Load when |
|---|---|---|
| `SKILL.md` | Rules, decision guide, recipe, drift, checklist | Always |
| `references/form-components.md` | Every `Form*` component: props, value type, notes | Using or changing a field component |

## The rules

1. **Schemas live in `src/models/schemas/<kebab>.schema.ts`** and export the schema plus
   `export type <X>Data = z.infer<typeof <x>Schema>` (or `<X>FormData`). The route handler imports the same
   schema. Client-only parts (a `File`) are added with `.extend({ … })` in the client, and the server validates
   the rest. *Why:* one source of truth for field rules and messages.
2. **Zod 4 syntax:** messages via `{ message: '…' }` (`z.date({ message: 'Birthdate is required' })`,
   `z.enum([...], { message })`), not v3 `required_error`. Required strings are
   `z.string().min(1, '<Label> is required')`; optional text is `z.string().optional()`; cross-field rules use
   `.refine(…, { message, path: ['field'] })`; variants use `z.discriminatedUnion('type', [...])`. *Why:* the
   project is on Zod 4; v3 options break typing.
3. **`useForm<XData>({ resolver: zodResolver(xSchema), mode: 'onChange', defaultValues: { … } })`** with every
   field in `defaultValues`: `''` for strings, `[]` for arrays, `undefined` for dates, enums and files (never
   `null`). *Why:* controlled PrimeReact inputs need a value; `null` fails `z.date()`.
4. **Wrap in `<FormProvider {...methods}>` and use the `Form*` components** — they get `control` and errors
   from `useFormContext()`. Don't pass `control`/`register` down. Nested names work (`socialMedia.0.handle`).
   *Why:* every wrapper is built for context.
5. **Submit with `handleSubmit(onSubmit, scrollToError)`** where `const scrollToError = useScrollToFirstError()`.
   *Why:* the Controller-wrapped fields don't forward refs, so RHF can't focus errors itself; this scrolls to the
   first `.p-invalid` / `[data-form-error]` and focuses it.
6. **Custom field groups mark errors themselves:** a raw `Controller` around checkbox/radio groups or uploads
   puts `data-form-error` on its wrapper when `fieldState.invalid` and renders the message with `FormError` (or
   `role="alert"`). *Why:* that's what `scrollToFirstError` looks for.
7. **Submission goes through `useMutation`** (see `api-client`): JSON → `apiClient.post('/api/<route>', data)`;
   with a file → build `FormData` (dates as `toISOString()`, arrays as `JSON.stringify`) and `fetch` it.
   `onSuccess`: `reset()` + `window.scrollTo({ top: 0, behavior: 'smooth' })`. *Why:* same flow on every form.
8. **UI states from the mutation:** submit button `disabled={mutation.isPending}` with
   `<i className="pi pi-spin pi-spinner" />`; `isError` → an inline alert ("Something went wrong. Please try
   again."); `isSuccess` → replace the form with a thank-you panel and a "Submit another" button that calls
   `mutation.reset()` and `reset(defaults)`. *Why:* no `useState` flags.
9. **Labels and required marks come from props:** `label`, `showRequired` (adds `<span className="form-required">*</span>`),
   `placeholder`. Field copy is the owner's; don't invent new helper text. *Why:* consistent markup and copy.
10. **Uploads use `ProofOfPaymentField`** (or its logic): magic-byte MIME sniffing, best-effort WebP
    conversion, 4 MB client guard, preview with Change/Remove; validate with `proofOfPaymentFileSchema`
    (`.optional()` when the proof can come later). *Why:* phone photos (HEIC, temp screenshots) broke uploads
    before; this component handles them.
11. **Birthdates:** `FormMaskedDate` (desktop calendar, mobile masked `dd/mm/yyyy` input) for public forms;
    `FormCalendar` with `calendarView={CalendarViewType.DATE}` and `format="mm/dd/yy"` where a picker is fine.
    The server formats in `Asia/Manila` and prefixes `'` before writing to Sheets. *Why:* avoids off-by-one days
    and Sheets date coercion.
12. **A new reusable field goes in `src/components/forms/`**, follows the wrapper shape (`'use client'`,
    `useFormContext`, `Controller`, `useId()`-based id, `p-invalid` on invalid, `FormError` below, styles from
    `styles/form-input.css`), and is exported from `components/forms/index.ts`. *Why:* keeps every field
    consistent with scroll-to-error and the design tokens.

## Decision guide

| Need | Use | Example in this repo |
|---|---|---|
| Text / phone / number-ish text | `FormInput` (`enablePhoneNumberFormat`, `enableOnlyInteger`, `type`, `inputMode`) | `VipFormClient.tsx` |
| Long text | `FormTextarea` (`rows`, `autoResize`, `maxLength` + `showCount`) | `components/landing/ContactSection.tsx` |
| Dropdown | `FormSelect` with `FormSelectItem[]` (`{ label, value }`) options | `SodEnrollmentClient.tsx` (class) |
| One checkbox (consent) | `FormCheckbox` (`binary`) | — |
| Checkbox group (many values) | raw `Controller` + PrimeReact `Checkbox`, wrapper with `data-form-error` | `SodEnrollmentClient.tsx` (status) |
| Radio group | `FormRadioButton` per option, or raw `Controller` + `RadioButton` | `SodEnrollmentClient.tsx` (category) |
| Birthdate | `FormMaskedDate` | `LifeclassEnrollmentClient.tsx` |
| Social handles (repeatable) | `FormSocialMedia` (`useFieldArray`) | `VipFormClient.tsx` |
| Password | `FormPassword` (`toggleMask`, `feedback`) | `app/(auth)/signin/page.tsx` |
| Proof-of-payment image | `ProofOfPaymentField` + `proofOfPaymentFileSchema` | `LifeclassEnrollmentClient.tsx` |
| Variant forms (prayer vs join) | `z.discriminatedUnion('type', …)` | `models/schemas/contact.schema.ts` |

## Where things live

| Path | What |
|---|---|
| `src/components/forms/` (+ `index.ts`) | the wrappers, `FormError`, `useScrollToFirstError`/`scrollToFirstError`, `styles/form-input.css` |
| `src/models/schemas/` | `auth`, `church`, `contact`, `event-registration`, `giving-confirmation`, `lifeclass`, `member`, `proof-of-payment`, `sod`, `vip` schemas |
| `src/models/enums/index.ts` | `FormSelectItem<T>`, enums and option arrays (`GENDER_OPTIONS`, …) |
| `src/core/form-message.ts`, `src/core/messages.ts`, `src/core/constants.ts` | `FORM_MESSAGES`, `Messages`, `FORM_CONST` (patterns), `VALIDATION` (limits) |
| `src/lib/image-mime.ts`, `src/lib/image-to-webp.ts` | upload helpers |
| `src/styles/vip-form.css`, `src/styles/landing.css` | public form layouts (`form-section`, `form-row`, `vip-submit-button`, `sod-upload-*`) |

## Recipe: public JSON form

```tsx
'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { FormInput, useScrollToFirstError } from '@/components/forms';
import { apiClient } from '@/services/api-client';
import { pledgeSchema, type PledgeData } from '@/models/schemas/pledge.schema';

const DEFAULTS: PledgeData = { name: '', email: '', phone: '' };

export default function PledgeClient() {
  const methods = useForm<PledgeData>({ resolver: zodResolver(pledgeSchema), mode: 'onChange', defaultValues: DEFAULTS });
  const { handleSubmit, reset } = methods;
  const scrollToError = useScrollToFirstError();

  const submitPledge = useMutation({
    mutationFn: (data: PledgeData) => apiClient.post('/api/inquiry/pledge', data),
    onSuccess: () => {
      reset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  if (submitPledge.isSuccess) return (/* thank-you panel; "Submit another" → submitPledge.reset(); reset(DEFAULTS); */);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => submitPledge.mutate(data), scrollToError)}>
        {submitPledge.isError && <div className="form-error-alert">Something went wrong. Please try again.</div>}
        <FormInput name="name" label="Name" showRequired />
        <button type="submit" disabled={submitPledge.isPending}>
          {submitPledge.isPending ? <i className="pi pi-spin pi-spinner" /> : 'Submit'}
        </button>
      </form>
    </FormProvider>
  );
}
```

## Legacy and drift

Don't copy any of these.

- `getNestedError` is copy-pasted into `FormInput`, `FormSelect`, `FormCalendar` (and others) → a new wrapper can use `fieldState.error?.message` from `Controller`; extracting a shared helper is a separate task.
- Props declared but unused in wrappers (`showSpinner`, `rightIcon`, `readonly` in some, `maxDateStr` and `showTimeOnlyFooter` in `FormCalendar`; the right icon is always `pi pi-user`) → don't rely on them; check `references/form-components.md`.
- `SodEnrollmentClient.tsx` re-implements the upload field inline (preview via `useEffect` + `setState`) → new forms use `ProofOfPaymentField`.
- `auth.schema.ts` `registerSchema` messages contain literal `${min}` / `${max}` placeholders (not interpolated) → write the number in the message.
- Some schemas use `z.string().email()` (still valid in Zod 4, but `z.email()` is the v4 form) → either is accepted; don't mix within one schema.
- VIP form duplicates its `defaultValues` in the "Submit another" handler → keep defaults in one `const DEFAULTS`.
- Route handlers return `error.flatten()` for 400s; `lifeclass-enrollment` returns `error.issues` → new handlers follow the majority (`flatten()`).

## Checklist before shipping

- [ ] Schema in `src/models/schemas`, type via `z.infer`, imported by the route handler too
- [ ] Zod 4 syntax only: `git diff -U0 -- src | grep -E "^\+.*required_error|invalid_type_error"` is empty
- [ ] Every field has a default (`''`, `[]`, `undefined`); none are `null`
- [ ] `FormProvider` + `Form*` wrappers; `handleSubmit(onSubmit, scrollToError)`
- [ ] Custom groups set `data-form-error` when invalid
- [ ] Pending / error / success states from the mutation; button disabled while pending
- [ ] Submitting against real services is an M line for the owner (`CLAUDE.md`)

## Related skills

- [`api-client`](../api-client/SKILL.md): `useMutation`, `apiClient.post`
- [`security`](../security/SKILL.md): route-handler validation, uploads, Sheets formula safety
- [`ui-ux`](../ui-ux/SKILL.md): form styling, invalid state colour (`--velvet`)
