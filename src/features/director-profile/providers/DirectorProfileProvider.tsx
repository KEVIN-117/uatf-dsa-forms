import { createContext, useContext, useEffect, useState } from "react";
import {
  directorProfileSchema,
  type DirectorProfile,
} from "#/shared/schemas/director-profile";

const directorProfileStorageKey = "uatf-director-profile";

export type DirectorProfileInput = Omit<DirectorProfile, "savedAt">;

interface DirectorProfileContextValue {
  profile: DirectorProfile | null;
  isHydrated: boolean;
  saveProfile: (input: DirectorProfileInput) => void;
  clearProfile: () => void;
}

const DirectorProfileContext = createContext<DirectorProfileContextValue | undefined>(
  undefined,
);

function readStoredProfile() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawProfile = window.localStorage.getItem(directorProfileStorageKey);

  if (!rawProfile) {
    return null;
  }

  try {
    const parsedProfile = JSON.parse(rawProfile);
    const result = directorProfileSchema.safeParse(parsedProfile);

    if (!result.success) {
      window.localStorage.removeItem(directorProfileStorageKey);
      return null;
    }

    return result.data;
  } catch {
    window.localStorage.removeItem(directorProfileStorageKey);
    return null;
  }
}

export function DirectorProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<DirectorProfile | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setProfile(readStoredProfile());
    setIsHydrated(true);
  }, []);

  function saveProfile(input: DirectorProfileInput) {
    const nextProfile: DirectorProfile = {
      ...input,
      savedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(
      directorProfileStorageKey,
      JSON.stringify(nextProfile),
    );
    setProfile(nextProfile);
  }

  function clearProfile() {
    window.localStorage.removeItem(directorProfileStorageKey);
    setProfile(null);
  }

  return (
    <DirectorProfileContext.Provider
      value={{ profile, isHydrated, saveProfile, clearProfile }}
    >
      {children}
    </DirectorProfileContext.Provider>
  );
}

export function useDirectorProfile() {
  const context = useContext(DirectorProfileContext);

  if (!context) {
    throw new Error(
      "useDirectorProfile debe ser usado dentro de un DirectorProfileProvider",
    );
  }

  return context;
}
