import { createFileRoute } from "@tanstack/react-router";
import { TeachList } from "#/features/reports/teacher/screens/TeachList";

export const Route = createFileRoute("/teacher-report/teach-list")({
  component: TeachList,
});

