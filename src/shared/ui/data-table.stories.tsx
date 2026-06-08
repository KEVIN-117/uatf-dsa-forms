import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";

const meta: Meta<typeof DataTable> = {
	title: "UI/DataTable",
	component: DataTable,
};
export default meta;

interface Payment {
	id: string;
	amount: number;
	status: "pending" | "processing" | "success" | "failed";
	email: string;
}

const columns: ColumnDef<Payment>[] = [
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		accessorKey: "email",
		header: "Email",
	},
	{
		accessorKey: "amount",
		header: "Amount",
	},
];

const data: Payment[] = [
	{
		id: "728ed52f",
		amount: 100,
		status: "success",
		email: "m@example.com",
	},
	{
		id: "489e1d56",
		amount: 125,
		status: "processing",
		email: "example@gmail.com",
	},
];

export const Default: StoryObj<typeof DataTable> = {
	args: {
		columns: columns as any,
		data: data,
		searchKey: "email",
		searchPlaceholder: "Filter emails...",
	},
};
