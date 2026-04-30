import { CheckCircle2 } from "lucide-react";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "#/shared/ui/card";
import { Link } from "@tanstack/react-router";

export function FormSuccess() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-border">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-3xl font-display font-bold text-foreground">
            ¡Envío Exitoso!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground font-body">
            Tu reporte ha sido enviado correctamente. Agradecemos tu participación y compromiso con los procesos académicos de la UATF.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
