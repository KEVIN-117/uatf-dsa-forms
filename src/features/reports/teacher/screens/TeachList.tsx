import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";

export function TeachList() {
  return (
    <div className="flex items-center justify-center min-h-full p-4 bg-background">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center font-display text-primary">
            Nómina de Docentes
          </CardTitle>
          <CardDescription className="text-center font-body text-muted-foreground">
            Este es el formulario de Nómina de Docentes
          </CardDescription>
        </CardHeader>

        <CardContent>
          Aqui va el formulario
        </CardContent>
      </Card>
    </div>
  )
}

