# Form components (`src/components/forms`, 2026-11-21)

All are client components that read `control` and `errors` from `useFormContext()`, so they must sit inside
`<FormProvider>`. Every one takes `name` (RHF path, nested allowed). Import from `@/components/forms`.

Common props on most fields: `label`, `showLabel` (default `true`), `showRequired` (red `*`), `placeholder`,
`displayDisabled` (adds `disable` class), `readonly`, `showRightIcon` (always renders `pi pi-user`). Invalid
fields get `p-invalid`; the message renders through `FormError` (`<small class="p-error" data-form-error>`).

| Component | Export | PrimeReact | Value type | Specific props / notes |
|---|---|---|---|---|
| `FormInput` | named + default, `React.memo` | `InputText` | `string` | `enableOnlyInteger`, `enablePhoneNumberFormat` (`+CC XXX XXXX XXXX`), `enableAllowNumbersSpacesPlusDash`, `enableCreditCardInputFormat`, `type`, `inputMode`, `isFloating`, `className`, `inputClassName`, `labelClassName`. Formatters also run on paste. `autoComplete="off"`. |
| `FormTextarea` | named + default, `React.memo` | `InputTextarea` | `string` | `rows`, `cols`, `autoResize`, `maxLength`, `showCount`, `isFloating`, `className`, `textareaClassName`, `labelClassName` |
| `FormSelect` | named + default | `Dropdown` | option `value` | `options: FormSelectItem<unknown>[]` (`{ label, value, icon? }`, `optionLabel="label"`), `disabled`, `optionDisabled`, `isFloating`, `className`, `dropdownClassName`, `labelClassName`. Calls `onBlur` after change (validates immediately). |
| `FormInputNumber` | named + default | `InputNumber` | `number` | `min`, `max`, `disabled` |
| `FormPassword` | named + default | `Password` | `string` | `feedback` (strength meter, default `false`); `toggleMask` always on |
| `FormCalendar` | named + default; `CalendarViewType` enum (`DATE`, `MONTH`, `YEAR`) | `Calendar` | `Date` | `calendarView` (default `MONTH`), `format` (default `'yy'`), `minDateStr`, `showTime`, `showButtonBar`, `timeOnly`; mask `99/99/9999`. `maxDateStr`, `showTimeOnlyFooter` declared but unused. |
| `FormMaskedDate` | default | `FormCalendar` (desktop) / native masked text input (≤768 px) | `Date \| undefined` | `label` (default `'Birthdate'`), `showRequired` (default `true`), `placeholder` (default `'mm/dd/yyyy'`); mobile input is `dd/mm/yyyy` |
| `FormCheckbox` | named + default | `Checkbox` | `boolean` or `value \| false` | `binary`, `value` (when set, checked = `field.value === value`, unchecked sets `false` — not an array), `disabled`, `alignItems`, `labelMarginTop`; `label` may be a ReactNode |
| `FormRadioButton` | named + default | `RadioButton` | `string \| number \| boolean` | one per option; `value` (required), `disabled`; `label` may be a ReactNode |
| `FormSocialMedia` | named + default | `FormSelect` + `FormInput` rows, PrimeReact `Button` | `{ platform: string; handle: string }[]` | `useFieldArray` add/remove rows; `label`, `showRequired`, `className` |
| `ProofOfPaymentField` | default | native `<input type="file">` | `File \| undefined` | `name` (default `'proofOfPayment'`), `label`, `sublabel`, `required`; MIME sniffing (`resolveImageMime`), WebP conversion (`convertImageToWebp`), 4 MB guard, preview, Change/Remove, `data-form-error` on invalid |
| `FormError` | default | — | — | `error?: string` |
| `useScrollToFirstError` / `scrollToFirstError` | named | — | — | `handleSubmit(onValid, useScrollToFirstError())`; scrolls to the first `.p-invalid, [data-form-error]` inside the submitted form and focuses text inputs |

## Schemas (`src/models/schemas`)

| File | Exports |
|---|---|
| `auth.schema.ts` | `loginSchema`/`LoginFormData`, `registerSchema`/`RegisterFormData` |
| `contact.schema.ts` | `contactSchema` (discriminated `prayer` / `join`), `joinSchema`, `simpleContactSchema`, `eventContactSchema`, `gatewayPledgeSchema` + types |
| `vip.schema.ts` | `vipFormSchema`/`VipFormData` |
| `sod.schema.ts` | `sodEnrollmentSchema`/`SodEnrollmentData`, `SOD_PROOF_MAX_BYTES` (10 MB), `SOD_PROOF_ACCEPT` (`image/*`) |
| `proof-of-payment.schema.ts` | `proofOfPaymentFileSchema` (client-only `File` check) |
| `event-registration.schema.ts`, `lifeclass.schema.ts`, `giving-confirmation.schema.ts` | paid-event, Lifeclass and giving forms |
| `member.schema.ts`, `church.schema.ts` | admin forms |
