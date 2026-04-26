import { createFileRoute } from "@tanstack/react-router";
import { TeachNumAcad } from "#/features/reports/teacher/screens/TeachNumAcad";

export const Route = createFileRoute("/teacher-report/teach-num-acad")({
  component: TeachNumAcad,
});

