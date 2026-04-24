import { createFileRoute } from "@tanstack/react-router";
import { SchAssistants } from "../../pages/scholarship-report/SchAssistants";

export const Route = createFileRoute("/scholarship-report/sch-assistants")({
  component: SchAssistants,
});
