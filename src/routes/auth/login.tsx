import { createFileRoute } from "@tanstack/react-router";
import { Login } from "#/features/auth/components/Login";

export const Route = createFileRoute('/auth/login')({
    component: AuthLoginRoute,
})

function AuthLoginRoute() {
    return <Login />;
}

