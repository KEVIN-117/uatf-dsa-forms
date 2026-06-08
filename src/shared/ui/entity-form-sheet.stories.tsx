import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button } from "./button";
import { EntityFormSheet } from "./entity-form-sheet";

const meta: Meta<typeof EntityFormSheet> = {
	title: "UI/EntityFormSheet",
	component: EntityFormSheet,
};
export default meta;

export const Default: StoryObj<typeof EntityFormSheet> = {
	render: () => {
		const [isOpen, setIsOpen] = React.useState(false);
		return (
			<div>
				<Button onClick={() => setIsOpen(true)}>Open Entity Sheet</Button>
				<EntityFormSheet
					title="Create New Entity"
					description="Fill in the details to create a new catalog entity."
					open={isOpen}
					onOpenChange={setIsOpen}
				>
					<div className="space-y-4">
						<p className="text-sm">Interactive fields would be placed here.</p>
						<Button onClick={() => setIsOpen(false)}>Save Changes</Button>
					</div>
				</EntityFormSheet>
			</div>
		);
	},
};
