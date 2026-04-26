import { createFileRoute } from "@tanstack/react-router";
import { GradNumAcadSex } from "#/features/reports/graduates/screens/GradNumAcadSex";

export const Route = createFileRoute("/graduates-report/grad-num-acad-sex")({
  component: GradNumAcadSex,
});

