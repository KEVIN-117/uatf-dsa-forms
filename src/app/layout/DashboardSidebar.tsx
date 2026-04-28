import * as React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
} from "#/shared/ui/sidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "#/shared/ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "#/shared/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Add01Icon,
    ArrowDown01Icon,
    ArrowRight01Icon,
    UnfoldMoreIcon,
    Settings01Icon,
    UserAdd01Icon,
    Home02Icon,
    Logout01Icon,
    SchoolIcon,
    UserAccountIcon,
    DoorIcon,
    AwardIcon,
} from "@hugeicons/core-free-icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import type { MenuItem, MenuItemGroup } from "#/shared/types";
import { useDynamicMenuItemsGrouped, useDynamicResultsMenuItemsGrouped } from "#/shared/hooks/useDynamicMenuItemsGrouped";
import { Tooltip, TooltipContent, TooltipTrigger } from "#/shared/ui/tooltip";
import { Button } from "#/shared/ui/button";
import { useLogout } from "#/features/auth/hooks/useAuth";
import { useDirectorProfile } from "#/features/director-profile/providers/DirectorProfileProvider";
import ThemeToggle from "./ThemeToggle";
import logoUATF from '/dsa-icon.png'


export function DashboardSidebar({
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const [expandedItems, setExpandedItems] = React.useState<string[]>([
        "all-work",
        "website-copy",
    ]);

    const workgroups = useDynamicMenuItemsGrouped();
    const resultGroups = useDynamicResultsMenuItemsGrouped();


    const toggleItem = (id: string) => {
        setExpandedItems((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const logoutMutation = useLogout();
    const { isAuthenticated, isLoading } = useAuth();
    const { clearProfile, profile } = useDirectorProfile();
    const navigate = useNavigate();

    const renderWorkgroupItem = (
        item: MenuItem | MenuItemGroup,
        level: number = 0
    ) => {
        const isExpanded = expandedItems.includes(item.id);
        const Icon = item.icon;
        const paddingLeft = level * 12;

        if ("children" in item && item.children) {
            return (
                <Collapsible
                    key={item.id}
                    open={isExpanded}
                    onOpenChange={() => toggleItem(item.id)}
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger
                            asChild
                        >
                            <SidebarMenuButton
                                className="h-fit text-sm"
                                style={{ paddingLeft: `${8 + paddingLeft}px` }}
                            >
                                <HugeiconsIcon icon={Icon} className="size-3.5" />
                                <span className="flex-1">{item.name}</span>
                                {isExpanded ? (
                                    <HugeiconsIcon icon={ArrowDown01Icon} className="size-3" />
                                ) : (
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
                                )}
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub className="mr-0 pr-0">
                                {item.children.map((child) => (
                                    <SidebarMenuSubItem key={child.id}>
                                        {renderWorkgroupItem(
                                            child,
                                            level + 1
                                        )}
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            );
        }

        return renderMenuItem(item as MenuItem, level);
    };

    function renderMenuItem(item: MenuItem, level: number = 0) {
        const paddingLeft = level * 12;
        const Icon = item.icon;

        return (
            <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                    asChild
                    className="h-fit text-sm"
                    style={{ paddingLeft: `${8 + paddingLeft}px` }}
                >
                    <Link to={item.href}>
                        <Tooltip>
                            <TooltipTrigger className="flex items-center gap-2">
                                <HugeiconsIcon icon={Icon} className="size-3.5" />
                                <span className="flex-1 text-sm truncate max-w-40">{item.name}</span>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{item.name}</p>
                            </TooltipContent>
                        </Tooltip>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <Sidebar className="lg:border-r-0!" collapsible="icon" {...props}>
            <SidebarHeader className="px-2.5 py-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="flex justify-between items-center">
                        <section className="flex items-center gap-2.5 w-full hover:bg-sidebar-accent rounded-md p-1 -m-1 transition-colors shrink-0">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-foreground text-background shrink-0">
                                <img src={logoUATF} alt="logo uatf" className="w-fit h-fit" />
                            </div>
                            <h3 className="text-sm font-medium">UATF</h3>
                            <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                                <HugeiconsIcon icon={UnfoldMoreIcon} className="size-3 text-muted-foreground" />
                            </div>
                        </section>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <HugeiconsIcon icon={UserAdd01Icon} className="size-4" />
                                <span>Invite members</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarHeader>

            <SidebarContent className="px-2.5">
                {isAuthenticated &&
                    (
                        <>
                            <SidebarGroup>
                                <SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
                                    <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                                        Dashboard
                                    </span>
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <Link to="/dashboard/dashboard">
                                                <SidebarMenuButton className="h-7 text-sm">
                                                    <HugeiconsIcon icon={Home02Icon} className="size-3.5" />
                                                    <span>Dashboard</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <Link to="/dashboard/table">
                                                <SidebarMenuButton className="h-7 text-sm">
                                                    <HugeiconsIcon icon={Home02Icon} className="size-3.5" />
                                                    <span>DemoTable</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild className="h-7 text-sm">
                                                <Link to="/dashboard/form-builder">
                                                    <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
                                                    <span>Crear formulario</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                            <SidebarGroup className="p-0 mt-4">
                                <SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
                                    <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                                        Administración
                                    </span>
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <Link to="/dashboard/admin">
                                                <SidebarMenuButton className="h-7 text-sm">
                                                    <HugeiconsIcon icon={Settings01Icon} className="size-3.5" />
                                                    <span>Panel Admin</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <Link to="/dashboard/faculties">
                                                <SidebarMenuButton className="h-7 text-sm">
                                                    <HugeiconsIcon icon={SchoolIcon} className="size-3.5" />
                                                    <span>Facultades</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <Link to="/dashboard/programs">
                                                <SidebarMenuButton className="h-7 text-sm">
                                                    <HugeiconsIcon icon={UserAccountIcon} className="size-3.5" />
                                                    <span>Carreras</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <Link to="/dashboard/modalities">
                                                <SidebarMenuButton className="h-7 text-sm">
                                                    <HugeiconsIcon icon={DoorIcon} className="size-3.5" />
                                                    <span>Mod. Ingreso</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <Link to="/dashboard/graduation-modalities">
                                                <SidebarMenuButton className="h-7 text-sm">
                                                    <HugeiconsIcon icon={AwardIcon} className="size-3.5" />
                                                    <span>Mod. Graduación</span>
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                            <SidebarGroup className="p-0 mt-4">
                                <SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
                                    <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                                        Resultados de formularios
                                    </span>
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        {resultGroups.map((item) => renderWorkgroupItem(item))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </>
                    )
                }
                <SidebarGroup className="p-0 mt-4">
                    <SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground">
                            Lista de Formularios
                        </span>
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {workgroups.map((item) => renderWorkgroupItem(item))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-2.5 pb-3 group-data-[collapsible=icon]:hidden">
                <div className="flex justify-between items-center gap-1.5">
                    <ThemeToggle />
                    {isAuthenticated && !isLoading && <Button className='bg-red-600 hover:bg-red-700 text-white'
                        onClick={async () => {
                            await logoutMutation.mutateAsync();
                            navigate({ to: '/' });
                        }}
                        disabled={logoutMutation.isPending}
                        variant="default"
                        size="sm"
                    >
                        <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                        {logoutMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
                    </Button>}
                    {profile && <Button className='bg-red-600 hover:bg-red-700 text-white'
                        onClick={async () => {
                            clearProfile();
                            navigate({ to: '/' });
                        }}
                        variant="default"
                        size="sm"
                    >
                        <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                        Cerrar Sesión
                    </Button>}
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

