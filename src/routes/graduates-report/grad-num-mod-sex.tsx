import { createFileRoute } from "@tanstack/react-router";
import { GradNumModSex } from "../../pages/graduates-report/GradNumModSex";

export const Route = createFileRoute("/graduates-report/grad-num-mod-sex")({
  component: GradNumModSex,
});
