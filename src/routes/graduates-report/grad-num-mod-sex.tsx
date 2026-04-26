import { createFileRoute } from "@tanstack/react-router";
import { GradNumModSex } from "#/features/reports/graduates/screens/GradNumModSex";

export const Route = createFileRoute("/graduates-report/grad-num-mod-sex")({
  component: GradNumModSex,
});

