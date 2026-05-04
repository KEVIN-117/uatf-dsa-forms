// src/components/DynamicForm.tsx
import { useForm, useStore } from '@tanstack/react-form';
import { Loader2, Send } from 'lucide-react';
import type { FormTemplateDef, FormFieldDef } from '@/shared/types/dynamic-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FormContainer } from './FormContainer';
import { useEffect } from 'react';

interface DynamicFormProps {
    template: FormTemplateDef;
    onSubmit: (data: Record<string, any>, module: string) => Promise<void>;
    className?: string;
    submitLabel?: string;
}

export function DynamicForm({ template, onSubmit, className, submitLabel = "Enviar Reporte" }: DynamicFormProps) {
    const defaultValues = template.fields.reduce((acc, field) => {
        acc[`${field.id}@${field.name}`] = field.type === 'number' ? '' : '';
        return acc;
    }, {} as Record<string, any>);

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            await onSubmit(value, template.module);
        },
    });

    const formValues = useStore(form.store, (state) => state.values);

    useEffect(() => {
        const totalField = template.fields.find((field) => field.name.toLowerCase() === 'total' || field.label.toLowerCase() === 'total')
        if (!totalField) return;

        let calculateTotal = 0;
        Object.entries(formValues).forEach(([key, value]) => {
            const fieldId = key.split("@")[0]

            const fieldDef = template.fields.find((field) => field.id === fieldId || field.name === key)
            if (fieldDef && fieldDef.type === "number" && fieldDef.id !== totalField.id) {
                calculateTotal += Number(value) || 0;
            }
        })

        const totalKey = Object.keys(formValues).find((key) => key.startsWith(`${totalField.id}@`) || key === totalField.name);

        if (totalKey && formValues[totalKey] !== calculateTotal) {
            form.setFieldValue(totalKey, calculateTotal);
        }

    }, [formValues, template.fields, form.setFieldValue]);

    const renderFieldInput = (fieldDef: FormFieldDef, fieldApi: any) => {
        const isTotal = fieldDef.name.toLowerCase() === 'total' || fieldDef.label.toLowerCase() === 'total';

        if (fieldDef.type === 'select') {
            return (
                <select
                    id={`${fieldDef.id}@${fieldDef.name}`}
                    name={`${fieldDef.id}@${fieldDef.name}`}
                    value={fieldApi.state.value}
                    onBlur={fieldApi.handleBlur}
                    onChange={(e) => fieldApi.handleChange(e.target.value)}
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-2 text-sm shadow-sm focus-academic transition-all duration-200 form-field-premium"
                >
                    <option value="" disabled>Selecciona una opción</option>
                    {fieldDef.options?.map((opt) => (
                        <option key={opt.value} value={opt.label}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <Input
                id={`${fieldDef.id}@${fieldDef.name}`}
                name={`${fieldDef.id}@${fieldDef.name}`}
                type={fieldDef.type}
                placeholder={fieldDef.placeholder}
                value={fieldApi.state.value}
                onBlur={fieldApi.handleBlur}
                disabled={isTotal}
                onChange={(e) => {
                    const val = e.target.value;
                    fieldApi.handleChange(fieldDef.type === 'number' ? (val ? Number(val) : '') : val);
                }}
                className={`h-11 rounded-xl form-field-premium focus-academic ${isTotal ? 'bg-muted/40 font-bold text-primary border-primary/20' : ''}`}
            />
        );
    };

    return (
        <FormContainer title={template.title} description={template.description || ''}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
                className={`space-y-5 font-body ${className}`}
            >
                {/* Recorremos el JSON y creamos un form.Field por cada uno */}
                {template.fields.map((fieldDef, index) => (
                    <form.Field
                        key={`${fieldDef.id}@${fieldDef.name}`}
                        name={`${fieldDef.id}@${fieldDef.name}`}
                        validators={{
                            onChange: ({ value }) => {
                                if (fieldDef.required && (value === undefined || value === null || value === '')) {
                                    return 'Este campo es obligatorio';
                                }
                                return undefined;
                            },
                        }}
                        children={(fieldApi) => (
                            <div
                                className={`space-y-2 animate-fade-up`}
                                style={{ animationDelay: `${index * 0.03}s` }}
                            >
                                <Label htmlFor={`${fieldDef.id}@${fieldDef.name}`} className="font-semibold text-sm">
                                    {fieldDef.label}
                                    {fieldDef.required && <span className="text-destructive ml-1">*</span>}
                                </Label>

                                {renderFieldInput(fieldDef, fieldApi)}

                                {fieldApi.state.meta.errors.length > 0 && (
                                    <div className="text-xs text-destructive font-medium pl-1 flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-destructive inline-block" />
                                        {fieldApi.state.meta.errors.join(', ')}
                                    </div>
                                )}
                            </div>
                        )}
                    />
                ))}

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            className="w-full font-bold mt-6 py-6 text-base hover-lift gap-2"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" /> Guardando reporte...
                                </span>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    {submitLabel}
                                </>
                            )}
                        </Button>
                    )}
                />
            </form>
        </FormContainer>
    );
}