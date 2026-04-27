// src/components/DynamicForm.tsx
import { useForm } from '@tanstack/react-form';
import { Loader2 } from 'lucide-react';
import type { FormTemplateDef, FormFieldDef } from '@/shared/types/dynamic-form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { FormContainer } from './FormContainer';

interface DynamicFormProps {
    template: FormTemplateDef;
    onSubmit: (data: Record<string, any>, module: string) => Promise<void>;
}

export function DynamicForm({ template, onSubmit }: DynamicFormProps) {
    // 1. Generamos los valores iniciales vacíos basados en el JSON
    const defaultValues = template.fields.reduce((acc, field) => {
        acc[`${field.id}@${field.name}`] = field.type === 'number' ? '' : '';
        return acc;
    }, {} as Record<string, any>);

    // 2. Inicializamos TanStack Form
    const form = useForm({
        defaultValues,
        onSubmit: async ({ value }) => {
            await onSubmit(value, template.module);
        },
    });

    // 3. Función auxiliar para renderizar el input correcto según el tipo
    const renderFieldInput = (fieldDef: FormFieldDef, fieldApi: any) => {
        // Si es un SELECT
        if (fieldDef.type === 'select') {
            return (
                <select
                    id={`${fieldDef.id}@${fieldDef.name}`}
                    name={`${fieldDef.id}@${fieldDef.name}`}
                    value={fieldApi.state.value}
                    onBlur={fieldApi.handleBlur}
                    onChange={(e) => fieldApi.handleChange(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus-academic"
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

        // Si es TEXT, NUMBER, EMAIL, PASSWORD (usamos tu Input de Shadcn)
        return (
            <Input
                id={`${fieldDef.id}@${fieldDef.name}`}
                name={`${fieldDef.id}@${fieldDef.name}`}
                type={fieldDef.type}
                placeholder={fieldDef.placeholder}
                value={fieldApi.state.value}
                onBlur={fieldApi.handleBlur}
                onChange={(e) => {
                    const val = e.target.value;
                    // Si es número, lo parseamos para no enviar strings a Firebase
                    fieldApi.handleChange(fieldDef.type === 'number' ? (val ? Number(val) : '') : val);
                }}
                className="focus-academic"
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
                className="space-y-6 font-body"
            >
                {/* Recorremos el JSON y creamos un form.Field por cada uno */}
                {template.fields.map((fieldDef) => (
                    <form.Field
                        key={`${fieldDef.id}@${fieldDef.name}`}
                        name={`${fieldDef.id}@${fieldDef.name}`}
                        validators={{
                            onChange: ({ value }) => {
                                // Validación dinámica simple: Obligatorio
                                if (fieldDef.required && (value === undefined || value === null || value === '')) {
                                    return 'Este campo es obligatorio';
                                }
                                return undefined;
                            },
                        }}
                        children={(fieldApi) => (
                            <div className="space-y-2">
                                <Label htmlFor={`${fieldDef.id}@${fieldDef.name}`} className="font-semibold">
                                    {fieldDef.label} {fieldDef.required && <span className="text-destructive">*</span>}
                                </Label>

                                {renderFieldInput(fieldDef, fieldApi)}

                                {fieldApi.state.meta.errors.length > 0 && (
                                    <div className="text-sm text-destructive font-medium">
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
                            className="w-full font-bold mt-4"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin h-4 w-4" /> Guardando reporte...
                                </span>
                            ) : (
                                "Enviar Reporte"
                            )}
                        </Button>
                    )}
                />
            </form>
        </FormContainer>
    );
}