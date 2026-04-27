import type { FormFieldDef } from "#/shared/types/dynamic-form";
import { Input } from "#/shared/ui/input";

export const renderFieldInput = (fieldDef: FormFieldDef, fieldApi: any) => {
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
                    <option key={opt.value} value={opt.value}>
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
            onChange={(e) => {
                const val = e.target.value;
                fieldApi.handleChange(fieldDef.type === 'number' ? (val ? Number(val) : '') : val);
            }}
            className="focus-academic"
        />
    );
};