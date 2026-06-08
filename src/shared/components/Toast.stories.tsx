import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../ui/button";
import { Toaster } from "../ui/sonner";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
	title: "Components/Toast",
};
export default meta;

export const Success: StoryObj = {
	render: () => (
		<div>
			<Toaster />
			<Button
				onClick={() =>
					Toast({
						message: "Successfully saved all records to catalog databases.",
						type: "success",
						title: "Action completed",
					})
				}
			>
				Trigger Success Toast
			</Button>
		</div>
	),
};

export const Error: StoryObj = {
	render: () => (
		<div>
			<Toaster />
			<Button
				onClick={() =>
					Toast({
						message: "Unable to establish connection to database server.",
						type: "error",
						title: "Action failed",
					})
				}
			>
				Trigger Error Toast
			</Button>
		</div>
	),
};
