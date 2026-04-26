import { createFileRoute } from "@tanstack/react-router";
import { TeachNumMod } from "#/features/reports/teacher/screens/TeachNumMod";

export const Route = createFileRoute("/teacher-report/teach-num-mod")({
  component: TeachNumMod,
});

