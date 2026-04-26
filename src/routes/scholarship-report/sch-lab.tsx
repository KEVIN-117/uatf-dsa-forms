import { createFileRoute } from "@tanstack/react-router";
import { SchLab } from "#/features/reports/scholarship/screens/SchLab";

export const Route = createFileRoute("/scholarship-report/sch-lab")({
  component: SchLab,
});

