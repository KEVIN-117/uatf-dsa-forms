import { createFileRoute } from "@tanstack/react-router";
import { StuEnrSex } from "#/features/reports/student/screens/StuEnrSex";

export const Route = createFileRoute("/student-report/stu-enr-sex")({
  component: StuEnrSex,
});

