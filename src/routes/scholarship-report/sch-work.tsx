import { createFileRoute } from "@tanstack/react-router";
import { SchWork } from "#/features/reports/scholarship/screens/SchWork";

export const Route = createFileRoute("/scholarship-report/sch-work")({
  component: SchWork,
});

