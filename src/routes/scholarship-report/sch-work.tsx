import { createFileRoute } from "@tanstack/react-router";
import { SchWork } from "../../pages/scholarship-report/SchWork";

export const Route = createFileRoute("/scholarship-report/sch-work")({
  component: SchWork,
});
