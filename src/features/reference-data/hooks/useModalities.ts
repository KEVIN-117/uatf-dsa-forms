import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { auth, db } from "#/shared/lib/firebase";
import type { GraduationModality, Modality } from "#/shared/types";

export const useModalities = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		let unsubscribeFirestore: (() => void) | null = null;

		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				if (unsubscribeFirestore) return;

				const q = query(collection(db, "modalities"), orderBy("id", "asc"));

				unsubscribeFirestore = onSnapshot(
					q,
					(snapshot) => {
						const modalities = snapshot.docs.map((docSnap) => ({
							docId: docSnap.id,
							...docSnap.data(),
						})) as Modality[];

						queryClient.setQueryData(["modalities"], modalities);
					},
					(error) => {
						console.error("Error escuchando modalidades:", error);
					},
				);
			} else {
				if (unsubscribeFirestore) {
					unsubscribeFirestore();
					unsubscribeFirestore = null;
				}
				queryClient.setQueryData(["modalities"], []);
			}
		});

		return () => {
			unsubscribeAuth();
			if (unsubscribeFirestore) {
				unsubscribeFirestore();
			}
		};
	}, [queryClient]);

	return useQuery({
		queryKey: ["modalities"],
		queryFn: () =>
			(queryClient.getQueryData(["modalities"]) as Modality[]) || [],
		staleTime: Infinity,
	});
};

export const useGraduationModalities = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		let unsubscribeFirestore: (() => void) | null = null;

		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				if (unsubscribeFirestore) return;

				const q = query(
					collection(db, "graduation_modalities"),
					orderBy("id", "asc"),
				);

				unsubscribeFirestore = onSnapshot(
					q,
					(snapshot) => {
						const graduationModalities = snapshot.docs.map((docSnap) => ({
							docId: docSnap.id,
							...docSnap.data(),
						})) as GraduationModality[];

						queryClient.setQueryData(
							["graduationModalities"],
							graduationModalities,
						);
					},
					(error) => {
						console.error("Error escuchando modalidades de graduación:", error);
					},
				);
			} else {
				if (unsubscribeFirestore) {
					unsubscribeFirestore();
					unsubscribeFirestore = null;
				}
				queryClient.setQueryData(["graduationModalities"], []);
			}
		});

		return () => {
			unsubscribeAuth();
			if (unsubscribeFirestore) {
				unsubscribeFirestore();
			}
		};
	}, [queryClient]);

	return useQuery({
		queryKey: ["graduationModalities"],
		queryFn: () =>
			(queryClient.getQueryData([
				"graduationModalities",
			]) as GraduationModality[]) || [],
		staleTime: Infinity,
	});
};

export const useAddModality = () => {
	return useMutation({
		mutationFn: async (newModality: Omit<Modality, "docId">) => {
			const modalitiesRef = collection(db, "modalities");
			return await addDoc(modalitiesRef, {
				...newModality,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
		},
	});
};

export const useUpdateModality = () => {
	return useMutation({
		mutationFn: async ({ docId, ...data }: Modality) => {
			const docRef = doc(db, "modalities", docId);
			return await updateDoc(docRef, {
				...data,
				updatedAt: serverTimestamp(),
			});
		},
	});
};

export const useDeleteModality = () => {
	return useMutation({
		mutationFn: async (docId: string) => {
			const docRef = doc(db, "modalities", docId);
			return await deleteDoc(docRef);
		},
	});
};

export const useModalityById = (modalityId: string) => {
	const modalities = useModalities();

	return modalities.data?.find((modality) => modality.id === modalityId);
};
