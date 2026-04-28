import { useQuery } from "@tanstack/react-query";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "#/shared/lib/firebase";

export interface ParsedOption {
  value: string | number;
  label: string;
}

// 1. Exportamos la función PURA que hace la petición a Firebase
export const fetchDefaultOptions = async (
  collectionName: string,
): Promise<ParsedOption[]> => {
  const q = query(collection(db, collectionName), orderBy("id", "asc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => ({
    label:
      collectionName === "modalities"
        ? docSnap.data().modality
        : docSnap.data().name,
    value: docSnap.data().id,
  }));
};

// 2. Mantenemos el Hook original por si lo necesitas en otras partes que sí carguen al montar
export const useDefaultOptions = (collectionName: string) => {
  return useQuery({
    queryKey: [collectionName],
    queryFn: () => fetchDefaultOptions(collectionName),
  });
};
