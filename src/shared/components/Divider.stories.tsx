import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
	title: "Components/Divider",
	component: Divider,
	tags: ["autodocs"],
};
export default meta;

export const Default: StoryObj<typeof Divider> = {
	render: () => (
		<div className="w-[500px]">
			<p className="text-sm p-2">Paragraph Above Divider</p>
			<Divider />
			<p className="text-sm p-2">Paragraph Below Divider</p>
		</div>
	),
};
