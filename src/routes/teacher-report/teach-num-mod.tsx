import { createFileRoute } from "@tanstack/react-router";
import { TeachNumMod } from "../../pages/teacher-report/TeachNumMod";

export const Route = createFileRoute("/teacher-report/teach-num-mod")({
  component: TeachNumMod,
});
