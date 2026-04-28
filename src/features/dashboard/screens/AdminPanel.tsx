import { Link } from "@tanstack/react-router"
import { useProtectedRoute } from "#/features/auth/hooks/useProtectedRoute"
import { Card, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card"
import { Building2, GraduationCap, DoorOpen, Award } from "lucide-react"

const adminLinks = [
    {
        title: "Facultades",
        description: "Gestionar las facultades de la universidad",
        href: "/dashboard/faculties",
        icon: Building2,
    },
    {
        title: "Carreras / Programas",
        description: "Gestionar carreras y programas académicos",
        href: "/dashboard/programs",
        icon: GraduationCap,
    },
    {
        title: "Modalidades de Ingreso",
        description: "Gestionar las modalidades de ingreso",
        href: "/dashboard/modalities",
        icon: DoorOpen,
    },
    {
        title: "Modalidades de Graduación",
        description: "Gestionar las modalidades de graduación",
        href: "/dashboard/graduation-modalities",
        icon: Award,
    },
]

export function AdminPanel() {
    const { isLoading, isAuthenticated } = useProtectedRoute()

    if (isLoading) {
        return <div className="flex h-full items-center justify-center">Verificando sesión...</div>
    }
    if (!isAuthenticated) return null

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-primary">Panel de Administración</h1>
                <p className="text-muted-foreground mt-1">Gestiona los datos de referencia de la universidad</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminLinks.map((link) => (
                    <Link key={link.href} to={link.href} className="block group">
                        <Card className="h-full transition-all hover:shadow-md hover:border-primary/30 group-hover:bg-muted/20">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <link.icon className="size-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{link.title}</CardTitle>
                                    <CardDescription>{link.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
