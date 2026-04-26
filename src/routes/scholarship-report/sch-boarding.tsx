import { createFileRoute } from "@tanstack/react-router";
import { SchBoarding } from "#/features/reports/scholarship/screens/SchBoarding";

export const Route = createFileRoute("/scholarship-report/sch-boarding")({
  component: SchBoarding,
});

