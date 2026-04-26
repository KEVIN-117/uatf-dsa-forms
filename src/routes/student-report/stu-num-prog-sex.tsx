import { createFileRoute } from "@tanstack/react-router";
import { StuNumProgSex } from "#/features/reports/student/screens/StuNumProgSex";

export const Route = createFileRoute("/student-report/stu-num-prog-sex")({
  component: StuNumProgSex,
});

