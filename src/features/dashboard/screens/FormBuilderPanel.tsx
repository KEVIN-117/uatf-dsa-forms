import {
    Copy,
    Plus,
    Save,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DynamicForm } from '#/shared/components/DynamicForm';
import { useProtectedRoute } from '#/features/auth/hooks/useProtectedRoute';
import {
    useFormTemplates,
    useUpsertFormTemplate,
} from '#/shared/hooks/useFormBuilder';
import { Button } from '#/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/ui/card';
import { Input } from '#/shared/ui/input';
import { Label } from '#/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/shared/ui/select';
import { Switch } from '#/shared/ui/switch';
import { Textarea } from '#/shared/ui/textarea';
import type { FormModules, FormFieldDef, FormTemplateDef } from '#/shared/types/dynamic-form';
import { toast } from "sonner";
import { createBlankTemplate, createDefaultField, generateTemplateId, moduleOptions, normalizeField, normalizeTemplate, toastStyles } from '#/features/dynamic-form/utils';
import { BuilderSkeleton } from '#/features/dynamic-form/components/BuilderSkeleton';
import { StatePanel } from '#/features/dynamic-form/components/StatePanel';
import { FieldEditor } from '#/features/dynamic-form/components/FieldEditor';

export default function FormBuilderPanel() {
    const { isLoading, isAuthenticated } = useProtectedRoute();
    const { data: templates = [], isPending, isError, error } = useFormTemplates();
    const { mutateAsync: upsertTemplate, isPending: isPendingUpsertTemplate } = useUpsertFormTemplate();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('new');
    const [draft, setDraft] = useState<FormTemplateDef>(() => createBlankTemplate());

    useEffect(() => {
        if (selectedTemplateId === 'new') {
            setDraft(createBlankTemplate());
            return;
        }
        const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);
        if (selectedTemplate) {
            setDraft(normalizeTemplate(selectedTemplate));
        }
    }, [selectedTemplateId, templates]);

    const previewTemplate = useMemo(() => normalizeTemplate(draft), [draft]);

    if (isLoading || isPending) return <BuilderSkeleton />;
    if (!isAuthenticated) return null;

    if (isError) {
        return (
            <StatePanel
                title="No se pudo cargar el builder"
                description={error instanceof Error ? error.message : 'No fue posible leer las plantillas desde Firestore.'}
            />
        );
    }

    const handleSave = async () => {
        const cleaned = normalizeTemplate(draft);

        if (!cleaned.id.trim() || !cleaned.title.trim()) {
            toast.error('Campos incompletos', {
                description: 'El identificador y el título son obligatorios.',
                style: toastStyles.error,
            });
            return;
        }

        if (cleaned.fields.length === 0) {
            toast.warning('Plantilla vacía', {
                description: 'Agrega al menos un campo antes de guardar.',
                style: toastStyles.warning,
            });
            return;
        }

        try {
            await upsertTemplate(cleaned);
            setSelectedTemplateId(cleaned.id);
            toast.success('Plantilla guardada', {
                description: 'Los cambios se han guardado correctamente en la base de datos.',
                duration: 3000,
                style: toastStyles.success,
            });
        } catch (_err) {
            toast.error('Error al guardar', {
                description: 'Hubo un problema al intentar guardar la plantilla.',
                style: toastStyles.error,
            });
        }
    };

    const handleCreateNew = () => {
        setSelectedTemplateId('new');
    };

    const handleLoadTemplate = (templateId: string) => {
        setSelectedTemplateId(templateId);
    };

    const handleDuplicate = () => {
        const duplicated = normalizeTemplate({
            ...draft,
            id: generateTemplateId(draft.title || 'template'),
            title: draft.title ? `Copia de ${draft.title}` : 'Nueva plantilla',
        });

        setDraft(duplicated);
        setSelectedTemplateId('new');
        toast.success('Plantilla duplicada', {
            description: 'Revisa el nuevo identificador antes de guardar.',
            style: toastStyles.success,
        });
    };

    const updateTemplate = (patch: Partial<FormTemplateDef>) => {
        setDraft((current) => normalizeTemplate({ ...current, ...patch }));
    };

    const updateField = (fieldId: string, patch: Partial<FormFieldDef>) => {
        setDraft((current) => ({
            ...current,
            fields: current.fields.map((field) =>
                field.id === fieldId ? normalizeField({ ...field, ...patch }) : field,
            ),
        }));
    };

    const addField = () => {
        setDraft((current) => ({
            ...current,
            fields: [...current.fields, createDefaultField(current.fields.length + 1)],
        }));
    };

    const removeField = (fieldId: string) => {
        setDraft((current) => {
            const fields = current.fields.filter((field) => field.id !== fieldId);
            return {
                ...current,
                fields: fields.length > 0 ? fields : [createDefaultField(1)],
            };
        });
    };

    const moveField = (fieldId: string, direction: 'up' | 'down') => {
        setDraft((current) => {
            const index = current.fields.findIndex((field) => field.id === fieldId);
            if (index < 0) return current;

            const nextIndex = direction === 'up' ? index - 1 : index + 1;
            if (nextIndex < 0 || nextIndex >= current.fields.length) return current;

            const fields = [...current.fields];
            const [item] = fields.splice(index, 1);
            fields.splice(nextIndex, 0, item);

            return { ...current, fields };
        });
    };

    const cloneField = (fieldId: string) => {
        setDraft((current) => {
            const target = current.fields.find((field) => field.id === fieldId);
            if (!target) return current;

            const cloned = normalizeField({
                ...target,
                id: generateTemplateId(target.id),
                label: `${target.label} (copy)`,
            });

            const index = current.fields.findIndex((field) => field.id === fieldId);
            const fields = [...current.fields];
            fields.splice(index + 1, 0, cloned);

            return { ...current, fields };
        });

        toast.success('Campo clonado', {
            description: 'El campo se ha copiado correctamente.',
            style: toastStyles.success,
        });
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                        <ShieldCheck className="size-3.5" />
                        Form Builder
                    </div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Constructor de formularios
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                        En esta sección el usuario puede crear plantillas para formularios y personalizarlas a su gusto.
                    </p>
                </div>
                {/* Botones de acción */}
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={handleCreateNew}>
                        <Plus className="size-4" />
                        Nueva plantilla
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleDuplicate}
                        disabled={!draft.title.trim()}
                    >
                        <Copy className="size-4" />
                        Duplicar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isPendingUpsertTemplate}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                    >
                        <Save className="size-4" />
                        {isPendingUpsertTemplate ? 'Guardando...' : 'Guardar plantilla'}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_3fr_1fr]">
                {/* Sidebar con las plantillas guardadas */}
                <aside className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plantillas guardadas</CardTitle>
                            <CardDescription>Selecciona una plantilla para editarla o comienza una nueva.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <button
                                type="button"
                                onClick={handleCreateNew}
                                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${selectedTemplateId === 'new'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:bg-accent'
                                    }`}
                            >
                                <span className="font-medium">Nueva plantilla</span>
                                <span className="text-xs text-muted-foreground">Blank</span>
                            </button>

                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    type="button"
                                    onClick={() => handleLoadTemplate(template.id)}
                                    className={`flex w-full flex-col gap-1 rounded-lg border px-3 py-2 text-left transition-colors ${selectedTemplateId === template.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:bg-accent'
                                        }`}
                                >
                                    <span className="font-medium">{template.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {template.id} · {template.module}
                                    </span>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </aside>

                {/* Panel de edición */}
                <main className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div>
                                <CardTitle>Campos</CardTitle>
                                <CardDescription>
                                    Cada campo representa una entrada del formulario renderizado.
                                </CardDescription>
                            </div>
                            <Button type="button" variant="outline" onClick={addField}>
                                <Plus className="size-4" />
                                Agregar campo
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {draft.fields.map((field, index) => (
                                <FieldEditor
                                    key={`${field.id}`}
                                    field={field}
                                    index={index}
                                    total={draft.fields.length}
                                    onChange={(patch) => updateField(field.id, patch)}
                                    onDelete={() => removeField(field.id)}
                                    onMoveUp={() => moveField(field.id, 'up')}
                                    onMoveDown={() => moveField(field.id, 'down')}
                                    onClone={() => cloneField(field.id)}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vista previa</CardTitle>
                            <CardDescription>
                                Este es el renderer que verá el usuario final con la plantilla que estás editando.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DynamicForm
                                template={previewTemplate}
                                onSubmit={async () => {
                                    toast.success('Vista previa enviada', {
                                        description: 'Revisa la consola para ver la estructura de los datos.',
                                        style: toastStyles.success
                                    });
                                }}
                            />
                        </CardContent>
                    </Card>
                </main>

                {/* Panel de metadata */}
                <aside className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                            <CardDescription>Define la identidad de la plantilla.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="template-id">ID</Label>
                                <Input
                                    id="template-id"
                                    value={draft.id}
                                    onChange={(event) => updateTemplate({ id: event.target.value })}
                                    placeholder="template_student_report"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="template-title">Título</Label>
                                <Input
                                    id="template-title"
                                    value={draft.title}
                                    onChange={(event) => updateTemplate({ title: event.target.value })}
                                    placeholder="Reporte de estudiantes"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="template-description">Descripción</Label>
                                <Textarea
                                    id="template-description"
                                    value={draft.description ?? ''}
                                    onChange={(event) => updateTemplate({ description: event.target.value })}
                                    placeholder="Describe brevemente el formulario"
                                    className='min-h-80'
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label>Módulo</Label>
                                    <Select
                                        value={draft.module}
                                        onValueChange={(value) =>
                                            updateTemplate({ module: value as FormModules })
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona un módulo" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" align="start" className='bg-background'>
                                            {moduleOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                                    <div>
                                        <p className="text-sm font-medium">Activo</p>
                                        <p className="text-xs text-muted-foreground">Habilita o deshabilita la plantilla.</p>
                                    </div>
                                    <Switch
                                        checked={draft.isActive}
                                        onCheckedChange={(checked) => updateTemplate({ isActive: checked })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}



