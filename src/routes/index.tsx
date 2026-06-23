import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, MapPin, Users } from "lucide-react";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import {
	RouteErrorState,
	RouteNotFoundState,
} from "#/shared/components/routing/RouteState";

export const Route = createFileRoute("/")({
	component: HomePage,
	notFoundComponent: () => <RouteNotFoundState scope="inicio" />,
	errorComponent: ({ error }) => (
		<RouteErrorState error={error} scope="inicio" />
	),
});

function HomePage() {
	const { isAuthenticated } = useAuth();

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
			<section className="relative flex-1 flex items-center justify-center px-6 py-16 overflow-hidden">
				{/* Decorative soft parchment watermark glow */}
				<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
				<div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-primary/3 blur-[100px] pointer-events-none" />

				<div className="relative max-w-5xl mx-auto text-center z-10 w-full">
					{/* Badge informativo */}
					<div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-semibold backdrop-blur-xs">
						<MapPin className="w-4 h-4 text-primary/80" />
						<span>Potosí, Bolivia</span>
						<span className="mx-2 text-primary/30">•</span>
						<span>Vicerrectorado • UATF</span>
					</div>

					<h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-primary mb-2 leading-tight">
						UNIVERSIDAD AUTÓNOMA "TOMÁS FRÍAS"
					</h1>
					<h2 className="font-display text-xl md:text-3xl font-medium text-foreground/80 mb-4 uppercase tracking-wider">
						Vicerrectorado
					</h2>
					<h3 className="font-display text-lg md:text-2xl text-foreground mb-8 max-w-2xl mx-auto border-y border-border/80 py-3">
						Dirección de Servicios Académicos
					</h3>

					<p className="text-lg md:text-xl text-muted-foreground font-body max-w-3xl mx-auto mb-10 leading-relaxed">
						Gestión de postulaciones, inscripciones y trámites académicos de la
						Universidad Autónoma Tomás Frías. Tu puerta de ingreso a la
						excelencia universitaria en Potosí.
					</p>

					{/* Botones de acción principales */}
					<div className="flex justify-center gap-4 mb-12">
						{isAuthenticated ? (
							<Link
								to="/dashboard"
								className="px-8 py-3.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all hover-lift shadow-md shadow-primary/10"
							>
								Ir al Panel de Control
							</Link>
						) : (
							<Link
								to="/auth/login"
								className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 border border-border/80 font-bold transition-all hover-lift shadow-xs"
							>
								Acceso Administrativo
							</Link>
						)}
					</div>

					<div className="flex flex-wrap justify-center gap-8 bg-card border border-border/60 rounded-2xl p-8 max-w-3xl mx-auto shadow-xs">
						<div className="text-center px-4">
							<div className="text-3xl font-display font-bold text-primary flex items-center justify-center gap-2">
								<Users className="w-6 h-6 text-primary/80" />
								+700
							</div>
							<div className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
								Postulantes PSA
							</div>
						</div>

						<div className="h-12 w-px bg-border/80 hidden sm:block" />

						<div className="text-center px-4">
							<div className="text-3xl font-display font-bold text-primary">
								20+
							</div>
							<div className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
								Carreras
							</div>
						</div>

						<div className="h-12 w-px bg-border/80 hidden sm:block" />

						<div className="text-center px-4">
							<div className="text-3xl font-display font-bold text-primary flex items-center justify-center gap-2">
								<Award className="w-6 h-6 text-primary/80" />
								Excelencia
							</div>
							<div className="text-muted-foreground text-xs uppercase tracking-wider mt-1">
								Admisión Especial
							</div>
						</div>
					</div>

					<div className="mt-12 text-xs text-muted-foreground max-w-md mx-auto">
						Dirección de Servicios Académicos • Ciudadela Universitaria, Potosí
						<br />
						Contacto:{" "}
						<span className="text-primary/90 font-medium">
							direccion_academica@uatf.edu.bo
						</span>{" "}
						• Teléfono: 6227323
					</div>
				</div>
			</section>

			{/* Footer con información institucional */}
			<footer className="bg-card/85 backdrop-blur-xs border-t border-border/60 py-8 mt-auto">
				<div className="max-w-7xl mx-auto px-6">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div className="flex items-center gap-3">
							<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 text-primary shadow-xs">
								<UniversityIcon className="w-5 h-5" />
							</div>
							<div className="text-left">
								<h3 className="font-display text-lg font-bold text-primary">
									Universidad Autónoma Tomás Frías
								</h3>
								<p className="text-xs text-muted-foreground">
									Vicerrectorado • Dirección de Servicios Académicos
								</p>
							</div>
						</div>

						<div className="text-center md:text-right">
							<div className="flex items-center justify-center md:justify-end gap-2 text-xs text-muted-foreground">
								<MapPin className="w-4 h-4 text-primary/70" />
								<span>Ciudadela Universitaria • Potosí, Bolivia</span>
							</div>
						</div>
					</div>

					<div className="mt-8 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground/80">
						<p>
							&copy; {new Date().getFullYear()} Universidad Autónoma Tomás
							Frías. Todos los derechos reservados.
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

function UniversityIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			role="img"
			aria-label="Icono de Universidad"
		>
			<title>Icono de Universidad</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				d="M12 19l9 2-9-18-9 18zm0 0v-8"
			/>
		</svg>
	);
}
