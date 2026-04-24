import { createFileRoute } from "@tanstack/react-router";
import { TeachNumAcad } from "../../pages/teacher-report/TeachNumAcad";

export const Route = createFileRoute("/teacher-report/teach-num-acad")({
  component: TeachNumAcad,
});
