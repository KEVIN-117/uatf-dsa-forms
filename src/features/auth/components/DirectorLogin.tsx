import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useDirectorProfile } from "#/features/director-profile/providers/DirectorProfileProvider";
import { useFaculties } from "#/features/reference-data/hooks/useFaculties";
import { usePrograms } from "#/features/reference-data/hooks/usePrograms";
import { validateSchemaField } from "#/shared/lib/zod-form";
import {
  directorProfileFormSchema,
  type DirectorProfileFormValues,
} from "#/shared/schemas/director-profile";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/shared/ui/card";
import { Input } from "#/shared/ui/input";
import { Label } from "#/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/shared/ui/select";

interface DirectorLoginProps {
  onSuccess?: () => void;
}

const defaultValues: DirectorProfileFormValues = {
  fullName: "",
  facultyId: "",
  programId: "",
};

export function DirectorLogin({ onSuccess }: DirectorLoginProps) {
  const { saveProfile } = useDirectorProfile();
  const [directorError, setDirectorError] = useState<string | null>(null);
  const {
    data: faculties,
    isLoading: isLoadingFaculties,
    isError: isFacultiesError,
  } = useFaculties();
  const {
    data: programs,
    isLoading: isLoadingPrograms,
    isError: isProgramsError,
  } = usePrograms();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setDirectorError(null);

      const result = directorProfileFormSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      const selectedFaculty = faculties?.find(
        (faculty) => faculty.id === result.data.facultyId,
      );
      const selectedProgram = programs?.find(
        (program) => program.id === result.data.programId,
      );

      if (!selectedFaculty || !selectedProgram) {
        setDirectorError("No se pudo resolver la facultad o la carrera seleccionada.");
        return;
      }

      saveProfile({
        fullName: result.data.fullName.trim(),
        facultyId: selectedFaculty.id,
        facultyName: selectedFaculty.name,
        programId: selectedProgram.id,
        programName: selectedProgram.name,
      });

      form.reset();
      onSuccess?.();
    },
  });

  return (
    <Card className="w-full">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center font-display text-primary">
          Datos del director
        </CardTitle>
        <CardDescription className="text-center font-body text-muted-foreground">
          Registra quién llenará la información antes de entrar a los formularios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="fullName"
            validators={{
              onChange: ({ value }) =>
                validateSchemaField(directorProfileFormSchema, "fullName", value),
              onSubmit: ({ value }) =>
                validateSchemaField(directorProfileFormSchema, "fullName", value),
            }}
            children={(field) => {
              const showErrors =
                field.state.meta.isTouched || form.state.submissionAttempts > 0;

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Nombre del director</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Nombre y apellido"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      setDirectorError(null);
                      field.handleChange(event.target.value);
                    }}
                  />
                  {showErrors && field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                </div>
              );
            }}
          />

          <form.Field
            name="facultyId"
            validators={{
              onChange: ({ value }) =>
                validateSchemaField(directorProfileFormSchema, "facultyId", value),
              onSubmit: ({ value }) =>
                validateSchemaField(directorProfileFormSchema, "facultyId", value),
            }}
            children={(field) => {
              const showErrors =
                field.state.meta.isTouched || form.state.submissionAttempts > 0;

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Facultad</Label>
                  <Select
                    value={field.state.value || undefined}
                    onValueChange={(value) => {
                      setDirectorError(null);
                      field.handleChange(value);
                      form.setFieldValue("programId", "");
                    }}
                    disabled={isLoadingFaculties || isFacultiesError}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingFaculties
                            ? "Cargando facultades..."
                            : "Selecciona una facultad"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {faculties?.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErrors && field.state.meta.errors.length > 0 ? (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  ) : null}
                  {isFacultiesError ? (
                    <p className="text-sm text-destructive">
                      No se pudieron cargar las facultades.
                    </p>
                  ) : null}
                </div>
              );
            }}
          />

          <form.Subscribe
            selector={(state) => state.values.facultyId}
            children={(facultyId) => {
              const filteredPrograms = facultyId
                ? programs?.filter((program) => program.facultyId === facultyId) ?? []
                : [];

              return (
                <form.Field
                  name="programId"
                  validators={{
                    onChange: ({ value }) =>
                      validateSchemaField(directorProfileFormSchema, "programId", value),
                    onSubmit: ({ value }) =>
                      validateSchemaField(directorProfileFormSchema, "programId", value),
                  }}
                  children={(field) => {
                    const showErrors =
                      field.state.meta.isTouched || form.state.submissionAttempts > 0;

                    return (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Carrera y/o Programa</Label>
                        <Select
                          value={field.state.value || undefined}
                          onValueChange={(value) => {
                            setDirectorError(null);
                            field.handleChange(value);
                          }}
                          disabled={
                            !facultyId ||
                            isLoadingPrograms ||
                            isProgramsError
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                !facultyId
                                  ? "Primero selecciona una facultad"
                                  : isLoadingPrograms
                                    ? "Cargando carreras..."
                                    : "Selecciona una carrera"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-background">
                            {filteredPrograms.map((program) => (
                              <SelectItem key={program.id} value={program.id}>
                                {program.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {showErrors && field.state.meta.errors.length > 0 ? (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        ) : null}
                        {facultyId &&
                          !filteredPrograms.length &&
                          !isLoadingPrograms ? (
                          <p className="text-sm text-muted-foreground">
                            No hay carreras disponibles para la facultad seleccionada.
                          </p>
                        ) : null}
                        {isProgramsError ? (
                          <p className="text-sm text-destructive">
                            No se pudieron cargar las carreras.
                          </p>
                        ) : null}
                      </div>
                    );
                  }}
                />
              );
            }}
          />

          {directorError ? (
            <p className="text-sm text-destructive">{directorError}</p>
          ) : null}

          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isSubmitting ||
                  isLoadingFaculties ||
                  isLoadingPrograms ||
                  isFacultiesError ||
                  isProgramsError
                }
              >
                {isSubmitting || isLoadingFaculties || isLoadingPrograms ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Cargando catálogos...
                  </span>
                ) : (
                  "Guardar y continuar"
                )}
              </Button>
            )}
          />
        </form>
      </CardContent>
    </Card>
  );
}
