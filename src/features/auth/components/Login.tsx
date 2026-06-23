import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { FirebaseError } from "firebase/app";
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLogin } from "#/features/auth/hooks/useAuth";
import { Toast } from "#/shared/components/Toast";
import { validateSchemaField } from "#/shared/lib/zod-form";
import {
	type AdminLoginFormValues,
	adminLoginSchema,
} from "#/shared/schemas/auth";
import { Button } from "#/shared/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/shared/ui/card";
import { Input } from "#/shared/ui/input";
import { Label } from "#/shared/ui/label";

interface LoginProps {
	onSuccess?: () => void;
	redirectTo?: string | null;
}

const defaultValues: AdminLoginFormValues = {
	email: "",
	password: "",
};

export function Login({ onSuccess, redirectTo = "/dashboard" }: LoginProps) {
	const navigate = useNavigate();
	const loginMutation = useLogin();
	const [authError, setAuthError] = useState<string | null>(null);

	const form = useForm({
		defaultValues,
		onSubmit: async ({ value }) => {
			setAuthError(null);

			const result = adminLoginSchema.safeParse(value);

			if (!result.success) {
				return;
			}

			try {
				await loginMutation.mutateAsync(result.data);
				form.reset();
				onSuccess?.();

				if (redirectTo) {
					navigate({ to: redirectTo });
				}
			} catch (error: unknown) {
				Toast({
					title: "Error de acceso",
					type: "error",
					message: "Credenciales incorrectos.",
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
		<Card className="w-full max-w-4xl mx-auto glass-card border-border/40 relative">
			{/* Decorative gradient */}
			<div className="gradient-blob -top-16 -right-16 w-40 h-40 bg-primary/5" />

			<CardHeader className="relative space-y-2">
				<div className="flex justify-center mb-1">
					<div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 border border-primary/20">
						<ShieldCheck className="w-5 h-5 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl text-center font-display text-primary">
					Acceso administrativo
				</CardTitle>
				<CardDescription className="text-center font-body text-muted-foreground">
					Ingresa con una cuenta administradora para omitir el registro del
					director.
				</CardDescription>
			</CardHeader>
			<CardContent className="relative">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						event.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-5 font-body"
				>
					{authError ? (
						<div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-center text-sm text-destructive font-medium">
							{authError}
						</div>
					) : null}

					<form.Field
						name="email"
						validators={{
							onChange: ({ value }) =>
								validateSchemaField(adminLoginSchema, "email", value),
							onSubmit: ({ value }) =>
								validateSchemaField(adminLoginSchema, "email", value),
						}}
						children={(field) => {
							const showErrors =
								field.state.meta.isTouched || form.state.submissionAttempts > 0;

							return (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="font-semibold">
										Correo electrónico
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="email"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => {
											setAuthError(null);
											field.handleChange(event.target.value);
										}}
										placeholder="admin@institucion.edu"
										className="focus-academic"
									/>
									{showErrors && field.state.meta.errors.length > 0 ? (
										<div className="text-sm font-medium text-destructive">
											{field.state.meta.errors.join(", ")}
										</div>
									) : null}
								</div>
							);
						}}
					/>

					<form.Field
						name="password"
						validators={{
							onChange: ({ value }) =>
								validateSchemaField(adminLoginSchema, "password", value),
							onSubmit: ({ value }) =>
								validateSchemaField(adminLoginSchema, "password", value),
						}}
						children={(field) => {
							const showErrors =
								field.state.meta.isTouched || form.state.submissionAttempts > 0;

							return (
								<div className="space-y-2">
									<Label htmlFor={field.name} className="font-semibold">
										Contraseña
									</Label>
									<Input
										id={field.name}
										name={field.name}
										type="password"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) => {
											setAuthError(null);
											field.handleChange(event.target.value);
										}}
										placeholder="••••••••"
										className="focus-academic"
									/>
									{showErrors && field.state.meta.errors.length > 0 ? (
										<div className="text-sm font-medium text-destructive">
											{field.state.meta.errors.join(", ")}
										</div>
									) : null}
								</div>
							);
						}}
					/>

					<form.Subscribe
						selector={(state) => state.isSubmitting}
						children={(isSubmitting) => (
							<Button
								type="submit"
								className="mt-6 w-full py-5 text-base font-bold transition-all hover-lift"
								disabled={isSubmitting || loginMutation.isPending}
							>
								{isSubmitting || loginMutation.isPending ? (
									<span className="flex items-center justify-center gap-2">
										<Loader2 className="h-5 w-5 animate-spin" />
										Verificando...
									</span>
								) : (
									"Ingresar como administrador"
								)}
							</Button>
						)}
					/>
				</form>
			</CardContent>
		</Card>
	);
}
