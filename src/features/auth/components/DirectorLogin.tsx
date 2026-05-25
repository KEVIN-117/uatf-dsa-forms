import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Loader2, GraduationCap } from "lucide-react";
import { validateSchemaField } from "#/shared/lib/zod-form";
import {
  directorProfileFormSchema,
  type DirectorProfileFormValues,
} from "#/shared/schemas/director-profile";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";
import { Input } from "#/shared/ui/input";
import { Label } from "#/shared/ui/label";
import { useLogin } from "../hooks/useAuth";
import { useUsers } from "#/features/reference-data/useUsers";
import { FirebaseError } from "firebase/app";
import { Toast } from "#/shared/components/Toast";
import { useNavigate } from "@tanstack/react-router";

interface DirectorLoginProps {
  onSuccess?: () => void;
}

const defaultValues: DirectorProfileFormValues = {
  ci: "",
};

export function DirectorLogin({ onSuccess }: DirectorLoginProps) {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [authError, setAuthError] = useState<string | null>(null);
  const [directorError, setDirectorError] = useState<string | null>(null);
  const { data: users, isLoading } = useUsers();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setDirectorError(null);

      const result = directorProfileFormSchema.safeParse(value);

      if (!result.success) {
        return;
      }
      const user = users?.find((user) => user.ci.toString() === value.ci);
      if (!user) {
        setDirectorError("No se encontró un usuario con esa CI.");
        return;
      }
      try {
        await loginMutation.mutateAsync({
          email: user.email,
          password: `${user.ci}${import.meta.env.VITE_AUTH_PARSE}`,
        });
        form.reset();
        onSuccess?.();
        navigate({ to: "/dashboard/dashboard" });
      } catch (error: unknown) {
        Toast({
          title: "Error de acceso",
          type: "error",
          message: "Carnet de identidad no registrado o incorrecto.",
        });

        if (error instanceof FirebaseError) {
          if (error.code === "auth/invalid-credential") {
            setAuthError("El correo o la contraseña son incorrectos.");
            return;
          }

          if (error.code === "auth/too-many-requests") {
            setAuthError("Demasiados intentos fallidos. Intenta más tarde.");
            return;
          }
        }

        setAuthError("Ocurrió un error al intentar iniciar sesión.");
      }
    },
  });

  return (
    <Card className="w-full glass-card border-border/40 relative">
      {/* Decorative gradient */}
      <div className="gradient-blob -top-16 -left-16 w-40 h-40 bg-secondary/8" />

      <CardHeader className="relative space-y-2">
        <div className="flex justify-center mb-1">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-secondary/15 border border-secondary/25">
            <GraduationCap className="w-5 h-5 text-secondary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center font-display text-primary">
          Datos del director
        </CardTitle>
        <CardDescription className="text-center font-body text-muted-foreground">
          Registra quién llenará la información antes de entrar a los formularios.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          {authError ? (
            <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center text-sm text-destructive font-medium">
              {authError}
            </div>
          ) : null}
          <form.Field
            name="ci"
            validators={{
              onChange: ({ value }) =>
                validateSchemaField(directorProfileFormSchema, "ci", value),
              onSubmit: ({ value }) =>
                validateSchemaField(directorProfileFormSchema, "ci", value),
            }}
            children={(field) => {
              const showErrors =
                field.state.meta.isTouched || form.state.submissionAttempts > 0;

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="font-semibold">CI</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Carnet de identidad"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setDirectorError(null);
                      field.handleChange(event.target.value);
                    }}
                    className="focus-academic"
                  />
                  {showErrors && field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-destructive font-medium">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              );
            }}
          />

          {directorError ? (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-center text-sm text-amber-700 dark:text-amber-400 font-medium">
              {directorError}
            </div>
          ) : null}

          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button
                type="submit"
                className="mt-6 w-full py-5 text-base font-bold transition-all hover-lift"
                disabled={isSubmitting || loginMutation.isPending || isLoading}
              >
                {isSubmitting || loginMutation.isPending || isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verificando...
                  </span>
                ) : (
                  "Ingresar como Director"
                )}
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
}
