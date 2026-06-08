import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button } from "../ui/button";
import { AlertDialogCustom } from "./Dialog";

const meta: Meta<typeof AlertDialogCustom> = {
	title: "Components/AlertDialogCustom",
	component: AlertDialogCustom,
};
export default meta;

export const Default: StoryObj<typeof AlertDialogCustom> = {
	render: () => {
		const [isOpen, setIsOpen] = React.useState(false);
		return (
			<div>
				<Button onClick={() => setIsOpen(true)}>Open Custom Alert</Button>
				<AlertDialogCustom
					message="Are you sure you want to delete this catalog item?"
					description="This action will permanently delete the selected item and remove it from the dashboard database. This cannot be undone."
					actionLabel="Delete Item"
					cancelLabel="Keep Item"
					onConfirm={() => setIsOpen(false)}
					onCancel={() => setIsOpen(false)}
					open={isOpen}
					onOpenChange={setIsOpen}
				/>
			</div>
		);
	},
};
