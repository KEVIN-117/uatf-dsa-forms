import { useEffect, useState } from "react";
import { ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "#/features/auth/providers/AuthProvider";
import { useDirectorProfile } from "#/features/director-profile/providers/DirectorProfileProvider";
import { Button } from "#/shared/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "#/shared/ui/drawer";
import { Login } from "#/features/auth/components/Login";
import { DirectorLogin } from "#/features/auth/components/DirectorLogin";

type GateMode = "director" | "admin";


export function DirectorProfileGate() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const { profile, isHydrated } = useDirectorProfile();
  const [mode, setMode] = useState<GateMode>("director");
  const shouldRequireIdentification =
    isHydrated && !isLoading && !profile && !isAuthenticated;

  useEffect(() => {
    if (shouldRequireIdentification) {
      setIsOpen(true);
      setMode("director");
    }
  }, [shouldRequireIdentification]);

  if (!isHydrated || isLoading) {
    return null;
  }

  function handleDrawerOpenChange(nextOpen: boolean) {
    const canClose = !shouldRequireIdentification;

    if (!nextOpen && !canClose) {
      return;
    }

    setIsOpen(nextOpen);
  }

  return (
    <Drawer
      open={isOpen}
      onOpenChange={handleDrawerOpenChange}
      dismissible={!shouldRequireIdentification}
      direction="bottom"
      modal
    >
      <DrawerContent className="w-full sm:max-w-full md:max-w-4xl mx-auto h-auto p-4 ">
        <DrawerHeader className="border-b">
          <DrawerTitle>Identificación previa</DrawerTitle>
          <DrawerDescription>
            Antes de usar los formularios, registra quién llena la información o
            entra como administrador.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-6 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={mode === "director" ? "default" : "outline"}
              onClick={() => setMode("director")}
            >
              <UserRound className="size-4" />
              Datos del director
            </Button>
            <Button
              type="button"
              variant={mode === "admin" ? "default" : "outline"}
              onClick={() => setMode("admin")}
            >
              <ShieldCheck className="size-4" />
              Admin
            </Button>
          </div>

          {mode === "director" ? (
            <DirectorLogin onSuccess={() => setIsOpen(false)} />
          ) : (
            <Login onSuccess={() => setIsOpen(false)} redirectTo={null} />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
