import { createFileRoute } from "@tanstack/react-router";
import { SchLab } from "../../pages/scholarship-report/SchLab";

export const Route = createFileRoute("/scholarship-report/sch-lab")({
  component: SchLab,
});
