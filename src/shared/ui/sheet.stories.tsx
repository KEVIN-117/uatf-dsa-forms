import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./sheet";

const meta: Meta<typeof Sheet> = {
	title: "UI/Sheet",
	component: Sheet,
};
export default meta;

export const Default: StoryObj<typeof Sheet> = {
	render: () => (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Open Sheet</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>
						This action cannot be undone. This will permanently delete your
						account.
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	),
};
