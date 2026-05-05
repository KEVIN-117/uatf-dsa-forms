import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/shared/ui/card";
import { Link } from "@tanstack/react-router";

export function FormSuccess() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md text-center glass-card shadow-lg border-border/40 overflow-hidden relative animate-fade-up">
        {/* Decorative gradient background */}
        <div className="gradient-blob -top-16 -right-16 w-40 h-40 bg-emerald-500/8" />
        <div className="gradient-blob -bottom-12 -left-12 w-36 h-36 bg-primary/5" />

        <CardHeader className="relative flex flex-col items-center space-y-4 pt-8">
          {/* Animated success icon */}
          <div className="relative">
            <div className="rounded-full bg-emerald-500/10 p-4 dark:bg-emerald-400/10 animate-scale-bounce">
              <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            {/* Sparkle accents */}
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-secondary animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-display font-bold text-foreground">
            ¡Envío Exitoso!
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className="text-muted-foreground font-body leading-relaxed">
            Tu reporte ha sido enviado correctamente. Agradecemos tu participación y compromiso con los procesos académicos de la UATF.
          </p>
        </CardContent>
        <CardFooter className="relative flex justify-center pb-8">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 hover-lift">
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
