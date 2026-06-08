import { GraduationCap } from "lucide-react";

interface LoaderProps {
	text?: string;
}

export function Loader({ text = "Verificando sesión..." }: LoaderProps) {
	return (
		<section className="flex h-screen items-center justify-center bg-background overflow-hidden">
			<div className="flex flex-col items-center gap-6">
				<div className="relative flex items-center justify-center w-24 h-24">
					<div
						className="absolute inset-0 rounded-full border-[3px] border-primary/10"
						style={{
							borderTopColor: "var(--primary)",
							borderRightColor: "var(--primary)",
							animation: "loader-spin-slow 2.5s linear infinite",
							filter: "drop-shadow(0 0 6px oklch(0.45 0.15 250 / 0.3))",
						}}
					/>
					<div
						className="absolute inset-2 rounded-full border-[2.5px] border-secondary/10"
						style={{
							borderBottomColor: "var(--secondary)",
							borderLeftColor: "var(--secondary)",
							animation: "loader-spin-reverse 1.8s linear infinite",
						}}
					/>

					<div
						className="absolute inset-4 rounded-full border-2 border-primary/20"
						style={{
							animation: "loader-pulse-ring 2s ease-in-out infinite",
						}}
					/>

					<div
						className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10"
						style={{
							animation: "loader-icon-float 2s ease-in-out infinite",
						}}
					>
						<GraduationCap className="w-5 h-5 text-primary" />
					</div>
				</div>
				<div className="flex flex-col items-center gap-2">
					<p
						className="text-sm font-semibold tracking-wide"
						style={{
							background:
								"linear-gradient(90deg, var(--muted-foreground) 0%, var(--foreground) 50%, var(--muted-foreground) 100%)",
							backgroundSize: "200% auto",
							WebkitBackgroundClip: "text",
							WebkitTextFillColor: "transparent",
							animation: "loader-shimmer 2.5s ease-in-out infinite",
						}}
					>
						{text}
					</p>

					<div className="flex gap-1.5">
						{[0, 1, 2].map((i) => (
							<span
								key={i}
								className="block w-1.5 h-1.5 rounded-full bg-primary/60"
								style={{
									animation: `loader-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
								}}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
