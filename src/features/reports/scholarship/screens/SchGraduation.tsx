import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";

export function SchGraduation() {
  return (
    <div className="flex items-center justify-center min-h-full p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center font-display text-primary">
            Beca de Graduación
          </CardTitle>
          <CardDescription className="text-center font-body text-muted-foreground">
            Este es el formulario de Beca de Graduación
          </CardDescription>
        </CardHeader>

        <CardContent>
          Aqui va el formulario
        </CardContent>
      </Card>
    </div>
  )
}

