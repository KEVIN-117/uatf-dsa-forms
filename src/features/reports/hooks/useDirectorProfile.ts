import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "#/shared/lib/firebase";
import { useAuth } from "#/features/auth/providers/AuthProvider";

/**
 * Fetches the director's full name (name + surnames) from the "users" collection.
 */
export function useDirectorProfile() {
  const { user } = useAuth();
  const email = user?.email ?? "";

  return useQuery({
    queryKey: ["director-user", email],
    queryFn: async () => {
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        limit(1),
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const name = typeof data.name === "string" ? data.name.trim() : "";
        const paternalSurname =
          typeof data.paternalSurname === "string" ? data.paternalSurname.trim() : "";
        const maternalSurname =
          typeof data.maternalSurname === "string" ? data.maternalSurname.trim() : "";
        if (!name || !paternalSurname || !maternalSurname) {
          return null;
        }
        return `${name} ${paternalSurname} ${maternalSurname}`;
      }
      return null;
    },
    enabled: !!email,
  });
}
