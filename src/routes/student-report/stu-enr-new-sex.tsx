import { createFileRoute } from "@tanstack/react-router";
import { StuEnrNewSex } from "#/features/reports/student/screens/StuEnrNewSex";

export const Route = createFileRoute("/student-report/stu-enr-new-sex")({
  component: StuEnrNewSex,
});

