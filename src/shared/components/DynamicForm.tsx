import { revalidateLogic, useForm, useStore } from '@tanstack/react-form';
import { Loader2, Send, X } from 'lucide-react';
import type { FormTemplateDef, FormFieldDef } from '@/shared/types/dynamic-form';
import type { ModalityLimits } from '#/features/reports/hooks/useSubmittedModalidades';
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
    initialValues?: Record<string, unknown> | null;
    editingIndex?: number | null;
    cancelEdit?: () => void;
    modalityLimits?: ModalityLimits;
    isEditing?: boolean;
    onCancelEdit?: () => void;
}

export function DynamicForm({ template, onSubmit, className, submitLabel = "Enviar Reporte", resetForm, setResetForm, initialValues, editingIndex, cancelEdit, modalityLimits, isEditing, onCancelEdit }: DynamicFormProps) {
    // Compute defaultValues from initialValues when in edit mode,
    // so the form mounts already pre-filled instead of relying on setFieldValue after mount
    const defaultValues = useMemo(() => {
        const base: Record<string, any> = {};

        template.fields.forEach((field) => {
            const key = `${field.id}@${field.name}`;
            if (isEditing && initialValues) {
                // Single-record edit: initialValues keys are raw field names (e.g. "nombre")
                base[key] = initialValues[field.name] ?? '';
            } else if (initialValues && !isEditing) {
                // Bulk edit: initialValues keys are already composite (field.id@field.name)
                base[key] = initialValues[key] ?? '';
            } else {
                base[key] = '';
            }
        });

        return base;
    }, [template.fields, isEditing, initialValues]);

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
        onSubmit: async ({ value }) => {
            await onSubmit(value, template.module);
        },
        validationLogic: revalidateLogic(),
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
    useEffect(() => {
        if (resetForm) {
            form.reset();
            setResetForm(false);
        }
    }, [resetForm, form, setResetForm]);

    // Encontrar la key del campo "modalidad" para usarlo en validación cruzada
    const modalityFieldKey = useMemo(() => {
        const modalityField = template.fields.find(
            (f) => f.type === 'select' && (f.name === 'modalidad' || f.label.toLowerCase().includes('modalidad'))
        );
        return modalityField ? `${modalityField.id}@${modalityField.name}` : null;
    }, [template.fields]);

    /**
     * Obtiene el límite máximo para un campo numérico basado en la modalidad seleccionada.
     * Retorna undefined si no hay límite aplicable.
     */
    const getFieldLimit = (fieldName: string): number | undefined => {
        if (!modalityLimits || !modalityFieldKey) return undefined;
        const selectedModalidad = String(formValues[modalityFieldKey] ?? '');
        if (!selectedModalidad) return undefined;
        return modalityLimits[selectedModalidad]?.[fieldName];
    };

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
                {...(fieldDef.type === 'number' ? { step: "1", min: "0" } : {})}
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
                                // Validación de límites por modalidad
                                if (fieldDef.type === 'number' && value !== '' && modalityLimits) {
                                    const limit = getFieldLimit(fieldDef.name);
                                    if (limit !== undefined) {
                                        const numValue = Number(value);
                                        if (Number.isFinite(numValue) && numValue > limit) {
                                            return `El valor no puede ser mayor a ${limit} (límite del formulario anterior)`;
                                        }
                                    }
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

                <div className="flex flex-row w-full justify-between gap-4">
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
                    {(editingIndex !== null || isEditing) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={editingIndex !== null ? cancelEdit : onCancelEdit}
                            className="w-full font-bold mt-6 py-6 text-base hover-lift gap-2"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Cancelar edición
                        </Button>
                    )}
                </div>
            </form>

        </FormContainer>
    );
}
