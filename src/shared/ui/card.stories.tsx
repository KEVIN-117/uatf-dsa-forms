import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card";

const meta: Meta<typeof Card> = {
	title: "UI/Card",
	component: Card,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Card> = {
	render: () => (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Create project</CardTitle>
				<CardDescription>Deploy your new project in one-click.</CardDescription>
				<CardAction>
					<Button variant="ghost" size="icon">
						X
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p>Card content goes here.</p>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button variant="outline">Cancel</Button>
				<Button>Deploy</Button>
			</CardFooter>
		</Card>
	),
};
