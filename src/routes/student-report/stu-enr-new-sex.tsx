import { createFileRoute } from "@tanstack/react-router";
import { StuEnrNewSex } from "../../pages/student-report/StuEnrNewSex";

export const Route = createFileRoute("/student-report/stu-enr-new-sex")({
  component: StuEnrNewSex,
});
