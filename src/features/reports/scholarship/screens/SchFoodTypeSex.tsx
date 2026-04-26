import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";

export function SchFoodTypeSex() {
  return (
    <div className="flex items-center justify-center min-h-full p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center font-display text-primary">
            Beca Alimentación por tipo y género
          </CardTitle>
          <CardDescription className="text-center font-body text-muted-foreground">
            Este es el formulario de Beca Alimentación por tipo (Completa, Parcial) y género
          </CardDescription>
        </CardHeader>

        <CardContent>
          Aqui va el formulario
        </CardContent>
      </Card>
    </div>
  )
}

