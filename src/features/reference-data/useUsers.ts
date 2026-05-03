import { db } from "#/shared/lib/firebase";
import type { User } from "#/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useLogin } from "../auth/hooks/useAuth";
import type { AdminLoginFormValues } from "#/shared/schemas/auth";

export function useUsers() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const usersQuery = query(collection(db, "users"), orderBy("ci", "asc"));

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const users = snapshot.docs.map((docSnap) => ({
          docId: docSnap.id,
          ...docSnap.data(),
        })) as User[];
        queryClient.setQueryData(["users"], users);
      },
      (error) => {
        console.log("🚀 Error getting users:", error);
      },
    );

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: ["users"],
    queryFn: () => (queryClient.getQueryData(["users"]) as User[]) || [],
    staleTime: Infinity,
  });
}

export const useUserByCi = (ci: string) => {
  const users = useUsers();
  return users.data?.find((user) => user.ci.toString() === ci) || null;
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: Omit<User, "docId" | "createdAt" | "updatedAt">) => {
      await addDoc(collection(db, "users"), {
        ...user,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      if (!user.docId) {
        throw new Error("Usuario sin docId, no se puede actualizar.");
      }
      const { docId, ...payload } = user;
      await updateDoc(doc(db, "users", docId), {
        ...payload,
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      await deleteDoc(doc(db, "users", docId));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });
};

export const useSetDirectorLogin = () => {
  const loginMutation = useLogin();
  return useMutation({
    mutationFn: async ({ email, password }: AdminLoginFormValues) => {
      await loginMutation.mutateAsync({
        email,
        password,
      });
    },
  });
};
