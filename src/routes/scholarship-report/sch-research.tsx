import { createFileRoute } from "@tanstack/react-router";
import { SchResearch } from "#/features/reports/scholarship/screens/SchResearch";

export const Route = createFileRoute("/scholarship-report/sch-research")({
  component: SchResearch,
});

