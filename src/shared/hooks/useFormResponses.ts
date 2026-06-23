import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { useMemo } from "react";
import { usePeriodState } from "#/app/providers/period-provider";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { db } from "#/shared/lib/firebase";
import { Toast } from "../components/Toast";
import { FormModules, type FormResponseDef } from "../types/dynamic-form";

export function useSubmitFormResponse() {
	const queryClient = useQueryClient();
	const { selectedPeriodId } = usePeriodState();

	return useMutation({
		mutationFn: async (response: FormResponseDef) => {
			const collectionRef = collection(db, response.module);
			const newDocRef = doc(collectionRef);
			const responseToSave = {
				...response,
				id: newDocRef.id,
				periodId: selectedPeriodId,
				createdAt: Date.now(),
			};

			await setDoc(newDocRef, responseToSave);
			return responseToSave;
		},
		onSuccess: (_data, _variables) => {
			queryClient.invalidateQueries({
				queryKey: ["responses"],
			});
			Toast({
				title: "Éxito",
				type: "success",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "Respuesta enviada correctamente",
			});
		},
		onError: (_error) => {
			Toast({
				title: "Error",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message:
					"Algo salió mal al guardar la respuesta, no te preocupes puedes volver a intentarlo",
			});
		},
	});
}

export function useGetResponses(module: FormModules, templateId: string) {
	const { selectedPeriodId } = usePeriodState();
	const { userRole, user, programId } = useAuth();
	const email = user?.email || "";

	return useQuery({
		queryKey: [
			"responses",
			module,
			templateId,
			selectedPeriodId,
			userRole,
			email,
			programId,
		],
		queryFn: async () => {
			let q = query(
				collection(db, module),
				where("templateId", "==", templateId),
				where("periodId", "==", selectedPeriodId),
			);
			if (userRole === "director" && programId) {
				q = query(
					collection(db, module),
					where("templateId", "==", templateId),
					where("periodId", "==", selectedPeriodId),
					where("programId", "==", programId),
				);
			}

			const snapshot = await getDocs(q);
			const responses: FormResponseDef[] = [];
			snapshot.forEach((doc) => {
				responses.push(doc.data() as FormResponseDef);
			});
			return responses.sort((a, b) => b.createdAt - a.createdAt);
		},
		enabled:
			!!module &&
			!!templateId &&
			!!selectedPeriodId &&
			!!userRole &&
			(userRole !== "director" || !!programId),
	});
}

export function useResponsesByModule(module: FormModules) {
	return useQuery({
		queryKey: ["responses", module],
		queryFn: async () => {
			const q = query(collection(db, module), orderBy("createdAt", "desc"));
			const snapshot = await getDocs(q);
			return snapshot.docs.map((doc) => doc.data() as FormResponseDef);
		},
		enabled: !!module,
	});
}

export const useDeleteFormResponse = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ module, id }: { module: FormModules; id: string }) => {
			const docRef = doc(db, module, id);
			await deleteDoc(docRef);
		},

		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				queryKey: ["responses"],
			});
			Toast({
				title: "Éxito, Respuesta eliminada correctamente",
				type: "success",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "El registro ha sido eliminado correctamente.",
			});
		},
		onError: (_error) => {
			Toast({
				title: "Error",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message:
					"Algo salió mal al eliminar la respuesta, no te preocupes puedes volver a intentarlo",
			});
		},
	});
};
export const useUpdateFormResponse = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			module,
			response,
		}: {
			id: string;
			module: FormModules;
			response: Record<string, unknown>;
		}) => {
			const docRef = doc(db, module, id);
			await updateDoc(docRef, { response });
		},
		onSuccess(_data) {
			queryClient.invalidateQueries({
				queryKey: ["responses"],
			});
			Toast({
				title: "Éxito",
				type: "success",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message: "Respuesta actualizada correctamente",
			});
		},
		onError() {
			Toast({
				title: "Error",
				type: "error",
				duration: 5000,
				closeButton: true,
				position: "top-right",
				message:
					"Algo salió mal al actualizar la respuesta, no te preocupes puedes volver a intentarlo",
			});
		},
	});
};

const ALL_MODULES = Object.values(FormModules);

export const useAllResponses = () => {
	const { selectedPeriodId } = usePeriodState();
	const { userRole, user, programId } = useAuth();
	const email = user?.email || "";

	const queryResult = useQuery({
		queryKey: ["responses", "all", userRole, email, programId],
		queryFn: async () => {
			const results = await Promise.all(
				ALL_MODULES.map(async (mod) => {
					let q = query(collection(db, mod));
					if (userRole === "director" && programId) {
						q = query(collection(db, mod), where("programId", "==", programId));
					}
					const snapshot = await getDocs(q);
					return snapshot.docs.map((doc) => doc.data() as FormResponseDef);
				}),
			);
			return results.flat();
		},
		enabled: !!userRole && (userRole !== "director" || !!programId),
	});
	const filteredData = useMemo(() => {
		if (!queryResult.data) return [];
		return queryResult.data
			.filter((r) => r.periodId === selectedPeriodId)
			.sort((a, b) => b.createdAt - a.createdAt);
	}, [queryResult.data, selectedPeriodId, userRole, email, programId]);

	return {
		...queryResult,
		data: filteredData,
	};
};

export const getResponsesById = (id: string, module: FormModules) => {
	return useQuery({
		queryKey: ["responses", "by-id", id],
		queryFn: async () => {
			const snapshot = await getDoc(doc(db, module, id));
			if (!snapshot.exists()) {
				return null;
			}
			return snapshot.data() as FormResponseDef;
		},
		enabled: !!id && !!module,
	});
};

export const useFormResponsesByModule = (module: string) => {
	const allQuery = useAllResponses();
	const responses = useMemo(
		() => allQuery.data?.filter((r) => r.module === module) ?? [],
		[allQuery.data, module],
	);
	return { ...allQuery, responses };
};

export const useFormResponseByModuleAndId = (module: string, id: string) => {
	const allQuery = useAllResponses();
	const response = useMemo(
		() => allQuery.data?.find((r) => r.module === module && r.id === id),
		[allQuery.data, module, id],
	);
	return { ...allQuery, response };
};
