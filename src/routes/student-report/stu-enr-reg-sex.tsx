import { createFileRoute } from "@tanstack/react-router";
import { StuEnrRegSex } from "#/features/reports/student/screens/StuEnrRegSex";

export const Route = createFileRoute("/student-report/stu-enr-reg-sex")({
  component: StuEnrRegSex,
});

