import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/ui/card';
import { useProtectedRoute } from '#/features/auth/hooks/useProtectedRoute';


export function AdminPanel() {
    // 1. Llamamos a nuestra protección de ruta
    const { isLoading, isAuthenticated } = useProtectedRoute();

    // 2. Mientras Firebase revisa la sesión, mostramos un cargador (evita destellos de pantalla)
    if (isLoading) {
        return <div className="flex h-full items-center justify-center">Verificando sesión...</div>;
    }

    // 3. Si no está autenticado, devolvemos null (el hook useProtectedRoute ya lo está redirigiendo)
    if (!isAuthenticated) return null;

    // 4. Si todo está bien, mostramos la página
    return (
        <div className="flex items-center justify-center min-h-full p-4 bg-background">
            <Card className="w-full max-w-md shadow-lg border-border">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl text-center font-display text-primary">
                        Panel de Administrador
                    </CardTitle>
                    <CardDescription className="text-center font-body text-muted-foreground">
                        Aquí puedes gestionar los formularios
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    Panel de Administrador
                </CardContent>
            </Card>
        </div>
    )
}
