import { createFileRoute } from "@tanstack/react-router";
import { SchGraduation } from "#/features/reports/scholarship/screens/SchGraduation";

export const Route = createFileRoute("/scholarship-report/sch-graduation")({
  component: SchGraduation,
});

