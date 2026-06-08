import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { db } from "#/shared/lib/firebase";
import type { Faculty } from "#/shared/types";

export const useFaculties = () => {
	const queryClient = useQueryClient();

	useEffect(() => {
		const q = query(collection(db, "faculties"), orderBy("id", "asc"));

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const faculties = snapshot.docs.map((docSnap) => ({
					docId: docSnap.id,
					...docSnap.data(),
				})) as Faculty[];

				queryClient.setQueryData(["faculties"], faculties);
			},
			(error) => {
				console.error("Error escuchando facultades:", error);
			},
		);

		return () => unsubscribe();
	}, [queryClient]);

	return useQuery({
		queryKey: ["faculties"],
		queryFn: () => (queryClient.getQueryData(["faculties"]) as Faculty[]) || [],
		staleTime: Infinity,
	});
};

export const useFacultiesById = (facultyId: string) => {
	const faculties = useFaculties();

	return faculties.data?.find((faculty) => faculty.id === facultyId);
};

export const useFacultyById = (facultyId: string | null) => {
	const { data: faculties } = useFaculties();

	return useQuery({
		queryKey: ["facultyById", facultyId, faculties?.length],
		queryFn: () => {
			if (!facultyId || !faculties) return null;
			return faculties.find((faculty) => faculty.id === facultyId) || null;
		},
		enabled: !!facultyId && !!faculties && faculties.length > 0,
		staleTime: Infinity,
	});
};

export const useAddFaculty = () => {
	return useMutation({
		mutationFn: async (newFaculty: Omit<Faculty, "docId">) => {
			const facultiesRef = collection(db, "faculties");
			return await addDoc(facultiesRef, {
				...newFaculty,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});
		},
	});
};

export const useUpdateFaculty = () => {
	return useMutation({
		mutationFn: async ({ docId, ...data }: Faculty) => {
			const docRef = doc(db, "faculties", docId);
			return await updateDoc(docRef, {
				...data,
				updatedAt: serverTimestamp(),
			});
		},
	});
};

export const useDeleteFaculty = () => {
	return useMutation({
		mutationFn: async (docId: string) => {
			const docRef = doc(db, "faculties", docId);
			return await deleteDoc(docRef);
		},
	});
};
