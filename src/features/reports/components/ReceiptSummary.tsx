import { Download } from "lucide-react";
import { useCallback } from "react";
import type { TemplateSummary } from "#/features/reports/hooks/useDirectorSummary";
import { generateReceiptHTML } from "#/features/reports/utils/generateReceiptHTML";
import { MODULE_LABELS } from "#/features/reports/utils/moduleLabels";
import { Button } from "#/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/shared/ui/card";

interface ReceiptSummaryProps {
	groups: TemplateSummary[];
	directorName: string;
	faculty: string;
	program: string;
}

export function ReceiptSummary({
	groups,
	directorName,
	faculty,
	program,
}: ReceiptSummaryProps) {
	const totalRecords = groups.reduce((sum, g) => sum + g.responses.length, 0);

	const handleDownloadPDF = useCallback(() => {
		const html = generateReceiptHTML(groups, directorName, faculty, program);

		const printWindow = window.open("", "_blank");
		if (!printWindow) return;

		printWindow.document.write(html);
		printWindow.document.close();
		printWindow.focus();

		printWindow.onload = () => {
			printWindow.print();
		};
	}, [groups, directorName, faculty, program]);

	return (
		<Card className="glass-card shadow-lg border-border/40 overflow-hidden animate-fade-up">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<div>
					<CardTitle className="text-xl font-display">
						Comprobante de Envío
					</CardTitle>
					<p className="text-sm text-muted-foreground mt-1">{directorName}</p>
				</div>
				<Button
					onClick={handleDownloadPDF}
					className="gap-2 font-bold hover-lift"
					size="sm"
				>
					<Download className="size-4" />
					Descargar / Imprimir
				</Button>
			</CardHeader>

			<CardContent className="space-y-4">
				{/* Director info */}
				<div className="grid grid-cols-2 gap-3 p-3 bg-muted/30 rounded-lg text-sm">
					<div>
						<span className="text-xs text-muted-foreground">Facultad</span>
						<p className="font-semibold text-foreground">{faculty}</p>
					</div>
					<div>
						<span className="text-xs text-muted-foreground">Carrera</span>
						<p className="font-semibold text-foreground">{program}</p>
					</div>
					<div>
						<span className="text-xs text-muted-foreground">Fecha</span>
						<p className="font-semibold text-foreground">
							{new Date().toLocaleDateString("es-ES", {
								day: "2-digit",
								month: "long",
								year: "numeric",
							})}
						</p>
					</div>
					<div>
						<span className="text-xs text-muted-foreground">
							Total registros
						</span>
						<p className="font-semibold text-primary text-lg">{totalRecords}</p>
					</div>
				</div>

				{/* Compact summary table */}
				<div className="overflow-x-auto rounded-lg border border-border/50">
					<table className="w-full text-sm">
						<thead>
							<tr className="bg-primary/5 border-b border-border/50">
								<th className="px-4 py-2.5 text-left font-semibold text-primary text-xs uppercase tracking-wider">
									Paso
								</th>
								<th className="px-4 py-2.5 text-left font-semibold text-primary text-xs uppercase tracking-wider">
									Módulo
								</th>
								<th className="px-4 py-2.5 text-left font-semibold text-primary text-xs uppercase tracking-wider">
									Formulario
								</th>
								<th className="px-4 py-2.5 text-center font-semibold text-primary text-xs uppercase tracking-wider">
									Registros
								</th>
								<th className="px-4 py-2.5 text-left font-semibold text-primary text-xs uppercase tracking-wider">
									Último envío
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border/30">
							{groups.map((group) => {
								const moduleLabel =
									MODULE_LABELS[group.template.module] ?? group.template.module;
								const lastDate =
									group.responses.length > 0
										? new Date(
												Math.max(...group.responses.map((r) => r.createdAt)),
											).toLocaleDateString("es-ES", {
												day: "2-digit",
												month: "short",
												year: "numeric",
											})
										: "-";

								return (
									<tr
										key={group.template.id}
										className="hover:bg-muted/30 transition-colors"
									>
										<td className="px-4 py-2.5 text-foreground/70 font-mono text-xs">
											{group.template.step}
										</td>
										<td className="px-4 py-2.5">
											<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
												{moduleLabel}
											</span>
										</td>
										<td className="px-4 py-2.5 font-medium text-foreground">
											{group.template.title}
										</td>
										<td className="px-4 py-2.5 text-center font-bold text-foreground">
											{group.responses.length}
										</td>
										<td className="px-4 py-2.5 text-foreground/70 text-xs">
											{lastDate}
										</td>
									</tr>
								);
							})}
						</tbody>
						<tfoot>
							<tr className="bg-muted/40 border-t-2 border-primary/20">
								<td
									colSpan={3}
									className="px-4 py-2.5 text-right font-semibold text-foreground"
								>
									Total
								</td>
								<td className="px-4 py-2.5 text-center font-bold text-primary text-base">
									{totalRecords}
								</td>
								<td />
							</tr>
						</tfoot>
					</table>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-muted-foreground pt-2">
					Documento generado por el Sistema de Reportes Académicos — UATF
				</p>
			</CardContent>
		</Card>
	);
}
