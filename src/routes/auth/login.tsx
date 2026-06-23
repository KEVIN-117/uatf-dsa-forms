import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { DirectorLogin } from "#/features/auth/components/DirectorLogin";
import { Login } from "#/features/auth/components/Login";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";

export const Route = createFileRoute("/auth/login")({
	component: AuthLoginRoute,
	notFoundComponent: () => <RouteNotFoundState scope="autenticación" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="autenticación" />
	),
});

function AuthLoginRoute() {
	const [role, setRole] = useState<"director" | "admin">("director");

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors duration-200">
			{/* Decorative glows */}
			<div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
			<div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

			<div className="w-full max-w-md space-y-6 z-10 relative">
				{/* Enlace para volver */}
				<div className="flex justify-start">
					<Link
						to="/"
						className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors py-1.5 px-3 rounded-lg hover:bg-card border border-border/40"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						Volver al Inicio
					</Link>
				</div>

				{/* Selector de rol accesible */}
				<div
					className="bg-card/85 backdrop-blur-xs border border-border/60 rounded-xl p-1.5 shadow-xs flex w-full"
					role="tablist"
					aria-label="Opciones de acceso"
				>
					<button
						type="button"
						role="tab"
						aria-selected={role === "director"}
						onClick={() => setRole("director")}
						className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-primary ${
							role === "director"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Director de Carrera
					</button>
					<button
						type="button"
						role="tab"
						aria-selected={role === "admin"}
						onClick={() => setRole("admin")}
						className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-primary ${
							role === "admin"
								? "bg-primary text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Personal Admin
					</button>
				</div>

				{/* Render de pantallas */}
				<div className="transition-all duration-300">
					{role === "director" ? <DirectorLogin /> : <Login />}
				</div>
			</div>
		</div>
	);
}
