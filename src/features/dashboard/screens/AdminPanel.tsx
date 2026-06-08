import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Award,
	Building2,
	DoorOpen,
	GraduationCap,
	Settings,
	Users,
} from "lucide-react";
import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute";
import { Loader } from "#/shared/components/Loader";
import { PageHeader } from "#/shared/components/PageHeader";
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";

const adminLinks = [
	{
		title: "Facultades",
		description: "Gestionar las facultades de la universidad",
		href: "/dashboard/faculties",
		icon: Building2,
		gradient: "from-blue-500/15 to-blue-600/5",
		accent: "text-blue-600 dark:text-blue-400",
		iconBg: "bg-blue-500/10 dark:bg-blue-400/10",
	},
	{
		title: "Carreras / Programas",
		description: "Gestionar carreras y programas académicos",
		href: "/dashboard/programs",
		icon: GraduationCap,
		gradient: "from-violet-500/15 to-violet-600/5",
		accent: "text-violet-600 dark:text-violet-400",
		iconBg: "bg-violet-500/10 dark:bg-violet-400/10",
	},
	{
		title: "Modalidades de Ingreso",
		description: "Gestionar las modalidades de ingreso",
		href: "/dashboard/modalities",
		icon: DoorOpen,
		gradient: "from-emerald-500/15 to-emerald-600/5",
		accent: "text-emerald-600 dark:text-emerald-400",
		iconBg: "bg-emerald-500/10 dark:bg-emerald-400/10",
	},
	{
		title: "Modalidades de Graduación",
		description: "Gestionar las modalidades de graduación",
		href: "/dashboard/graduation-modalities",
		icon: Award,
		gradient: "from-amber-500/15 to-amber-600/5",
		accent: "text-amber-600 dark:text-amber-400",
		iconBg: "bg-amber-500/10 dark:bg-amber-400/10",
	},
	{
		title: "Directores",
		description: "Gestionar directores y ver estado de formularios",
		href: "/dashboard/directors",
		icon: Users,
		gradient: "from-rose-500/15 to-rose-600/5",
		accent: "text-rose-600 dark:text-rose-400",
		iconBg: "bg-rose-500/10 dark:bg-rose-400/10",
	},
];

export function AdminPanel() {
	// 1. HOOK ZONE
	const { isLoading, isAuthenticated } = useProtectedRoute();

	// 2. EARLY RETURNS
	if (isLoading) {
		return <Loader />;
	}
	if (!isAuthenticated) return null;

	// 3. MAIN RENDER
	return (
		<div className="p-6 space-y-6 max-w-5xl mx-auto">
			<PageHeader
				icon={Settings}
				title="Panel de Administración"
				description="Gestiona los datos de referencia de la universidad"
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{adminLinks.map((link, index) => (
					<Link
						key={link.href}
						to={link.href}
						className={`block group animate-fade-up-delay-${Math.min(index + 1, 5)}`}
					>
						<Card
							className={`
                            h-full overflow-hidden relative
                            glass-card hover-lift
                            bg-linear-to-br ${link.gradient}
                            transition-all duration-300
                        `}
						>
							{/* Glass reflection */}
							<div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

							<CardHeader className="relative flex flex-row items-center gap-4 space-y-0">
								<div
									className={`flex size-12 items-center justify-center rounded-xl ${link.iconBg} group-hover:scale-110 transition-transform duration-300 shrink-0`}
								>
									<link.icon className={`size-6 ${link.accent}`} />
								</div>
								<div className="flex-1 min-w-0">
									<CardTitle className="text-base font-semibold">
										{link.title}
									</CardTitle>
									<CardDescription className="text-xs mt-0.5">
										{link.description}
									</CardDescription>
								</div>
								<ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 shrink-0" />
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
