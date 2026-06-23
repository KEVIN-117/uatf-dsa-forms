import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import {
	addDoc,
	collection,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { useEffect, useMemo } from "react";
import { usePeriodState } from "#/app/providers/period-provider";
import { auth, db } from "#/shared/lib/firebase";
import type { FormTemplateDef } from "../types/dynamic-form";

const formTemplatesQueryKey = ["formTemplates"] as const;

const createFormTemplatesQuery = () =>
	query(collection(db, "form_templates"), orderBy("step", "asc"));

export const useFormTemplates = () => {
	const queryClient = useQueryClient();
	const { selectedPeriodId } = usePeriodState();

	useEffect(() => {
		let unsubscribeFirestore: (() => void) | null = null;

		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				if (unsubscribeFirestore) return;

				unsubscribeFirestore = onSnapshot(
					createFormTemplatesQuery(),
					(snapshot) => {
						const templates = snapshot.docs.map((doc) => ({
							...doc.data(),
						})) as FormTemplateDef[];

						queryClient.setQueryData(formTemplatesQueryKey, templates);
					},
					(error) => {
						console.error("Error escuchando plantillas de formularios:", error);
					},
				);
			} else {
				if (unsubscribeFirestore) {
					unsubscribeFirestore();
					unsubscribeFirestore = null;
				}
				queryClient.setQueryData(formTemplatesQueryKey, []);
			}
		});

		return () => {
			unsubscribeAuth();
			if (unsubscribeFirestore) {
				unsubscribeFirestore();
			}
		};
	}, [queryClient]);

	const queryResult = useQuery({
		queryKey: formTemplatesQueryKey,
		queryFn: async () => {
			const snapshot = await getDocs(createFormTemplatesQuery());
			return snapshot.docs.map((doc) => ({
				...doc.data(),
			})) as FormTemplateDef[];
		},
		staleTime: Infinity,
	});

	const filteredData = useMemo(() => {
		if (!queryResult.data) return [];
		return queryResult.data.filter((t) => t.periodId === selectedPeriodId);
	}, [queryResult.data, selectedPeriodId]);

	return {
		...queryResult,
		allTemplates: queryResult.data || [],
		data: filteredData,
	};
};

export const useAddFormTemplate = () => {
	return useMutation({
		mutationFn: async (
			newTemplate: Omit<FormTemplateDef, "docId" | "createdAt">,
		) => {
			const templatesRef = collection(db, "form_templates");
			return await addDoc(templatesRef, {
				...newTemplate,
				createdAt: serverTimestamp(),
			});
		},
	});
};

export const useUpsertFormTemplate = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (template: FormTemplateDef) => {
			if (!template.id) {
				throw new Error("El template debe tener un ID válido.");
			}
			const sanitizedTemplate = JSON.parse(JSON.stringify(template));
			await setDoc(doc(db, "form_templates", template.id), sanitizedTemplate);
			return template;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["formTemplates"] });
		},
		onError: async (error: any) => {
			console.error("Error guardando template:", error);

			if (error.code === "permission-denied") {
				throw new Error(
					"No tienes permisos para crear o actualizar la plantilla.",
				);
			}
			throw error;
		},
	});
};

export const useFormTemplateById = (id: string) => {
	const templatesQuery = useFormTemplates();
	const template = useMemo(
		() => templatesQuery.allTemplates?.find((candidate) => candidate.id === id),
		[templatesQuery.allTemplates, id],
	);

	return {
		...templatesQuery,
		template,
	};
};

export const useFormTemplateByModule = (module: string) => {
	const templatesQuery = useFormTemplates();
	const template = useMemo(
		() => templatesQuery.data?.find((candidate) => candidate.module === module),
		[templatesQuery.data, module],
	);

	return {
		...templatesQuery,
		template,
	};
};

export const useFormTemplateByModuleAndId = (module: string, id: string) => {
	const templatesQuery = useFormTemplates();
	const template = useMemo(
		() =>
			templatesQuery.allTemplates?.find(
				(candidate) => candidate.module === module && candidate.id === id,
			),
		[templatesQuery.allTemplates, module, id],
	);

	return {
		...templatesQuery,
		template,
	};
};

export const useGetNextTemplate = (module: string, id: string) => {
	const { data: templates } = useFormTemplates();
	const { template: currentTemplate } = useFormTemplateByModuleAndId(
		module,
		id,
	);
	const nextTemplate = templates?.find(
		(t) => t.step === (currentTemplate?.step || 0) + 1,
	);
	return nextTemplate;
};
