import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "#/shared/lib/firebase";
import type { Role } from "#/shared/types";
import { useFacultyById } from "#/features/reference-data/hooks/useFaculties";
import { useProgramById } from "#/features/reference-data/hooks/usePrograms";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authReady: boolean;
  userRole: Role | null;
  facultyId: string | null;
  programId: string | null;
  faculty: string | null;
  program: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [facultyId, setFacultyId] = useState<string | null>(null);
  const [programId, setProgramId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          const idTokenResult = await currentUser.getIdTokenResult();

          const userRole = idTokenResult.claims.role as Role;
          const facultyId = idTokenResult.claims.facultyId as string;
          const programId = idTokenResult.claims.programId as string;
          setUserRole(userRole);
          setFacultyId(facultyId);
          setProgramId(programId);
        } else {
          setUser(null);
          setUserRole(null);
          setFacultyId(null);
          setProgramId(null);
        }
      } catch (_error) {
        setUser(null);
        setUserRole(null);
        setFacultyId(null);
        setProgramId(null);
      } finally {
        setIsLoading(false);
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const faculty = useFacultyById(facultyId);
  const program = useProgramById(programId);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, authReady, userRole, facultyId, programId, faculty: faculty.data?.name || null, program: program.data?.name || null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
