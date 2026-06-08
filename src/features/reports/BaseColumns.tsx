import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { Button } from "#/shared/ui/button";

export interface BaseColumnActions {
	onEdit: (rowIndex: number) => void;
	onDelete: (rowIndex: number) => void;
}

export function createBaseColumns(
	actions: BaseColumnActions,
): ColumnDef<Record<string, unknown>, any>[] {
	return [
		{
			id: "actions",
			header: "Acciones",
			enableColumnFilter: false,
			enableSorting: false,
			cell: ({ row }) => (
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
						onClick={() => actions.onEdit(row.index)}
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
						onClick={() => actions.onDelete(row.index)}
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			),
		},
	];
}

export const useOnEditTableActions = () => {
	const editDataRef = useRef<(index: number) => void>(() => {});
	const removeDataRef = useRef<(index: number) => void>(() => {});

	const stableOnEdit = useCallback((i: number) => editDataRef.current(i), []);
	const stableOnDelete = useCallback(
		(i: number) => removeDataRef.current(i),
		[],
	);

	const actionColumns = useMemo(
		() => createBaseColumns({ onEdit: stableOnEdit, onDelete: stableOnDelete }),
		[stableOnEdit, stableOnDelete],
	);

	return {
		actionColumns,
		editDataRef,
		removeDataRef,
	};
};
