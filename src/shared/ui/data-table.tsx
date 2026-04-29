import * as React from "react"
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type FilterFn,
    type PaginationState,
} from "@tanstack/react-table"
import { rankItem } from '@tanstack/match-sorter-utils'

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    SlidersHorizontal,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
} from 'lucide-react'

import { Button } from "#/shared/ui/button"
import { Input } from "#/shared/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/shared/ui/select"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "#/shared/ui/dropdown-menu"

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    searchPlaceholder?: string
    showColumnToggle?: boolean
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    searchPlaceholder = "Buscar...",
    showColumnToggle = false,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
            pagination,
        },
    })

    return (
        <div className="space-y-4 font-body">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                {searchKey ? (
                    <div className="flex items-center w-full sm:max-w-sm">
                        <Input
                            placeholder={searchPlaceholder}
                            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(searchKey)?.setFilterValue(event.target.value)
                            }
                            className="w-full focus-academic"
                        />
                    </div>
                ) : (
                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-9 w-full focus-academic"
                        />
                    </div>
                )}

                {showColumnToggle && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto w-full sm:w-auto">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Vista
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            <DropdownMenuLabel>Alternar columnas</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" && column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/30 text-muted-foreground uppercase text-xs tracking-wider border-b border-border">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <th key={header.id} className="px-6 py-4 font-semibold whitespace-nowrap align-top">
                                                {header.isPlaceholder ? null : (
                                                    <div className="space-y-2">
                                                        <div
                                                            className={`flex items-center gap-2 ${header.column.getCanSort() ? 'cursor-pointer select-none hover:text-primary transition-colors' : ''}`}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                                            {header.column.getCanSort() && (
                                                                <span className="text-muted-foreground/50 ml-1">
                                                                    {{
                                                                        asc: <ChevronUp className="size-4 text-primary" />,
                                                                        desc: <ChevronDown className="size-4 text-primary" />,
                                                                    }[header.column.getIsSorted() as string] ?? (
                                                                            <ChevronsUpDown className="size-4" />
                                                                        )}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {header.column.getCanFilter() ? (
                                                            <div>
                                                                <Input
                                                                    placeholder={`Filtrar...`}
                                                                    value={(header.column.getFilterValue() ?? '') as string}
                                                                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                                                                    className="h-8 w-full min-w-[100px] text-xs font-normal bg-background/50 focus-academic shadow-sm mt-2"
                                                                />
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </th>
                                        )
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/10 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    Mostrando {table.getFilteredRowModel().rows.length} registros en total.
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-6 lg:space-x-8">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Filas por página</p>
                        <Select
                            value={`${pagination.pageSize}`}
                            onValueChange={(value) => {
                                setPagination({ pageIndex: 0, pageSize: Number(value) })
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top" className="bg-background">
                                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium">
                        Página {pagination.pageIndex + 1} de{" "}
                        {table.getPageCount() || 1}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => setPagination({ pageIndex: 0, pageSize: pagination.pageSize })}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a primera página</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setPagination({ pageIndex: pagination.pageIndex - 1, pageSize: pagination.pageSize })}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Ir a página anterior</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => setPagination({ pageIndex: pagination.pageIndex + 1, pageSize: pagination.pageSize })}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a página siguiente</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => setPagination({ pageIndex: table.getPageCount() - 1, pageSize: pagination.pageSize })}
                            disabled={!table.getCanNextPage()}
                        >
                            <span className="sr-only">Ir a última página</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
