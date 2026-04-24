import { createFileRoute } from "@tanstack/react-router";
import { TeachList } from "../../pages/teacher-report/TeachList";

export const Route = createFileRoute("/teacher-report/teach-list")({
  component: TeachList,
});
