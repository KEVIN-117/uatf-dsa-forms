import { createFileRoute } from "@tanstack/react-router";
import { SchBoarding } from "../../pages/scholarship-report/SchBoarding";

export const Route = createFileRoute("/scholarship-report/sch-boarding")({
  component: SchBoarding,
});
