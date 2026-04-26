import { FormContainer } from "#/shared/components/FormContainer";
import { Button } from "#/shared/ui/button";
import { Label } from "#/shared/ui/label";
import { useModalities, useModalityById } from "#/features/reference-data/hooks/useModalities";
import { useForm } from "@tanstack/react-form";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

interface FormModel {
    modality: string;
    male: number;
    female: number;
    total: number;
}

const defaultValues: FormModel = {
    modality: '',
    male: 0,
    female: 0,
    total: 0
}

export function StuNumAppCatSex() {
    const [dataPostu, setDataPostu] = useState<{ modality: string, male: number, female: number, total: number }[]>([]);
    const { data: modalities, isLoading, isError } = useModalities()

    const form = useForm({
        defaultValues: {
            ...defaultValues,
            modality: ''
        },
        onSubmit: async ({ value }) => {
            setDataPostu(prev => [...prev, value])
            form.reset()
        }
    })

    const modalityById = (modalityId: string) => {
        return modalities?.find(m => m.id === modalityId)?.modality ?? "";
    };

    return (
        <FormContainer title="Número de postulantes por modalidad y sexo" description="Este es el formulario de número de postulantes por modalidad y sexo">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="space-y-5 font-body">

                <form.Field
                    name="modality"
                    validators={{

                    }}
                    children={(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-semibold text-foreground">Categoría</Label>
                            <select
                                id="category"
                                className="flex h-11 w-full rounded-lg border-2 border-muted bg-background px-4 py-2.5 text-base font-medium text-foreground ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            >
                                <option value="">Seleccionar</option>
                                {
                                    isLoading ? (
                                        <option value="loading">Loading...</option>
                                    ) : isError ? (
                                        <option value="error">Error al cargar</option>
                                    ) : (
                                        modalities?.map((modality) => (
                                            <option key={modality.id} value={modality.id}>
                                                {modality.modality}
                                            </option>
                                        ))
                                    )
                                }
                            </select>
                        </div>
                    )}
                />
                <form.Field
                    name="male"
                    validators={{

                    }}
                    children={(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="male" className="text-sm font-semibold text-foreground">Masculino</Label>
                            <input
                                type="number"
                                id="male"
                                className="flex h-11 w-full rounded-lg border-2 border-muted bg-background px-4 py-2.5 text-base font-medium text-foreground ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                            />
                        </div>
                    )}
                />
                <form.Field
                    name="female"
                    validators={{

                    }}
                    children={(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="female" className="text-sm font-semibold text-foreground">Femenino</Label>
                            <input
                                type="number"
                                id="female"
                                className="flex h-11 w-full rounded-lg border-2 border-muted bg-background px-4 py-2.5 text-base font-medium text-foreground ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                            />
                        </div>
                    )}
                />
                <form.Field
                    name="total"
                    validators={{

                    }}
                    children={(field) => (
                        <div className="space-y-2">
                            <Label htmlFor="total" className="text-sm font-semibold text-foreground">Total</Label>
                            <input
                                type="number"
                                id="total"
                                className="flex h-11 w-full rounded-lg border-2 border-muted bg-background px-4 py-2.5 text-base font-medium text-foreground ring-offset-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                            />
                        </div>
                    )}
                />

                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <Button
                            type="submit"
                            className="w-full font-bold py-5 text-base mt-6 transition-all"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin h-5 w-5" />
                                    Registrando...
                                </span>
                            ) : (
                                "Registrar"
                            )}
                        </Button>
                    )}
                />
            </form>

            <div className="w-full">
                <table className="w-full">
                    <thead>
                        <tr className="w-full">
                            <th className="border border-gray-200 px-4 py-2">Modalidad</th>
                            <th className="border border-gray-200 px-4 py-2">Masculino</th>
                            <th className="border border-gray-200 px-4 py-2">Femenino</th>
                            <th className="border border-gray-200 px-4 py-2">Total</th>
                            <th className="border border-gray-200 px-4 py-2">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataPostu.map((postu, index) => (
                            <tr key={index} className="w-full border border-gray-200">
                                <td className="border border-gray-200 px-4 py-2">{modalityById(postu.modality)}</td>
                                <td className="border border-gray-200 px-4 py-2">{postu.male}</td>
                                <td className="border border-gray-200 px-4 py-2">{postu.female}</td>
                                <td className="border border-gray-200 px-4 py-2">{postu.total}</td>
                                <td className="border border-gray-200 px-4 py-2">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </FormContainer>
    );
}

