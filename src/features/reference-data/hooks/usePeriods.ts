import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
	writeBatch,
} from "firebase/firestore";
import { useEffect } from "react";
import { auth, db } from "#/shared/lib/firebase";
import type { Period } from "#/shared/types";

export const usePeriods = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		let unsubscribeFirestore: (() => void) | null = null;

		const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
			if (user) {
				if (unsubscribeFirestore) return;

				const q = query(collection(db, "periods"), orderBy("id", "desc"));

				unsubscribeFirestore = onSnapshot(
					q,
					(snapshot) => {
						const periods = snapshot.docs.map((docSnap) => ({
							docId: docSnap.id,
							...docSnap.data(),
						})) as Period[];

						queryClient.setQueryData(["periods"], periods);
					},
					(error) => {
						console.error("Error escuchando periodos:", error);
					},
				);
			} else {
				if (unsubscribeFirestore) {
					unsubscribeFirestore();
					unsubscribeFirestore = null;
				}
				queryClient.setQueryData(["periods"], []);
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
		queryKey: ["periods"],
		queryFn: () => (queryClient.getQueryData(["periods"]) as Period[]) || [],
		staleTime: Infinity,
	});
};

export const useAddPeriod = () => {
	return useMutation({
		mutationFn: async (newPeriod: Omit<Period, "docId">) => {
			const docRef = doc(db, "periods", newPeriod.id);
			return await setDoc(docRef, {
				...newPeriod,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
		},
	});
};

export const useUpdatePeriod = () => {
	return useMutation({
		mutationFn: async ({ docId, ...data }: Period) => {
			const docRef = doc(db, "periods", docId);

			if (data.isActive) {
				const batch = writeBatch(db);
				const activeQuery = query(
					collection(db, "periods"),
					where("isActive", "==", true),
				);
				const activeSnapshot = await getDocs(activeQuery);

				for (const docSnap of activeSnapshot.docs) {
					if (docSnap.id !== docId) {
						batch.update(docSnap.ref, {
							isActive: false,
							updatedAt: serverTimestamp(),
						});
					}
				}

				batch.update(docRef, {
					...data,
					updatedAt: serverTimestamp(),
				});

				return await batch.commit();
			}

			return await updateDoc(docRef, {
				...data,
				updatedAt: serverTimestamp(),
			});
		},
	});
};

export const useDeletePeriod = () => {
	return useMutation({
		mutationFn: async (docId: string) => {
			const docRef = doc(db, "periods", docId);
			return await deleteDoc(docRef);
		},
	});
};

export const usePeriodById = (periodId: string) => {
	const periods = usePeriods();
	return periods.data?.find((period) => period.id === periodId);
};
