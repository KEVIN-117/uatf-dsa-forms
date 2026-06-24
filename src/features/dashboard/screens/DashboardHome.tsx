import { Link } from "@tanstack/react-router";
import {
	Award,
	BookOpen,
	CalendarDays,
	CheckCircle2,
	Clock,
	FileCheck,
	FileText,
	GraduationCap,
	LayoutDashboard,
	TrendingUp,
	Users,
} from "lucide-react";
import { useMemo } from "react";
import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useDirectorProgress } from "#/features/reports/hooks/useDirectorProgress";
import { MODULE_LABELS } from "#/features/reports/utils/moduleLabels";
import { Loader } from "#/shared/components/Loader";
import { useFormTemplates } from "#/shared/hooks/useFormBuilder";
import { useAllResponses } from "#/shared/hooks/useFormResponses";
import { FormModules, type FormResponseDef } from "#/shared/types/dynamic-form";
import { Badge } from "#/shared/ui/badge";
import { Button } from "#/shared/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/shared/ui/card";

const MODULE_ICON: Record<FormModules, typeof Users> = {
	[FormModules.student]: Users,
	[FormModules.graduate]: GraduationCap,
	[FormModules.teacher]: BookOpen,
	[FormModules.scholarships]: Award,
};

const MODULE_GRADIENT: Record<FormModules, string> = {
	[FormModules.student]: "from-blue-500/20 to-blue-600/5",
	[FormModules.graduate]: "from-violet-500/20 to-violet-600/5",
	[FormModules.teacher]: "from-emerald-500/20 to-emerald-600/5",
	[FormModules.scholarships]: "from-amber-500/20 to-amber-600/5",
};

const MODULE_ACCENT: Record<FormModules, string> = {
	[FormModules.student]: "text-blue-600 dark:text-blue-400",
	[FormModules.graduate]: "text-violet-600 dark:text-violet-400",
	[FormModules.teacher]: "text-emerald-600 dark:text-emerald-400",
	[FormModules.scholarships]: "text-amber-600 dark:text-amber-400",
};

const MODULE_ICON_BG: Record<FormModules, string> = {
	[FormModules.student]: "bg-blue-500/10 dark:bg-blue-400/10",
	[FormModules.graduate]: "bg-violet-500/10 dark:bg-violet-400/10",
	[FormModules.teacher]: "bg-emerald-500/10 dark:bg-emerald-400/10",
	[FormModules.scholarships]: "bg-amber-500/10 dark:bg-amber-400/10",
};

function formatDate(ts: number) {
	return new Date(ts).toLocaleString("es-BO", {
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function relativeTime(ts: number) {
	const diff = Date.now() - ts;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Hace un momento";
	if (mins < 60) return `Hace ${mins} min`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `Hace ${hours}h`;
	const days = Math.floor(hours / 24);
	return `Hace ${days}d`;
}

function ProgressBar({
	value,
	max,
	label,
}: {
	value: number;
	max: number;
	label: string;
}) {
	const pct = max > 0 ? Math.round((value / max) * 100) : 0;
	return (
		<div className="space-y-1.5">
			<div className="flex justify-between items-center text-xs">
				<span className="text-muted-foreground font-medium">{label}</span>
				<span className="font-semibold text-foreground">{pct}%</span>
			</div>
			<div className="h-2 rounded-full bg-muted/60 overflow-hidden">
				<div
					className="h-full rounded-full bg-linear-to-r from-primary via-primary/80 to-primary/60 transition-all duration-1000 ease-out"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function StatCard({
	icon: Icon,
	label,
	value,
	accent = "text-primary",
	iconBg = "bg-primary/10",
	description,
}: {
	icon: typeof Users;
	label: string;
	value: number | string;
	accent?: string;
	iconBg?: string;
	description?: string;
}) {
	return (
		<Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group">
			{/* Decorative gradient corner */}
			<div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-linear-to-br from-primary/8 to-transparent group-hover:scale-125 transition-transform duration-500" />
			<CardHeader className="flex flex-row items-center gap-4 pb-2 space-y-0">
				<div
					className={`flex items-center justify-center w-11 h-11 rounded-xl ${iconBg} shrink-0`}
				>
					<Icon className={`w-5 h-5 ${accent}`} />
				</div>
				<div className="flex-1 min-w-0">
					<CardDescription className="text-xs font-medium tracking-wide uppercase">
						{label}
					</CardDescription>
					<CardTitle className="text-2xl font-bold tracking-tight mt-0.5">
						{value}
					</CardTitle>
				</div>
			</CardHeader>
			{description && (
				<CardContent className="pt-0 pb-4">
					<p className="text-xs text-muted-foreground">{description}</p>
				</CardContent>
			)}
		</Card>
	);
}

function ModuleCard({ mod, count }: { mod: FormModules; count: number }) {
	const Icon = MODULE_ICON[mod];
	return (
		<div
			className={`
        relative overflow-hidden rounded-xl border border-border/40 p-4
        bg-linear-to-br ${MODULE_GRADIENT[mod]}
        backdrop-blur-sm
        hover:border-border/60 hover:shadow-md hover:-translate-y-0.5
        transition-all duration-300 group cursor-default
      `}
		>
			{/* Glass reflection */}
			<div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />

			<div className="relative flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div
						className={`flex items-center justify-center w-10 h-10 rounded-lg ${MODULE_ICON_BG[mod]} group-hover:scale-110 transition-transform duration-300`}
					>
						<Icon className={`w-5 h-5 ${MODULE_ACCENT[mod]}`} />
					</div>
					<div>
						<p className="text-sm font-semibold text-foreground">
							{MODULE_LABELS[mod]}
						</p>
						<p className="text-[11px] text-muted-foreground">
							Registros enviados
						</p>
					</div>
				</div>
				<span className="text-2xl font-bold text-foreground tabular-nums">
					{count}
				</span>
			</div>
		</div>
	);
}

function ResponseItem({ resp }: { resp: FormResponseDef }) {
	const Icon = MODULE_ICON[resp.module];
	return (
		<div className="flex items-center gap-4 p-3 rounded-xl border border-border/30 bg-card/60 backdrop-blur-sm hover:bg-accent/30 hover:border-border/50 transition-all duration-200 group">
			<div
				className={`flex items-center justify-center w-9 h-9 rounded-lg ${MODULE_ICON_BG[resp.module]} shrink-0 group-hover:scale-110 transition-transform duration-200`}
			>
				<Icon className={`w-4 h-4 ${MODULE_ACCENT[resp.module]}`} />
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2">
					<p className="text-sm font-semibold text-foreground truncate">
						{MODULE_LABELS[resp.module]}
					</p>
					<Badge
						variant="outline"
						className="text-[10px] px-1.5 py-0 h-4 shrink-0 border-border/50"
					>
						{resp.templateId.slice(0, 8)}
					</Badge>
				</div>
				<p className="text-xs text-muted-foreground mt-0.5 truncate">
					{formatDate(resp.createdAt)}
				</p>
			</div>

			<span className="text-[11px] text-muted-foreground font-medium shrink-0 hidden sm:block">
				{relativeTime(resp.createdAt)}
			</span>
		</div>
	);
}

export function DashboardHome() {
	const { isLoading: authLoading, isAuthenticated } = useProtectedRoute();
	const { userRole, user } = useAuth();
	const { data: allResponses = [], isLoading: responsesLoading } =
		useAllResponses();
	const { data: templates = [] } = useFormTemplates();
	const { data: progress } = useDirectorProgress();

	const myResponses = useMemo(
		() =>
			allResponses
				.filter((r) => r.submittedBy === user?.email)
				.sort((a, b) => b.createdAt - a.createdAt),
		[allResponses, user?.email],
	);

	const completedStepsCount = progress?.completedSteps?.length ?? 0;
	const totalSteps = templates.length;
	const pendingSteps = Math.max(totalSteps - completedStepsCount, 0);

	const myResponsesByModule = useMemo(() => {
		return myResponses.reduce(
			(acc, item) => {
				acc[item.module] = (acc[item.module] ?? 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);
	}, [myResponses]);

	const globalByModule = useMemo(() => {
		return allResponses.reduce(
			(acc, item) => {
				acc[item.module] = (acc[item.module] ?? 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);
	}, [allResponses]);

	if (authLoading) return <Loader text="Cargando dashboard..." />;
	if (!isAuthenticated) return null;

	const isDirector = userRole === "director";
	const greeting = getGreeting();
	const displayName =
		user?.displayName || user?.email?.split("@")[0] || "Usuario";

	return (
		<div className="p-6 space-y-8 max-w-7xl mx-auto">
			<div className="animate-fade-up relative overflow-hidden rounded-2xl border border-border/40 p-6 md:p-8 bg-linear-to-br from-primary/8 via-card to-secondary/5 glass-card">
				<div className="gradient-blob -top-20 -right-20 w-48 h-48 bg-primary/5" />
				<div className="gradient-blob -bottom-16 -left-16 w-40 h-40 bg-secondary/8" />

				<div className="relative flex items-start gap-4">
					<div className="hidden md:flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
						<LayoutDashboard className="w-7 h-7 text-primary" />
					</div>
					<div>
						<p className="text-sm font-medium text-muted-foreground">
							{greeting}
						</p>
						<h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mt-0.5">
							{displayName}
						</h1>
						<p className="text-sm text-muted-foreground mt-1.5 max-w-lg">
							{isDirector
								? "Aquí puedes revisar tu progreso, formularios enviados y el estado de cada módulo."
								: "Panel de control general — gestiona formularios, visualiza estadísticas y monitorea el avance del sistema."}
						</p>
					</div>
				</div>
			</div>

			{isDirector ? (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up-delay-1">
						<StatCard
							icon={CheckCircle2}
							label="Completados"
							value={completedStepsCount}
							accent="text-emerald-600 dark:text-emerald-400"
							iconBg="bg-emerald-500/10"
							description={`De ${totalSteps} formularios totales`}
						/>
						<StatCard
							icon={Clock}
							label="Pendientes"
							value={pendingSteps}
							accent="text-amber-600 dark:text-amber-400"
							iconBg="bg-amber-500/10"
							description={
								pendingSteps === 0
									? "¡Todo al día!"
									: "Formularios por completar"
							}
						/>
						<StatCard
							icon={FileText}
							label="Mis envíos"
							value={myResponses.length}
							description="Registros totales enviados"
						/>
					</div>

					<Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden dash-animate dash-delay-2">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
									<TrendingUp className="w-4.5 h-4.5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-base">Progreso general</CardTitle>
									<CardDescription className="text-xs">
										{completedStepsCount} de {totalSteps} formularios
										completados
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<ProgressBar
								value={completedStepsCount}
								max={totalSteps}
								label="Avance total"
							/>
						</CardContent>
					</Card>

					{/* Receipt link — visible when the director has submissions */}
					{myResponses.length > 0 && (
						<Card className="border-border/40 bg-linear-to-br from-emerald-500/8 via-card to-primary/5 backdrop-blur-sm shadow-sm overflow-hidden dash-animate dash-delay-2">
							<CardContent className="p-5 flex items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10">
										<FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
									</div>
									<div>
										<p className="text-sm font-semibold text-foreground">
											Comprobante de envío
										</p>
										<p className="text-xs text-muted-foreground">
											Consulta o descarga tu resumen de reportes
										</p>
									</div>
								</div>
								<Button
									asChild
									size="sm"
									className="gap-2 font-semibold hover-lift shrink-0"
								>
									<Link to="/formStatus/success">
										Ver comprobante
									</Link>
								</Button>
							</CardContent>
						</Card>
					)}

					<Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden dash-animate dash-delay-3">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
									<LayoutDashboard className="w-4.5 h-4.5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-base">Envíos por módulo</CardTitle>
									<CardDescription className="text-xs">
										Registros enviados desde tu cuenta ({user?.email})
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="grid gap-3 sm:grid-cols-2">
							{Object.values(FormModules).map((mod) => (
								<ModuleCard
									key={mod}
									mod={mod}
									count={myResponsesByModule[mod] ?? 0}
								/>
							))}
						</CardContent>
					</Card>
				</>
			) : (
				<>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 dash-animate dash-delay-1">
						<StatCard
							icon={FileText}
							label="Total formularios"
							value={templates.length}
							description="Templates activos en el sistema"
						/>
						<StatCard
							icon={TrendingUp}
							label="Total respuestas"
							value={allResponses.length}
							accent="text-emerald-600 dark:text-emerald-400"
							iconBg="bg-emerald-500/10"
							description="Registros recibidos de todos los directores"
						/>
						<StatCard
							icon={LayoutDashboard}
							label="Módulos activos"
							value={Object.values(FormModules).length}
							accent="text-violet-600 dark:text-violet-400"
							iconBg="bg-violet-500/10"
							description="Categorías de formularios disponibles"
						/>
					</div>

					<Card className="border-border/40 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden dash-animate dash-delay-2">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
									<LayoutDashboard className="w-4.5 h-4.5 text-primary" />
								</div>
								<div>
									<CardTitle className="text-base">
										Respuestas por módulo
									</CardTitle>
									<CardDescription className="text-xs">
										Vista global de todos los registros del sistema
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							{Object.values(FormModules).map((mod) => (
								<ModuleCard
									key={mod}
									mod={mod}
									count={globalByModule[mod] ?? 0}
								/>
							))}
						</CardContent>
					</Card>
				</>
			)}
		</div>
	);
}

function getGreeting(): string {
	const h = new Date().getHours();
	if (h < 12) return "☀️ Buenos días,";
	if (h < 18) return "🌤️ Buenas tardes,";
	return "🌙 Buenas noches,";
}
