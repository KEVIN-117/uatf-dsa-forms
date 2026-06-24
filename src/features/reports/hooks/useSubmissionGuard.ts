import { useMemo } from "react";
import type {
	FormResponseDef,
	FormTemplateDef,
} from "#/shared/types/dynamic-form";
import { FormModules } from "#/shared/types/dynamic-form";

export interface SubmissionGuard {
	canSubmit: boolean;
	disabledReason: string | null;
	usedSelectValues: string[];
	submissionType: "single" | "multi";
	selectFieldName: string | null;
}

/**
 * Determina si un director puede enviar un reporte basándose en:
 * - El tipo de formulario (single vs multi-submit)
 * - Las respuestas ya enviadas por el director actual
 *
 * Reglas:
 * - El módulo `teacher` siempre es multi-submit sin restricción de select
 * - Módulos `student`, `graduate`, `scholarships`: se controlan por campo select "modalidad"
 * - Si `template.allowMultipleSubmissions` está definido, se respeta ese valor
 * - Si no está definido, se infiere: tiene campo select con options → multi, sino → single
 *
 * @param template - El template del formulario
 * @param userResponses - Las respuestas del director actual para este formulario
 * @param userRole - Rol del usuario actual
 */
export function useSubmissionGuard(
	template: FormTemplateDef | null | undefined,
	userResponses: FormResponseDef[],
	userRole: string,
): SubmissionGuard {
	return useMemo(() => {
		const defaultGuard: SubmissionGuard = {
			canSubmit: true,
			disabledReason: null,
			usedSelectValues: [],
			submissionType: "multi",
			selectFieldName: null,
		};

		// Solo aplica a directores
		if (userRole !== "director" || !template) {
			return defaultGuard;
		}

		// El módulo teacher siempre es multi-submit sin restricción
		if (template.module === FormModules.teacher) {
			return defaultGuard;
		}

		// Buscar el campo select clave (por ejemplo, "modalidad" o el select de becas).
		// NOTA: El módulo de docentes ya se excluye en la línea 56, por lo que 
		// no es necesario filtrar "carga horaria" ni "categoria" aquí.
		const selectField = template.fields.find(
			(field) =>
				field.type === "select" &&
				field.options &&
				field.options.length > 0 &&
				(template.module === FormModules.scholarships ||
					field.name === "modalidad" ||
					field.label.toLocaleLowerCase().includes("modalidad")),
		);

		// Determinar tipo de envío
		let submissionType: "single" | "multi";
		if (template.allowMultipleSubmissions !== undefined) {
			submissionType = template.allowMultipleSubmissions ? "multi" : "single";
		} else {
			submissionType = selectField ? "multi" : "single";
		}

		if (submissionType === "single") {
			if (userResponses.length > 0) {
				return {
					canSubmit: false,
					disabledReason: "Ya se ha registrado un reporte para este formulario",
					usedSelectValues: [],
					submissionType: "single",
					selectFieldName: null,
				};
			}
			return {
				canSubmit: true,
				disabledReason: null,
				usedSelectValues: [],
				submissionType: "single",
				selectFieldName: null,
			};
		}

		if (!selectField) {
			return defaultGuard;
		}

		const selectFieldName = selectField.name;
		const availableOptions = selectField.options ?? [];

		const usedSelectValues = userResponses
			.map((r) => String(r.response?.[selectFieldName] ?? ""))
			.filter((v) => v !== "");

		const availableLabels = availableOptions.map((opt) => String(opt.label));
		const allUsed = availableLabels.every((label) =>
			usedSelectValues.includes(label),
		);

		if (allUsed) {
			return {
				canSubmit: false,
				disabledReason:
					"Todas las modalidades han sido registradas",
				usedSelectValues,
				submissionType: "multi",
				selectFieldName,
			};
		}

		return {
			canSubmit: true,
			disabledReason: null,
			usedSelectValues,
			submissionType: "multi",
			selectFieldName,
		};
	}, [template, userResponses, userRole]);
}
