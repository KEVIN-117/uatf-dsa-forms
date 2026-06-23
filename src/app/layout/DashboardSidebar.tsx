import {
	Add01Icon,
	ArrowDown01Icon,
	ArrowRight01Icon,
	AwardIcon,
	Calendar,
	DoorIcon,
	Home02Icon,
	Logout01Icon,
	SchoolIcon,
	Settings01Icon,
	UnfoldMoreIcon,
	UserAccountIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import * as React from "react";
import { usePeriodState } from "#/app/providers/period-provider";
import { useLogout } from "#/features/auth/hooks/useAuth";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useDynamicResultsMenuItemsGrouped } from "#/shared/hooks/useDynamicMenuItemsGrouped";
import {
	type IconSvgObject,
	type MenuItem,
	type MenuItemGroup,
	Role,
} from "#/shared/types";
import { Badge } from "#/shared/ui/badge";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "#/shared/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/shared/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/shared/ui/select";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "#/shared/ui/tooltip";
import logoUATF from "/dsa-icon.png";
import ThemeToggle from "./ThemeToggle";

type NavItem = {
	label: string;
	to: string;
	icon: IconSvgObject;
	roles: Role[];
};

const PRIMARY_NAV: NavItem[] = [
	{
		label: "Dashboard",
		to: "/dashboard",
		icon: Home02Icon,
		roles: [Role.ADMIN, Role.DIRECTOR],
	},
];

const ADMIN_DASHBOARD_NAV: NavItem[] = [
	{
		label: "DemoTable",
		to: "/dashboard/table",
		icon: Home02Icon,
		roles: [Role.ADMIN],
	},
	{
		label: "Crear formulario",
		to: "/dashboard/form-builder",
		icon: Add01Icon,
		roles: [Role.ADMIN],
	},
];

const ADMIN_MANAGEMENT_NAV: NavItem[] = [
	{
		label: "Panel Admin",
		to: "/dashboard/admin",
		icon: Settings01Icon,
		roles: [Role.ADMIN],
	},
	{
		label: "Facultades",
		to: "/dashboard/faculties",
		icon: SchoolIcon,
		roles: [Role.ADMIN],
	},
	{
		label: "Carreras",
		to: "/dashboard/programs",
		icon: UserAccountIcon,
		roles: [Role.ADMIN],
	},
	{
		label: "Directores",
		to: "/dashboard/directors",
		icon: UserAccountIcon,
		roles: [Role.ADMIN],
	},
	{
		label: "Mod. Ingreso",
		to: "/dashboard/modalities",
		icon: DoorIcon,
		roles: [Role.ADMIN],
	},
	{
		label: "Mod. Graduación",
		to: "/dashboard/graduation-modalities",
		icon: AwardIcon,
		roles: [Role.ADMIN],
	},
	{
		label: "Periodos",
		to: "/dashboard/periods",
		icon: Calendar,
		roles: [Role.ADMIN],
	},
];

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const [expandedItems, setExpandedItems] = React.useState<string[]>([
		"all-work",
		"website-copy",
	]);

	const resultGroups = useDynamicResultsMenuItemsGrouped();

	const toggleItem = (id: string) => {
		setExpandedItems((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
		);
	};

	const logoutMutation = useLogout();
	const { isAuthenticated, isLoading, userRole, faculty, program, user } =
		useAuth();
	const { selectedPeriod, selectedPeriodId, setSelectedPeriodId, periods } =
		usePeriodState();
	const isDirector = userRole === "director";
	const navigate = useNavigate();
	const isAdmin = userRole === "administrator";

	const allowedPrimaryNav = PRIMARY_NAV.filter(
		(i) => !!userRole && i.roles.includes(userRole),
	);
	const allowedAdminDashboardNav = ADMIN_DASHBOARD_NAV.filter(
		(i) => !!userRole && i.roles.includes(userRole),
	);
	const allowedAdminManagementNav = ADMIN_MANAGEMENT_NAV.filter(
		(i) => !!userRole && i.roles.includes(userRole),
	);

	const renderWorkgroupItem = (
		item: MenuItem | MenuItemGroup,
		level: number = 0,
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
						<CollapsibleTrigger asChild>
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
									<React.Fragment key={child.id}>
										{renderWorkgroupItem(child, level + 1)}
									</React.Fragment>
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
		const isLocked = item.isLocked;
		const isCompleted = item.isCompleted;

		const disabledClasses = isLocked
			? "opacity-50 pointer-events-none grayscale cursor-not-allowed"
			: "hover:bg-accent hover:text-accent-foreground";

		const completedClasses = isCompleted
			? "text-emerald-600 dark:text-emerald-400 font-medium"
			: "text-foreground";

		return (
			<SidebarMenuSubItem key={item.id}>
				<SidebarMenuButton
					asChild
					className={`h-fit text-sm transition-all ${isDirector ? disabledClasses : ""} ${isDirector ? completedClasses : ""}`}
					style={{ paddingLeft: `${8 + paddingLeft}px` }}
				>
					<Link to={item.href} disabled={isLocked && isDirector}>
						<Tooltip>
							<TooltipTrigger className="flex items-center gap-2 w-full text-left">
								{Icon && typeof Icon === "object" && "$$typeof" in Icon ? (
									/* Si es un componente de React (Lucide), lo renderizamos directamente */
									<Icon
										className={`size-3.5 shrink-0 ${isDirector ? (isCompleted ? "text-emerald-500" : "text-muted-foreground") : isCompleted ? "text-emerald-500" : "text-muted-foreground"}`}
									/>
								) : (
									/* Si es data cruda (Hugeicons), usamos su wrapper */
									<HugeiconsIcon
										icon={Icon}
										className={`size-3.5 shrink-0 ${isDirector && isCompleted ? "text-emerald-500" : "text-muted-foreground"}`}
									/>
								)}
								<span className="flex-1 text-sm truncate max-w-40">
									{item.name}
								</span>
								{isDirector && isCompleted && (
									<span className="text-[9px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-sm ml-auto shrink-0">
										Listo
									</span>
								)}
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>
									{item.name} {isLocked ? "(Bloqueado)" : ""}
								</p>
							</TooltipContent>
						</Tooltip>
					</Link>
				</SidebarMenuButton>
			</SidebarMenuSubItem>
		);
	}

	return (
		<Sidebar className="lg:border-r-0!" collapsible="icon" {...props}>
			<SidebarHeader className="px-2.5 py-3">
				<DropdownMenu>
					<DropdownMenuTrigger
						asChild
						className="flex justify-between items-center"
					>
						<section className="flex items-center gap-2.5 w-full hover:bg-sidebar-accent rounded-xl p-1.5 -m-1 transition-all duration-200 shrink-0 cursor-pointer group">
							<div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-background shrink-0 group-hover:scale-105 transition-transform duration-200">
								<img src={logoUATF} alt="logo uatf" className="w-fit h-fit" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="text-sm font-bold tracking-tight">UATF</h3>
								<p className="text-[10px] text-muted-foreground truncate">
									Portal Académico
								</p>
							</div>
							<div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
								<HugeiconsIcon
									icon={UnfoldMoreIcon}
									className="size-3 text-muted-foreground"
								/>
							</div>
						</section>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-fit">
						<DropdownMenuGroup>
							<Card className="w-full glass-card border-border/40 shadow-lg">
								<CardHeader className="pb-2">
									<CardTitle className="text-base font-display flex items-center gap-2">
										<div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
											<HugeiconsIcon
												icon={UserAccountIcon}
												className="size-4 text-primary"
											/>
										</div>
										Perfil
									</CardTitle>
								</CardHeader>
								<DropdownMenuSeparator />
								<CardContent className="space-y-1.5 text-sm pt-3">
									<p className="text-muted-foreground">
										Nombre:{" "}
										<span className="text-foreground font-medium">
											{user?.displayName}
										</span>
									</p>
									<p className="text-muted-foreground">
										Correo:{" "}
										<span className="text-foreground font-medium">
											{user?.email}
										</span>
									</p>
									<p className="text-muted-foreground">
										Rol:{" "}
										<span className="text-foreground font-medium">
											{userRole === "director" ? "Director" : "Administrador"}
										</span>
									</p>
									{userRole === "director" ? (
										<p className="text-muted-foreground">
											Facultad:{" "}
											<span className="text-foreground font-medium">
												{faculty}
											</span>
										</p>
									) : null}
									{userRole === "director" ? (
										<p className="text-muted-foreground">
											Programa:{" "}
											<span className="text-foreground font-medium">
												{program}
											</span>
										</p>
									) : null}
								</CardContent>
							</Card>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				{isAuthenticated && (
					<div className="mt-3 px-1">
						{isDirector ? (
							<div className="flex flex-col gap-1 px-3 py-2 text-xs text-muted-foreground bg-accent/40 rounded-lg border border-border/40">
								<span className="font-semibold text-foreground">
									Gestión Actual:
								</span>
								<span className="truncate">
									{selectedPeriod?.name || "Cargando..."}
								</span>
							</div>
						) : (
							<div className="space-y-1">
								<span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
									Gestión Académica
								</span>
								<Select
									value={selectedPeriodId}
									onValueChange={setSelectedPeriodId}
								>
									<SelectTrigger className="w-full h-8 text-xs bg-accent/40 dark:bg-input/20 border-border/40">
										<SelectValue placeholder="Seleccionar Periodo" />
									</SelectTrigger>
									<SelectContent position="popper" className="w-56">
										{periods.map((p) => (
											<SelectItem
												key={p.id}
												value={p.id}
												className={`text-xs bg-slate-100 flex justify-between`}
											>
												{p.name.replace("Academica ", "")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>
				)}
			</SidebarHeader>

			<SidebarContent className="px-2.5">
				{isAuthenticated && (
					<>
						<SidebarGroup>
							<SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
								<span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70">
									Dashboard
								</span>
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{allowedPrimaryNav.map((item) => (
										<SidebarMenuItem key={item.to}>
											<Link to={item.to}>
												<SidebarMenuButton className="h-8 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200">
													<HugeiconsIcon
														icon={item.icon}
														className="size-3.5"
													/>
													<span>{item.label}</span>
												</SidebarMenuButton>
											</Link>
										</SidebarMenuItem>
									))}
									{allowedAdminDashboardNav.map((item) => (
										<SidebarMenuItem key={item.to}>
											<Link to={item.to}>
												<SidebarMenuButton className="h-8 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200">
													<HugeiconsIcon
														icon={item.icon}
														className="size-3.5"
													/>
													<span>{item.label}</span>
												</SidebarMenuButton>
											</Link>
										</SidebarMenuItem>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>

						{isAdmin && (
							<SidebarGroup className="p-0 mt-4">
								<SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
									<span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70">
										Administración
									</span>
								</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{allowedAdminManagementNav.map((item) => (
											<SidebarMenuItem key={item.to}>
												<Link to={item.to}>
													<SidebarMenuButton className="h-8 text-sm rounded-lg hover:bg-accent/60 transition-all duration-200">
														<HugeiconsIcon
															icon={item.icon}
															className="size-3.5"
														/>
														<span>{item.label}</span>
													</SidebarMenuButton>
												</Link>
											</SidebarMenuItem>
										))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						)}

						{(isAdmin || isDirector) && (
							<SidebarGroup className="p-0 mt-4">
								<SidebarGroupLabel className="flex items-center justify-between px-0 h-6">
									<span className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/70 font-display">
										Reportes de Gestión
									</span>
								</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										{resultGroups.map((item) => renderWorkgroupItem(item))}
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						)}
					</>
				)}
			</SidebarContent>

			<SidebarFooter className="px-2.5 pb-3 group-data-[collapsible=icon]:hidden">
				<div className="border-t border-border/40 pt-3">
					<div className="flex justify-between items-center gap-2">
						<ThemeToggle />
						{isAuthenticated && !isLoading && (
							<Button
								className="bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 hover:border-destructive/30 transition-all duration-200"
								onClick={async () => {
									await logoutMutation.mutateAsync();
									navigate({ to: "/" });
								}}
								disabled={logoutMutation.isPending}
								variant="ghost"
								size="sm"
							>
								<HugeiconsIcon icon={Logout01Icon} className="size-4" />
								{logoutMutation.isPending ? "Cerrando..." : "Cerrar Sesión"}
							</Button>
						)}
					</div>
				</div>
				{/* dev tag */}
				<div className="flex items-center justify-center pt-2">
					{import.meta.env.VITE_NODE_ENV === "development" ? (
						<Badge
							variant="outline"
							className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase animate-pulse"
						>
							Desarrollo
						</Badge>
					) : (
						<Badge
							variant="outline"
							className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase"
						>
							Producción
						</Badge>
					)}
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
