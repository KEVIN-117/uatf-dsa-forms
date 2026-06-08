import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "./sidebar";

const meta: Meta<typeof Sidebar> = {
	title: "UI/Sidebar",
	component: Sidebar,
};
export default meta;

export const Default: StoryObj<typeof Sidebar> = {
	render: () => (
		<SidebarProvider>
			<div className="flex h-screen w-full">
				<Sidebar>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Application</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<a href="#">
												<span>Dashboard</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton asChild>
											<a href="#">
												<span>Settings</span>
											</a>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
				</Sidebar>
				<main className="flex-1 p-6">
					<SidebarTrigger />
					<p className="mt-4">Sidebar demo layout content.</p>
				</main>
			</div>
		</SidebarProvider>
	),
};
