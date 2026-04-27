import React from 'react'
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    sortingFns,
    useReactTable,
} from '@tanstack/react-table'
import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import type { Column, ColumnDef, ColumnFiltersState, FilterFn, SortingFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { makeData, type Person } from '#/data/demo-table-data'
import { useProtectedRoute } from '#/features/auth/hooks/useProtectedRoute'

import { Card, CardContent, CardHeader } from '#/shared/ui/card'
import { Button } from '#/shared/ui/button'
import { Input } from '#/shared/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/shared/ui/select'
import {
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    RefreshCw,
    DatabaseBackup
} from 'lucide-react'

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
    const { isLoading, isAuthenticated } = useProtectedRoute();
    const rerender = React.useReducer(() => ({}), {})[1]

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState('')
    const [data, setData] = React.useState<Person[]>(() => makeData(5_000))

    const refreshData = () => setData((_old) => makeData(50_000))

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

    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { columnFilters, globalFilter },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'fuzzy',
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    React.useEffect(() => {
        if (table.getState().columnFilters[0]?.id === 'fullName') {
            if (table.getState().sorting[0]?.id !== 'fullName') {
                table.setSorting([{ id: 'fullName', desc: false }])
            }
        }
    }, [table.getState, table.setSorting])

    if (isLoading) return <div className="flex h-full items-center justify-center text-muted-foreground font-body">Verificando sesión...</div>;
    if (!isAuthenticated) return null;

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
                <CardHeader className="border-b border-border/50 bg-muted/10 pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <DebouncedInput
                                value={globalFilter ?? ''}
                                onChange={(value) => setGlobalFilter(String(value))}
                                className="pl-9 focus-academic"
                                placeholder="Buscar en todas las columnas..."
                            />
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">
                            Mostrando <span className="text-foreground">{table.getPrePaginationRowModel().rows.length}</span> registros
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/30 text-muted-foreground uppercase text-xs tracking-wider border-b border-border">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th key={header.id} colSpan={header.colSpan} className="px-6 py-4 font-semibold">
                                                {header.isPlaceholder ? null : (
                                                    <div className="space-y-2">
                                                        <Button
                                                            className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-primary transition-colors' : ''}`}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            {header.column.getCanSort() && (
                                                                <span className="text-muted-foreground/50">
                                                                    {{
                                                                        asc: <ChevronUp className="size-4 text-primary" />,
                                                                        desc: <ChevronDown className="size-4 text-primary" />,
                                                                    }[header.column.getIsSorted() as string] ?? <ChevronsUpDown className="size-4" />}
                                                                </span>
                                                            )}
                                                        </Button>
                                                        {/* Filtro individual de columna */}
                                                        {header.column.getCanFilter() ? (
                                                            <div><Filter column={header.column} /></div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {table.getRowModel().rows.length === 0 && (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground">
                                            No se encontraron resultados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>

                {/* Paginación */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-muted-foreground">Filas por página</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => table.setPageSize(Number(value))}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                            Página
                            <Input
                                type="number"
                                min={1}
                                max={table.getPageCount()}
                                defaultValue={table.getState().pagination.pageIndex + 1}
                                onChange={(e) => {
                                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    table.setPageIndex(page)
                                }}
                                className="h-8 w-16 text-center focus-academic"
                            />
                            de <span className="text-foreground">{table.getPageCount()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    return (
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Filtrar...`}
            className="h-8 w-full text-xs font-normal bg-background/50 focus-academic shadow-sm"
        />
    )
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    className,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
    className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)
        return () => clearTimeout(timeout)
    }, [value, onChange, debounce])

    return (
        <Input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={className}
        />
    )
}