import { createFileRoute } from "@tanstack/react-router";
import { StuNumPassFailDrop } from "../../pages/student-report/StuNumPassFailDrop";

export const Route = createFileRoute("/student-report/stu-num-pass-fail-drop")({
  component: StuNumPassFailDrop,
});
