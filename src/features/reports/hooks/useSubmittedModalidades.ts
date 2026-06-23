import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { usePeriodState } from "#/app/providers/period-provider";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { db } from "#/shared/lib/firebase";
import type { FormResponseDef } from "#/shared/types/dynamic-form";

/**
 * Mapa de límites por modalidad.
 * Clave externa: nombre de la modalidad (e.g., "EXAMEN P.S.A.")
 * Clave interna: nombre del campo numérico (e.g., "masculino", "femenino")
 * Valor: cantidad máxima permitida
 */
export type ModalityLimits = Record<string, Record<string, number>>;

/**
 * Hook que consulta las respuestas de un formulario previo y extrae
 * los valores únicos del campo "modalidad" que fueron seleccionados.
 *
 * Útil para filtrar las opciones de modalidad en formularios posteriores
 * (e.g., Form 2 solo muestra las modalidades registradas en Form 1).
 *
 * @param sourceTemplateId - ID del template del cual extraer las modalidades (e.g., "1")
 * @param module - Nombre del módulo/colección en Firestore (e.g., "student")
 */
export const useSubmittedModalities = (
	sourceTemplateId: string,
	module: string,
) => {
	const { programId } = useAuth();

	return useQuery<string[]>({
		queryKey: ["submitted-modalities", module, sourceTemplateId, programId],
		queryFn: async () => {
			if (!programId) return [];

			const q = query(
				collection(db, module),
				where("templateId", "==", sourceTemplateId),
				where("programId", "==", programId),
			);

			const snapshot = await getDocs(q);
			const modalities = new Set<string>();

			for (const doc of snapshot.docs) {
				const data = doc.data() as FormResponseDef;
				const modalidad = data.response?.modalidad;
				if (modalidad) {
					modalities.add(String(modalidad));
				}
			}

			return Array.from(modalities);
		},
		enabled: !!sourceTemplateId && !!module && !!programId,
	});
};

/**
 * Hook que consulta las respuestas de un formulario previo y extrae
 * los límites numéricos por modalidad.
 *
 * Ejemplo de retorno:
 * {
 *   "EXAMEN P.S.A.": { masculino: 5, femenino: 3 },
 *   "CURSO PREUNIVERSITARIO": { masculino: 10, femenino: 7 }
 * }
 *
 * Esto permite validar que en formularios posteriores no se ingresen
 * valores mayores a los registrados en el formulario anterior.
 *
 * @param sourceTemplateId - ID del template del cual extraer los límites (e.g., "1")
 * @param module - Nombre del módulo/colección en Firestore (e.g., "student")
 */
export const useSubmittedResponseLimits = (
	sourceTemplateId: string,
	module: string,
) => {
	const { programId } = useAuth();

	return useQuery<ModalityLimits>({
		queryKey: [
			"submitted-response-limits",
			module,
			sourceTemplateId,
			programId,
		],
		queryFn: async () => {
			if (!programId) return {};

			const q = query(
				collection(db, module),
				where("templateId", "==", sourceTemplateId),
				where("programId", "==", programId),
			);

			const snapshot = await getDocs(q);
			const limits: ModalityLimits = {};

			for (const doc of snapshot.docs) {
				const data = doc.data() as FormResponseDef;
				const response = data.response;
				if (!response) continue;

				const modalidad = String(response.modalidad ?? "");
				if (!modalidad) continue;

				// Extraer todos los campos numéricos (excluir modalidad y total)
				const numericFields: Record<string, number> = {};
				for (const [key, value] of Object.entries(response)) {
					if (key === "modalidad" || key === "total") continue;
					const numValue = Number(value);
					if (Number.isFinite(numValue)) {
						numericFields[key] = numValue;
					}
				}

				limits[modalidad] = numericFields;
			}

			return limits;
		},
		enabled: !!sourceTemplateId && !!module && !!programId,
	});
};

export const useSubmittedTotals = (templateId: string, module: string) => {
	const { programId } = useAuth();
	const { selectedPeriodId } = usePeriodState();

	return useQuery<Record<string, number>>({
		queryKey: [
			"submitted-totals",
			module,
			templateId,
			programId,
			selectedPeriodId,
		],
		queryFn: async () => {
			if (!programId || !templateId || !selectedPeriodId) return {};

			const q = query(
				collection(db, module),
				where("templateId", "==", templateId),
				where("programId", "==", programId),
				where("periodId", "==", selectedPeriodId),
			);

			const snapshot = await getDocs(q);
			const totals: Record<string, number> = {};

			for (const doc of snapshot.docs) {
				const data = doc.data() as FormResponseDef;
				const response = data.response;
				if (!response) continue;

				for (const [key, value] of Object.entries(response)) {
					if (key === "modalidad" || key === "tipo" || key === "academic_level")
						continue;
					const numVal = Number(value);
					if (Number.isFinite(numVal)) {
						totals[key] = (totals[key] || 0) + numVal;
					}
				}
			}

			return totals;
		},
		enabled: !!templateId && !!module && !!programId && !!selectedPeriodId,
	});
};
