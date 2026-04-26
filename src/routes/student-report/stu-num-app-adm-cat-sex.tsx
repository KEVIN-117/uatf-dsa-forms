import { createFileRoute } from "@tanstack/react-router";
import { StuNumAppAdmCatSex } from "#/features/reports/student/screens/StuNumAppAdmCatSex";

export const Route = createFileRoute("/student-report/stu-num-app-adm-cat-sex")({
  component: StuNumAppAdmCatSex,
});

