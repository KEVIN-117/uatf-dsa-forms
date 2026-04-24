import { createFileRoute } from "@tanstack/react-router";
import { SchGraduation } from "../../pages/scholarship-report/SchGraduation";

export const Route = createFileRoute("/scholarship-report/sch-graduation")({
  component: SchGraduation,
});
