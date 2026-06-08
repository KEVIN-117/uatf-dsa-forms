import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const meta: Meta<typeof Avatar> = {
	title: "UI/Avatar",
	component: Avatar,
	tags: ["autodocs"],
};
export default meta;

export const Image: StoryObj<typeof Avatar> = {
	render: () => (
		<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	),
};

export const Fallback: StoryObj<typeof Avatar> = {
	render: () => (
		<Avatar>
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};
