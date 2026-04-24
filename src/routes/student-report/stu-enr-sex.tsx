import { createFileRoute } from "@tanstack/react-router";
import { StuEnrSex } from "../../pages/student-report/StuEnrSex";

export const Route = createFileRoute("/student-report/stu-enr-sex")({
  component: StuEnrSex,
});
