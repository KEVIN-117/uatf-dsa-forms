import { SuccessCard } from "#/features/reports/components/SuccessCard";
import { ReceiptSummary } from "#/features/reports/components/ReceiptSummary";
import { Card, CardContent } from "#/shared/ui/card";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
} from "#/shared/ui/alert-dialog";
import { ArrowRight } from "lucide-react";
import type { TemplateSummary } from "#/features/reports/hooks/useDirectorSummary";

/**
 * Variant types for FormSuccess:
 *
 * - `completion` : Full flow → loader → dialog → summary (after finishing all forms)
 * - `readonly`   : Summary only, no dialog or loader (from dashboard link)
 * - `minimal`    : Just the success card, no summary data
 */
type FormSuccessVariant = "completion" | "readonly" | "minimal";

interface FormSuccessProps {
  /** Controls the visual flow variant */
  variant?: FormSuccessVariant;
  /** Whether data is still loading */
  isLoading?: boolean;
  /** Grouped summary data to display */
  groups?: TemplateSummary[];
  /** Director's full name for the receipt */
  directorName?: string;
  /** Faculty name */
  faculty?: string;
  /** Program name */
  program?: string;
}

/**
 * Composable FormSuccess component with multiple variants.
 *
 * Usage:
 * ```tsx
 * // After completing all forms:
 * <FormSuccess variant="completion" isLoading={isPending} groups={data} ... />
 *
 * // From dashboard "Ver comprobante":
 * <FormSuccess variant="readonly" isLoading={isPending} groups={data} ... />
 *
 * // Simple success message (e.g., single step completion):
 * <FormSuccess variant="minimal" />
 * ```
 */
export function FormSuccess({
  variant = "readonly",
  isLoading = false,
  groups = [],
  directorName = "Director",
  faculty = "-",
  program = "-",
}: FormSuccessProps) {
  switch (variant) {
    case "completion":
      return (
        <CompletionFlow
          isLoading={isLoading}
          groups={groups}
          directorName={directorName}
          faculty={faculty}
          program={program}
        />
      );
    case "minimal":
      return (
        <div className="w-full max-w-3xl mx-auto py-8 px-4">
          <SuccessCard />
        </div>
      );
    case "readonly":
    default:
      return (
        <ReadonlyFlow
          isLoading={isLoading}
          groups={groups}
          directorName={directorName}
          faculty={faculty}
          program={program}
        />
      );
  }
}

// ─── Variant: Completion ──────────────────────────────────────────────
// Shows: loader → dialog → summary

interface FlowProps {
  isLoading: boolean;
  groups: TemplateSummary[];
  directorName: string;
  faculty: string;
  program: string;
}

function CompletionFlow({ isLoading, groups, directorName, faculty, program }: FlowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const hasSummary = groups.length > 0;

  // Auto-open dialog when loading finishes
  useEffect(() => {
    if (!isLoading && !dismissed) {
      setDialogOpen(true);
    }
  }, [isLoading, dismissed]);

  const handleContinue = () => {
    setDialogOpen(false);
    setDismissed(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Phase 1: Loading */}
      {isLoading && !dismissed && (
        <SuccessCard isLoading loadingText="Cargando resumen de envíos..." />
      )}

      {/* Phase 2: Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
          <SuccessCard />
          <AlertDialogFooter className="px-6 pb-6 pt-0 justify-center">
            <AlertDialogAction
              onClick={handleContinue}
              className="w-full gap-2 font-bold py-5 text-base"
            >
              Ver Comprobante <ArrowRight className="size-4" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Phase 3: Summary */}
      {dismissed && (
        <SummarySection
          isLoading={false}
          hasSummary={hasSummary}
          groups={groups}
          directorName={directorName}
          faculty={faculty}
          program={program}
        />
      )}
    </div>
  );
}

// ─── Variant: Readonly ────────────────────────────────────────────────
// Shows: loader → summary (no dialog)

function ReadonlyFlow({ isLoading, groups, directorName, faculty, program }: FlowProps) {
  const hasSummary = groups.length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8">
      {isLoading && (
        <SuccessCard isLoading loadingText="Cargando resumen de envíos..." />
      )}

      {!isLoading && (
        <SummarySection
          isLoading={isLoading}
          hasSummary={hasSummary}
          groups={groups}
          directorName={directorName}
          faculty={faculty}
          program={program}
        />
      )}
    </div>
  );
}

// ─── Shared: Summary Section ──────────────────────────────────────────

function SummarySection({
  isLoading,
  hasSummary,
  groups,
  directorName,
  faculty,
  program,
}: {
  isLoading: boolean;
  hasSummary: boolean;
  groups: TemplateSummary[];
  directorName: string;
  faculty: string;
  program: string;
}) {
  if (hasSummary) {
    return (
      <ReceiptSummary
        groups={groups}
        directorName={directorName}
        faculty={faculty}
        program={program}
      />
    );
  }

  if (!isLoading) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            No se encontraron reportes enviados. Si acabas de enviar tus
            formularios, espera unos segundos e intenta recargar la página.
          </p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
