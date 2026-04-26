import { createFileRoute } from "@tanstack/react-router";
import { SchFoodTypeSex } from "#/features/reports/scholarship/screens/SchFoodTypeSex";

export const Route = createFileRoute("/scholarship-report/sch-food-type-sex")({
  component: SchFoodTypeSex,
});

