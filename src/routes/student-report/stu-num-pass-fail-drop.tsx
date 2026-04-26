import { createFileRoute } from "@tanstack/react-router";
import { StuNumPassFailDrop } from "#/features/reports/student/screens/StuNumPassFailDrop";

export const Route = createFileRoute("/student-report/stu-num-pass-fail-drop")({
  component: StuNumPassFailDrop,
});

