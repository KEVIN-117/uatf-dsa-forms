import { useForm, useStore } from '@tanstack/react-form';
import { Loader2, Send } from 'lucide-react';
import type { FormTemplateDef, FormFieldDef } from '@/shared/types/dynamic-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FormContainer } from './FormContainer';
import { useEffect, useMemo } from 'react';

interface DynamicFormProps {
    template: FormTemplateDef;
    onSubmit: (data: Record<string, any>, module: string) => Promise<void>;
    className?: string;
    submitLabel?: string;
    resetForm: boolean;
    setResetForm: (value: boolean) => void;
}

export function DynamicForm({ template, onSubmit, className, submitLabel = "Enviar Reporte", resetForm, setResetForm }: DynamicFormProps) {
    const defaultValues = template.fields.reduce((acc, field) => {
        acc[`${field.id}@${field.name}`] = field.type === 'number' ? '' : '';
        return acc;
    }, {} as Record<string, any>);

    const totalField = useMemo(
        () =>
            template.fields.find(
                (field) => field.name.toLowerCase() === 'total' || field.label.toLowerCase() === 'total',
            ),
        [template.fields],
    );

    const totalKey = useMemo(
        () => (totalField ? `${totalField.id}@${totalField.name}` : null),
        [totalField],
    );

    const form = useForm({
        defaultValues,
        onSubmit: async ({ value, formApi }) => {
            await onSubmit(value, template.module);
            if (resetForm) {
                form.reset();
                formApi.reset();
                setResetForm(false);
            }
        },
    });

    const formValues = useStore(form.store, (state) => state.values);

    useEffect(() => {
        if (!totalField || !totalKey) return;

        const calculatedTotal = template.fields.reduce((sum, field) => {
            if (field.id === totalField.id || field.type !== 'number') {
                return sum;
            }

            const fieldValue = formValues[`${field.id}@${field.name}`];
            const numericValue = typeof fieldValue === 'number' ? fieldValue : Number(fieldValue);

            return sum + (Number.isFinite(numericValue) ? numericValue : 0);
        }, 0);

        const currentTotal = Number(formValues[totalKey]);

        if (!Number.isFinite(currentTotal) || currentTotal !== calculatedTotal) {
            form.setFieldValue(totalKey, calculatedTotal);
        }
    }, [formValues, template.fields, totalField, totalKey, form.setFieldValue]);

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
                // Añadimos step="1" y min="0" para que el navegador sepa que son enteros positivos
                {...(fieldDef.type === 'number' ? { step: "1", min: "0" } : {})}
                // Bloqueamos físicamente las teclas que no corresponden a un entero
                onKeyDown={(e) => {
                    if (fieldDef.type === 'number') {
                        if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }
                }}
                onChange={(e) => {
                    const val = e.target.value;
                    fieldApi.handleChange(fieldDef.type === 'number' ? (val ? parseInt(val, 10) : '') : val);
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
                                if (fieldDef.type === 'number' && value !== '' && !/^\d+$/.test(String(value))) {
                                    return 'Este campo debe ser un número entero (sin decimales)';
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
