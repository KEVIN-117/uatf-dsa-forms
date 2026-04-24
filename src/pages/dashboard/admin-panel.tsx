import { useProtectedRoute } from '@/hooks/useProtectedRoute';


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
        <div>
            <h1>Bienvenido al Panel Privado</h1>
            {/* Contenido de la entidad educativa */}
        </div>
    )
}