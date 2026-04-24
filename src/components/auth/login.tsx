import { useLogin, type LoginSchema } from "#/hooks/useAuth";
import { useForm } from '@tanstack/react-form'
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const defaultValues: LoginSchema = {
    email: '',
    password: '',
}

export function Login() {
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const [authError, setAuthError] = useState<string | null>(null);

    const form = useForm({
        defaultValues: defaultValues,
        onSubmit: async ({ value }) => {
            setAuthError(null); // Limpiamos errores previos
            try {
                // 4. Ejecutamos la mutación real de Firebase
                await loginMutation.mutateAsync({
                    email: value.email,
                    password: value.password
                });

                // 5. Si es exitoso, redirigimos al dashboard (o la ruta que desees)
                navigate({ to: '/dashboard' });

            } catch (error: any) {
                // 6. Manejo de errores de Firebase
                console.error("Error de autenticación:", error);
                if (error.code === 'auth/invalid-credential') {
                    setAuthError('El correo o la contraseña son incorrectos.');
                } else if (error.code === 'auth/too-many-requests') {
                    setAuthError('Demasiados intentos fallidos. Intenta más tarde.');
                } else {
                    setAuthError('Ocurrió un error al intentar iniciar sesión.');
                }
            }
        },
    })

    return (
        <div className="flex items-center justify-center min-h-full p-4 bg-background">
            <Card className="w-full max-w-md shadow-lg border-border">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-2xl text-center font-display text-primary">
                        Acceso Académico
                    </CardTitle>
                    <CardDescription className="text-center font-body text-muted-foreground">
                        Ingresa tus credenciales institucionales para continuar
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="space-y-5 font-body"
                    >
                        {/* Mensaje de error general de autenticación */}
                        {authError && (
                            <div className="p-3 text-sm text-white bg-destructive rounded-md text-center">
                                {authError}
                            </div>
                        )}
                        <form.Field
                            name="email"
                            validators={{
                                onChange: ({ value }) => {
                                    if (value.trim().length === 0) {
                                        return 'El correo es obligatorio';
                                    }
                                    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                        return 'Formato de correo inválido';
                                    }
                                    return undefined;
                                }
                            }}
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor={field.name} className="font-semibold">
                                        Correo Electrónico
                                    </Label>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="estudiante@institucion.edu"
                                        className="focus-academic"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <div className="text-sm text-destructive font-medium">
                                            {field.state.meta.errors.join(', ')}
                                        </div>
                                    )}
                                </div>
                            )}
                        />

                        <form.Field
                            name="password"
                            validators={{
                                onChange: ({ value }) => {
                                    if (!value || value.trim().length === 0) {
                                        return 'La contraseña es obligatoria';
                                    }
                                    if (value.length < 6) {
                                        return 'Debe tener al menos 6 caracteres';
                                    }
                                    if (!/[A-Z]/.test(value)) {
                                        return 'Debe tener al menos una mayúscula';
                                    }
                                    if (!/[a-z]/.test(value)) {
                                        return 'Debe tener al menos una minúscula';
                                    }
                                    if (!/[0-9]/.test(value)) {
                                        return 'Debe tener al menos un número';
                                    }
                                    if (!/[!@#$%^&*()]/.test(value)) {
                                        return 'Debe tener al menos un caracter especial';
                                    }
                                    return undefined;
                                }
                            }}
                            children={(field) => (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor={field.name} className="font-semibold">
                                            Contraseña
                                        </Label>
                                        <a href="#" className="text-xs text-primary hover:underline focus-academic rounded-sm">
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                    <Input
                                        id={field.name}
                                        name={field.name}
                                        type="password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="••••••••"
                                        className="focus-academic"
                                    />
                                    {field.state.meta.errors.length > 0 && (
                                        <div className="text-sm text-destructive font-medium">
                                            {field.state.meta.errors.join(', ')}
                                        </div>
                                    )}
                                </div>
                            )}
                        />

                        <form.Subscribe
                            selector={(state) => [state.canSubmit, state.isSubmitting]}
                            children={([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    className="w-full font-bold py-5 text-base mt-6 transition-all"
                                    disabled={!canSubmit || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="animate-spin h-5 w-5" />
                                            Verificando...
                                        </span>
                                    ) : (
                                        "Ingresar a la Plataforma"
                                    )}
                                </Button>
                            )}
                        />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}