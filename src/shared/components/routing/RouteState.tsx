import { Link } from "@tanstack/react-router";
import { AlertTriangle, Home, SearchX } from "lucide-react";
import { Button } from "#/shared/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/shared/ui/card";

type RouteStateProps = {
	scope?: string;
};

type RouteErrorProps = RouteStateProps & {
	error: unknown;
};

export function RouteNotFoundState({ scope = "este módulo" }: RouteStateProps) {
	return (
		<div className="flex min-h-[60vh] items-center justify-center p-6">
			<Card className="w-full max-w-xl glass-card border-border/40 shadow-lg overflow-hidden relative animate-fade-up">
				{/* Decorative gradient */}
				<div className="gradient-blob -top-16 -right-16 w-40 h-40 bg-primary/5" />

				<CardHeader className="relative text-center">
					<div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-scale-bounce">
						<SearchX className="size-7 text-amber-600 dark:text-amber-400" />
					</div>
					<CardTitle className="text-xl font-display">
						No se encontró la página
					</CardTitle>
					<CardDescription className="mt-1">
						La ruta solicitada no existe o ya no está disponible en {scope}.
					</CardDescription>
				</CardHeader>
				<CardContent className="relative flex justify-center pb-6">
					<Button asChild className="hover-lift">
						<Link to="/dashboard/dashboard">
							<Home className="mr-2 size-4" />
							Ir al Dashboard
						</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

export function RouteErrorState({
	error,
	scope = "este módulo",
}: RouteErrorProps) {
	const message =
		error instanceof Error ? error.message : "Ocurrió un error inesperado";

	return (
		<div className="flex min-h-[60vh] items-center justify-center p-6">
			<Card className="w-full max-w-xl glass-card border-destructive/20 shadow-lg overflow-hidden relative animate-fade-up">
				{/* Decorative gradient */}
				<div className="gradient-blob -top-16 -right-16 w-40 h-40 bg-destructive/5" />

				<CardHeader className="relative text-center">
					<div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/20 animate-scale-bounce">
						<AlertTriangle className="size-7 text-destructive" />
					</div>
					<CardTitle className="text-xl font-display">
						Error al cargar la ruta
					</CardTitle>
					<CardDescription className="mt-1">
						Se produjo un problema al renderizar {scope}. Puedes volver al
						dashboard.
					</CardDescription>
				</CardHeader>
				<CardContent className="relative space-y-4 pb-6">
					<p className="rounded-xl bg-muted/60 border border-border/40 p-3 text-sm text-muted-foreground font-mono">
						{message}
					</p>
					<div className="flex justify-center">
						<Button asChild variant="outline" className="hover-lift">
							<Link to="/dashboard/dashboard">
								<Home className="mr-2 size-4" />
								Volver al Dashboard
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
