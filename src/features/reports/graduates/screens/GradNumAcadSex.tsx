import { FormContainer } from "#/shared/components/FormContainer";
import { Button } from "#/shared/ui/button";
import { runSeed } from "#/shared/lib/seed";

export function GradNumAcadSex() {
  return (
    <FormContainer title="Formulario de Número de graduados por nivel académico y sexo" description="Este es el formulario de número de graduados por nivel académico y sexo">
      <div className="w-full h-full flex">
        Contenido del formulario
        <Button variant="default" className="cursor-pointer" onClick={runSeed}>Seed Data</Button>
      </div>
    </FormContainer>
  )
}

