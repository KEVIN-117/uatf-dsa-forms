import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { usePeriods } from "#/features/reference-data/hooks/usePeriods";
import type { Period } from "#/shared/types";

interface PeriodContextType {
	periods: Period[];
	activePeriod: Period | null;
	selectedPeriod: Period | null;
	selectedPeriodId: string;
	setSelectedPeriodId: (id: string) => void;
	isLoading: boolean;
	isReadOnly: boolean;
}

const PeriodContext = createContext<PeriodContextType | undefined>(undefined);

export function PeriodProvider({ children }: { children: React.ReactNode }) {
	const { userRole } = useAuth();
	const { data: periodsList = [], isLoading } = usePeriods();

	const activePeriod = useMemo(() => {
		return periodsList.find((p) => p.isActive) || null;
	}, [periodsList]);

	const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");

	// When activePeriod is loaded, set it as default selectedPeriodId if not set yet
	useEffect(() => {
		if (activePeriod && !selectedPeriodId) {
			setSelectedPeriodId(activePeriod.id);
		}
	}, [activePeriod, selectedPeriodId]);

	// Force directors to only view the active period
	const isDirector = userRole === "director";
	const currentPeriodId =
		isDirector && activePeriod ? activePeriod.id : selectedPeriodId;

	const selectedPeriod = useMemo(() => {
		if (!currentPeriodId) return activePeriod;
		return periodsList.find((p) => p.id === currentPeriodId) || activePeriod;
	}, [periodsList, currentPeriodId, activePeriod]);

	const isReadOnly = useMemo(() => {
		if (!selectedPeriod) return true;
		// A period is read-only if it is closed or not active
		return selectedPeriod.isClosed || !selectedPeriod.isActive;
	}, [selectedPeriod]);

	return (
		<PeriodContext.Provider
			value={{
				periods: periodsList,
				activePeriod,
				selectedPeriod,
				selectedPeriodId: selectedPeriod?.id || "",
				setSelectedPeriodId,
				isLoading,
				isReadOnly,
			}}
		>
			{children}
		</PeriodContext.Provider>
	);
}

export function usePeriodState() {
	const context = useContext(PeriodContext);
	if (context === undefined) {
		throw new Error(
			"usePeriodState debe ser usado dentro de un PeriodProvider",
		);
	}
	return context;
}
