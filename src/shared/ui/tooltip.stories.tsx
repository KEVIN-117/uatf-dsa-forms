import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

const meta: Meta<typeof Tooltip> = {
	title: "UI/Tooltip",
	component: Tooltip,
};
export default meta;

export const Default: StoryObj<typeof Tooltip> = {
	render: () => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline">Hover me</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add to library</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
};
