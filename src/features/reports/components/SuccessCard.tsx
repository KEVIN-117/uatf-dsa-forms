import { CheckCircle2, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/shared/ui/card";
import { Link } from "@tanstack/react-router";

interface SuccessCardProps {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "default" | "minimal" | "readonly";
}

export function SuccessCard({ isLoading = false, loadingText = "Cargando resumen de envíos...", variant = "default" }: SuccessCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto text-center glass-card shadow-lg border-border/40 overflow-hidden relative animate-fade-up">
      <div className="gradient-blob -top-16 -right-16 w-40 h-40 bg-emerald-500/8" />
      <div className="gradient-blob -bottom-12 -left-12 w-36 h-36 bg-primary/5" />

      <CardHeader className="relative flex flex-col items-center space-y-4 pt-8">
        {isLoading ? (
          <div className="relative flex items-center justify-center w-20 h-20">
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
              className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10"
              style={{ animation: "loader-icon-float 2s ease-in-out infinite" }}
            >
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="rounded-full bg-emerald-500/10 p-4 dark:bg-emerald-400/10 animate-scale-bounce">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-secondary animate-pulse" />
          </div>
        )}

        <CardTitle className="text-3xl font-display font-bold text-foreground">
          {isLoading ? "Procesando..." : "¡Envío Exitoso!"}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
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
              {loadingText}
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
        ) : (
          <p className="text-muted-foreground font-body leading-relaxed">
            Tu reporte ha sido enviado correctamente. Agradecemos tu participación y compromiso con los procesos académicos de la UATF.
          </p>
        )}
      </CardContent>

      {!isLoading && variant === "default" && (
        <CardFooter className="relative flex justify-center pb-8">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 hover-lift">
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
