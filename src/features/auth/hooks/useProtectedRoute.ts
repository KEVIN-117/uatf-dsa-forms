import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "#/features/auth/providers/AuthProvider";

export function useProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		// Si Firebase ya terminó de cargar y el usuario no está autenticado, lo echamos al login
		if (!isLoading && !isAuthenticated) {
			navigate({ to: "/" });
		}
	}, [isAuthenticated, isLoading, navigate]);

	return { isAuthenticated, isLoading };
}
