'use client';

import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from 'primereact/button';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormSelectItem } from '@/models/enums';
import './styles/form-input.css';

const socialMediaOptions: FormSelectItem<string>[] = [
    { label: 'Facebook', value: 'Facebook' },
    { label: 'Instagram', value: 'Instagram' },
    { label: 'Twitter / X', value: 'Twitter' },
    { label: 'TikTok', value: 'TikTok' },
    { label: 'LinkedIn', value: 'LinkedIn' },
    { label: 'Other', value: 'Other' }
];

interface FormSocialMediaProps {
    name: string;
    label?: string;
    showRequired?: boolean;
    className?: string;
}

export const FormSocialMedia: React.FC<FormSocialMediaProps> = ({
    name,
    label = 'Social Media',
    showRequired = false,
    className = ''
}) => {
    const { control, formState: { errors } } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name
    });

    const getNestedError = (errors: Record<string, unknown>, path: string): string | undefined => {
        const parts = path.split('.');
        let current: Record<string, unknown> = errors;
        for (const part of parts) {
            if (!current || !current[part]) return undefined;
            current = current[part] as Record<string, unknown>;
        }
        return (current as { message?: string }).message;
    };

    const error = getNestedError(errors, name);

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={name} className="block mb-2 font-semibold" style={{ color: '#334155' }}>
                    {label}
                    {showRequired && <span className="form-required">*</span>}
                </label>
            )}

            <div className="flex flex-col gap-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex align-items-start gap-2 w-full">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                            <div className="md:col-span-1">
                                <FormSelect
                                    name={`${name}.${index}.platform`}
                                    options={socialMediaOptions}
                                    placeholder="Platform"
                                    showLabel={false}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <FormInput
                                    name={`${name}.${index}.handle`}
                                    placeholder="@username or URL"
                                    showLabel={false}
                                />
                            </div>
                        </div>
                        {fields.length > 1 && (
                            <div className="flex align-items-center justify-content-center" style={{ marginTop: '0.2rem' }}>
                                <Button
                                    type="button"
                                    icon="pi pi-times"
                                    className="p-button-rounded p-button-text form-social-remove-btn"
                                    onClick={() => remove(index)}
                                    aria-label="Remove Social Media"
                                    style={{ width: '40px', height: '40px' }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <div className="mt-2">
                <Button
                    type="button"
                    label="Add another account"
                    icon="pi pi-plus"
                    className="p-button-text p-button-sm form-social-add-btn"
                    onClick={() => append({ platform: '', handle: '' })}
                    style={{ padding: '0.5rem 1rem 0.5rem 0', fontWeight: 600 }}
                />
            </div>
        </div>
    );
};

export default FormSocialMedia;
