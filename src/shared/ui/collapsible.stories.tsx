import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Button } from "./button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./collapsible";

const meta: Meta<typeof Collapsible> = {
	title: "UI/Collapsible",
	component: Collapsible,
};
export default meta;

export const Default: StoryObj<typeof Collapsible> = {
	render: () => {
		const [isOpen, setIsOpen] = React.useState(false);
		return (
			<Collapsible
				open={isOpen}
				onOpenChange={setIsOpen}
				className="w-[350px] space-y-2"
			>
				<div className="flex items-center justify-between space-x-4 px-4">
					<h4 className="text-sm font-semibold">
						@peduarte starred 3 repositories
					</h4>
					<CollapsibleTrigger asChild>
						<Button variant="ghost" size="sm">
							{isOpen ? "Close" : "Open"}
						</Button>
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="space-y-2 px-4 py-2 border rounded-md">
					<div className="text-sm">@radix-ui/primitives</div>
					<div className="text-sm">@radix-ui/react-collapsible</div>
				</CollapsibleContent>
			</Collapsible>
		);
	},
};
