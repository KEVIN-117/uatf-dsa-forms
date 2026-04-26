import { createFileRoute } from "@tanstack/react-router";
import { StuNumAppCatSex } from "#/features/reports/student/screens/StuNumAppCatSex";

export const Route = createFileRoute("/student-report/stu-num-app-cat-sex")({
  component: StuNumAppCatSex,
});

