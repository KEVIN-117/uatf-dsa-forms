import { createFileRoute } from "@tanstack/react-router";
import { SchAssistants } from "#/features/reports/scholarship/screens/SchAssistants";

export const Route = createFileRoute("/scholarship-report/sch-assistants")({
  component: SchAssistants,
});

