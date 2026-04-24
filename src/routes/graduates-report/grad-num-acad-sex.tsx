import { createFileRoute } from "@tanstack/react-router";
import { GradNumAcadSex } from "../../pages/graduates-report/GradNumAcadSex";

export const Route = createFileRoute("/graduates-report/grad-num-acad-sex")({
  component: GradNumAcadSex,
});
