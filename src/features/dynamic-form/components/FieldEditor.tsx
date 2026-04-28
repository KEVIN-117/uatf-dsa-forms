import type { FieldType, FormFieldDef } from "#/shared/types/dynamic-form";
import { Label } from "#/shared/ui/label";
import { Textarea } from "#/shared/ui/textarea";
import { useMemo, useState } from "react";
import { fieldTypeOptions, parseOptions, serializeOptions } from "../utils";
import { Button } from "#/shared/ui/button";
import { ArrowDown, ArrowUp, Copy, Loader2, Trash2 } from "lucide-react";
import { Input } from "#/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/shared/ui/select";
import { Switch } from "#/shared/ui/switch";
import { Divider } from "#/shared/components/Divider";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchDefaultOptions } from "#/shared/hooks/useDefaultOptions";

const defaultOptions = [
    {
        label: "Tipos de Beca",
        collection: "scholarshipsTypes"
    },
    {
        label: "Tipos de ingreso",
        collection: "modalities"
    },
    {
        label: "Facultad",
        collection: "faculties"
    },
    {
        label: "Carreras",
        collection: "programs"
    },
    {
        label: "Tipos de Modalidades de Graduación",
        collection: "graduation_modalities"
    }
]

export function FieldEditor({
    field,
    index,
    total,
    onChange,
    onDelete,
    onMoveUp,
    onMoveDown,
    onClone,
}: {
    field: FormFieldDef;
    index: number;
    total: number;
    onChange: (patch: Partial<FormFieldDef>) => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onClone: () => void;
}) {
    const optionsText = useMemo(() => serializeOptions(field.options ?? []), [field.options]);

    const queryClient = useQueryClient();
    const [loadingCollection, setLoadingCollection] = useState<string | null>(null);

    const handleLoadDefaultOptions = async (collectionName: string) => {
        setLoadingCollection(collectionName);
        try {
            const data = await queryClient.fetchQuery({
                queryKey: ['default-options', collectionName],
                queryFn: () => fetchDefaultOptions(collectionName),
                staleTime: 1000 * 60 * 60,
            });

            onChange({ options: data });
            toast.success(`Opciones cargadas correctamente.`);

        } catch (error) {
            console.error(error);
            toast.error("Hubo un error al cargar las opciones de la base de datos.");
        } finally {
            setLoadingCollection(null);
        }
    };

    return (
        <div className="rounded-xl border border-border bg-background p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="font-semibold">Campo {index + 1}</h3>
                    <p className="text-xs text-muted-foreground">ID interno: {field.id}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onMoveUp} disabled={index === 0}>
                        <ArrowUp className="size-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onMoveDown}
                        disabled={index === total - 1}
                    >
                        <ArrowDown className="size-4" />
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={onClone}>
                        <Copy className="size-4" />
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>ID</Label>
                    <Input
                        value={field.id}
                        onChange={(event) => onChange({ id: event.target.value })}
                        placeholder="field_1"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Etiqueta</Label>
                    <Input
                        value={field.label}
                        onChange={(event) => onChange({ label: event.target.value })}
                        placeholder="Nombre del campo"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select
                        value={field.type}
                        onValueChange={(value) => {
                            const nextType = value as FieldType;
                            onChange({
                                type: nextType,
                                options: nextType === 'select' ? field.options ?? [] : undefined,
                            });
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Tipo de campo" />
                        </SelectTrigger>
                        <SelectContent>
                            {fieldTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                        value={field.placeholder ?? ''}
                        onChange={(event) => onChange({ placeholder: event.target.value })}
                        placeholder="Texto de ayuda"
                    />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                    <div>
                        <p className="text-sm font-medium">Requerido</p>
                        <p className="text-xs text-muted-foreground">El renderer mostrara validacion obligatoria.</p>
                    </div>
                    <Switch checked={!!field.required} onCheckedChange={(checked) => onChange({ required: checked })} />
                </div>

                <div className="space-y-2">
                    <Label>Depende de</Label>
                    <Input
                        value={field.dependsOn?.join(', ') ?? ''}
                        onChange={(event) =>
                            onChange({
                                dependsOn: event.target.value
                                    .split(',')
                                    .map((item) => item.trim())
                                    .filter(Boolean),
                            })
                        }
                        placeholder="campo_a, campo_b"
                    />
                </div>
            </div>

            {field.type === 'select' ? (
                <div className="mt-4 space-y-2">
                    <Divider />
                    <Label className="text-primary font-bold">Autocompletar con opciones del sistema:</Label>
                    <div className="flex flex-wrap gap-2">
                        {defaultOptions.map((m) => {
                            const isLoading = loadingCollection === m.collection;
                            return (
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-xs"
                                    key={m.collection}
                                    disabled={loadingCollection !== null} // Deshabilita botones mientras carga
                                    onClick={() => handleLoadDefaultOptions(m.collection)}
                                >
                                    {isLoading && <Loader2 className="mr-2 size-3 animate-spin" />}
                                    {m.label}
                                </Button>
                            );
                        })}
                    </div>

                    <Divider />
                    <p className="text-xs text-muted-foreground font-medium">O define las opciones manualmente:</p>

                    <div className="space-y-2">
                        <Label>Opciones</Label>
                        <Textarea
                            value={optionsText}
                            onChange={(event) => onChange({ options: parseOptions(event.target.value) })}
                            placeholder={'Etiqueta 1 | valor1\nEtiqueta 2 | valor2'}
                        />
                        <p className="text-xs text-muted-foreground">
                            Usa una linea por opcion con el formato <span className="font-medium">Etiqueta | valor</span>.
                        </p>
                    </div>
                </div>
            ) : null}
        </div>
    );
}