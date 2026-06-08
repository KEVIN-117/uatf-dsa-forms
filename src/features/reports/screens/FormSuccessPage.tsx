import { useSearch } from "@tanstack/react-router";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useDirectorProfile } from "#/features/reports/hooks/useDirectorProfile";
import { useDirectorSummary } from "#/features/reports/hooks/useDirectorSummary";
import { FormSuccess } from "#/shared/components/FormSuccess";

/**
 * Route-level page component for `/formStatus/success`.
 *
 * Reads the `completed` search param to determine the variant:
 * - `?completed=true` → "completion" variant (loader → dialog → summary)
 * - No param          → "readonly" variant (summary directly)
 *
 * This keeps the route logic separate from the reusable FormSuccess component.
 */
export function FormSuccessPage() {
	const { completed } = useSearch({ from: "/formStatus/success" });
	const { data: groups, isPending } = useDirectorSummary();
	const { data: directorName } = useDirectorProfile();
	const { faculty, program } = useAuth();

	return (
		<FormSuccess
			variant={completed ? "completion" : "readonly"}
			isLoading={isPending}
			groups={groups}
			directorName={directorName ?? "Director"}
			faculty={faculty ?? "-"}
			program={program ?? "-"}
		/>
	);
}
