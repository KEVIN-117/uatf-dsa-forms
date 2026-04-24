import { createFileRoute } from "@tanstack/react-router";
import { SchResearch } from "../../pages/scholarship-report/SchResearch";

export const Route = createFileRoute("/scholarship-report/sch-research")({
  component: SchResearch,
});
