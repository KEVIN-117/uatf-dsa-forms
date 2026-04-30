import React from 'react'
import { sortingFns } from '@tanstack/react-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, SortingFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { makeData, type Person } from '#/data/demo-table-data'
import { useProtectedRoute } from '#/features/auth/hooks/useProtectedRoute'

import { Card, CardContent } from '#/shared/ui/card'
import { Button } from '#/shared/ui/button'
import { RefreshCw, DatabaseBackup } from 'lucide-react'
import { DataTable } from '#/shared/ui/data-table'

declare module '@tanstack/react-table' {
    interface FilterFns { fuzzy: FilterFn<unknown> }
    interface FilterMeta { itemRank: RankingInfo }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0
    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank,
            rowB.columnFiltersMeta[columnId]?.itemRank,
        )
    }
    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export function TablePanel() {
    // 1. HOOK ZONE
    const { isLoading, isAuthenticated } = useProtectedRoute();
    const [data, setData] = React.useState<Person[]>(() => makeData(5_000))
    const [, rerender] = React.useReducer((s) => s + 1, 0)

    const columns = React.useMemo<ColumnDef<Person, any>[]>(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                filterFn: 'equalsString',
            },
            {
                accessorKey: 'firstName',
                header: 'Nombre',
                cell: (info) => info.getValue(),
                filterFn: 'includesStringSensitive',
            },
            {
                accessorFn: (row) => row.lastName,
                id: 'lastName',
                header: 'Apellido',
                cell: (info) => info.getValue(),
                filterFn: 'includesString',
            },
            {
                accessorFn: (row) => `${row.firstName} ${row.lastName}`,
                id: 'fullName',
                header: 'Nombre Completo',
                cell: (info) => <span className="font-semibold text-primary">{info.getValue() as string}</span>,
                filterFn: 'fuzzy',
                sortingFn: fuzzySort,
            },
        ],
        []
    )

    // 2. FUNCTIONS AND LOGIC
    const refreshData = () => setData((_old) => makeData(50_000))

    // 3. EARLY RETURNS
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground font-body">
                Verificando sesión...
            </div>
        );
    }

    if (!isAuthenticated) return null;

    // 4. MAIN RENDER
    return (
        <div className="container mx-auto py-8 font-body space-y-6">
            {/* Cabecera Principal */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        Directorio de Registros
                    </h1>
                    <p className="text-muted-foreground">
                        Explora y filtra los datos utilizando el motor de búsqueda inteligente.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => rerender()} className="text-muted-foreground">
                        <RefreshCw className="mr-2 size-4" /> Forzar Render
                    </Button>
                    <Button variant="outline" onClick={refreshData}>
                        <DatabaseBackup className="mr-2 size-4" /> Cargar 50k Datos
                    </Button>
                </div>
            </div>

            <Card className="shadow-md border-border">
                <CardContent className="p-4 sm:p-6">
                    <DataTable
                        columns={columns}
                        data={data}
                        searchPlaceholder="Buscar en todas las columnas..."
                        showColumnToggle
                    />
                </CardContent>
            </Card>
        </div>
    )
}