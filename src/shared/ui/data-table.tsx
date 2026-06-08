import { rankItem } from "@tanstack/match-sorter-utils";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	ChevronsUpDown,
	ChevronUp,
	DatabaseZap,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import * as React from "react";

import { Button } from "#/shared/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/shared/ui/dropdown-menu";
import { Input } from "#/shared/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/shared/ui/select";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);
	addMeta({ itemRank });
	return itemRank.passed;
};

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey?: string;
	searchPlaceholder?: string;
	showColumnToggle?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	searchPlaceholder = "Buscar...",
	showColumnToggle = false,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 5,
	});

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
	});

	function StatusFilter({ column }: any) {
		const options = column.columnDef.meta?.filterOptions ?? [];

		return (
			<Select onValueChange={(value) => column.setFilterValue(value)}>
				<SelectTrigger className="w-32 h-8">
					<SelectValue placeholder="Filtrar estado" />
				</SelectTrigger>
				<SelectContent className="w-full min-w-[100px] text-xs font-normal bg-background/50 shadow-sm">
					{options.map((option: string) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	}

	return (
		<div className="space-y-0 font-body">
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-border/30">
				{searchKey ? (
					<div className="relative w-full sm:max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
						<Input
							placeholder={searchPlaceholder}
							value={
								(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
							}
							onChange={(event) =>
								table.getColumn(searchKey)?.setFilterValue(event.target.value)
							}
							className="pl-9 w-full focus-academic bg-muted/30 border-border/40 rounded-lg"
						/>
					</div>
				) : (
					<div className="relative w-full sm:max-w-sm">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
						<Input
							placeholder={searchPlaceholder}
							value={globalFilter ?? ""}
							onChange={(event) => setGlobalFilter(event.target.value)}
							className="pl-9 w-full focus-academic bg-muted/30 border-border/40 rounded-lg"
						/>
					</div>
				)}

				{showColumnToggle && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="ml-auto w-full sm:w-auto border-border/40 hover:bg-accent/60 transition-colors"
							>
								<SlidersHorizontal className="mr-2 h-3.5 w-3.5" />
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
										typeof column.accessorFn !== "undefined" &&
										column.getCanHide(),
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
											{typeof column.columnDef.header === "string"
												? column.columnDef.header
												: column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			{/* Table */}
			<div className="overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-left">
						<thead className="bg-muted/20 text-muted-foreground uppercase text-[11px] tracking-wider border-b border-border/40">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<th
												key={header.id}
												className="px-5 py-3.5 font-semibold whitespace-nowrap align-top"
											>
												{header.isPlaceholder ? null : (
													<div className="space-y-2">
														<div
															className={`flex items-center gap-1.5 ${header.column.getCanSort() ? "cursor-pointer select-none hover:text-primary transition-colors duration-200" : ""}`}
															onClick={header.column.getToggleSortingHandler()}
														>
															{flexRender(
																header.column.columnDef.header,
																header.getContext(),
															)}
															{header.column.getCanSort() && (
																<span className="text-muted-foreground/40">
																	{{
																		asc: (
																			<ChevronUp className="size-3.5 text-primary" />
																		),
																		desc: (
																			<ChevronDown className="size-3.5 text-primary" />
																		),
																	}[header.column.getIsSorted() as string] ?? (
																		<ChevronsUpDown className="size-3.5" />
																	)}
																</span>
															)}
														</div>
														{header.column.columnDef.header !== "Estado" &&
														header.column.getCanFilter() ? (
															<div>
																<Input
																	placeholder={`Filtrar...`}
																	value={
																		(header.column.getFilterValue() ??
																			"") as string
																	}
																	onChange={(e) =>
																		header.column.setFilterValue(e.target.value)
																	}
																	className="h-7 w-full min-w-[100px] text-xs font-normal bg-background/60 border-border/30 focus-academic rounded-md mt-1.5"
																/>
															</div>
														) : null}
														{header.column.columnDef.header === "Estado" && (
															<>
																{
																	<StatusFilter
																		key={header.id}
																		column={header.column}
																	/>
																}
															</>
														)}
													</div>
												)}
											</th>
										);
									})}
								</tr>
							))}
						</thead>
						<tbody className="divide-y divide-border/30">
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
										className="hover:bg-accent/30 transition-colors duration-150"
									>
										{row.getVisibleCells().map((cell) => (
											<td key={cell.id} className="px-5 py-3.5">
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										))}
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={columns.length}
										className="px-6 py-16 text-center"
									>
										<div className="flex flex-col items-center gap-2">
											<DatabaseZap className="w-8 h-8 text-muted-foreground/30" />
											<p className="text-sm font-medium text-muted-foreground">
												No se encontraron resultados
											</p>
											<p className="text-xs text-muted-foreground/60">
												Intenta ajustar los filtros de búsqueda
											</p>
										</div>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			<div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-4 border-t border-border/30 bg-muted/5">
				<div className="flex-1 text-xs text-muted-foreground">
					{table.getFilteredRowModel().rows.length} registros en total
				</div>
				<div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-4">
					<div className="flex items-center space-x-2">
						<p className="text-xs font-medium text-muted-foreground">Filas</p>
						<Select
							value={`${pagination.pageSize}`}
							onValueChange={(value) => {
								setPagination({ pageIndex: 0, pageSize: Number(value) });
							}}
						>
							<SelectTrigger className="h-7 w-[60px] text-xs border-border/40">
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
					<div className="flex items-center justify-center text-xs font-medium text-muted-foreground">
						Pág. {pagination.pageIndex + 1} / {table.getPageCount() || 1}
					</div>
					<div className="flex items-center space-x-1">
						<Button
							variant="ghost"
							className="h-7 w-7 p-0 hidden lg:flex hover:bg-accent/60 transition-colors"
							onClick={() =>
								setPagination({ pageIndex: 0, pageSize: pagination.pageSize })
							}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Ir a primera página</span>
							<ChevronsLeft className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							className="h-7 w-7 p-0 hover:bg-accent/60 transition-colors"
							onClick={() =>
								setPagination({
									pageIndex: pagination.pageIndex - 1,
									pageSize: pagination.pageSize,
								})
							}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Ir a página anterior</span>
							<ChevronLeft className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							className="h-7 w-7 p-0 hover:bg-accent/60 transition-colors"
							onClick={() =>
								setPagination({
									pageIndex: pagination.pageIndex + 1,
									pageSize: pagination.pageSize,
								})
							}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Ir a página siguiente</span>
							<ChevronRight className="h-3.5 w-3.5" />
						</Button>
						<Button
							variant="ghost"
							className="h-7 w-7 p-0 hidden lg:flex hover:bg-accent/60 transition-colors"
							onClick={() =>
								setPagination({
									pageIndex: table.getPageCount() - 1,
									pageSize: pagination.pageSize,
								})
							}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Ir a última página</span>
							<ChevronsRight className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
