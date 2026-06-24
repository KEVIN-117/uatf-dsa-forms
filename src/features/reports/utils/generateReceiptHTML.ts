import type { TemplateSummary } from "#/features/reports/hooks/useDirectorSummary";
import { MODULE_LABELS } from "#/features/reports/utils/moduleLabels";

/** Replace HTML-special characters to prevent XSS when interpolating into raw HTML. */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function generateReceiptHTML(
  groups: TemplateSummary[],
  directorName: string,
  faculty: string,
  program: string,
): string {
  const now = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalRecords = groups.reduce((sum, g) => sum + g.responses.length, 0);

  const rows = groups
    .map((g) => {
      const moduleLabel = MODULE_LABELS[g.template.module] ?? g.template.module;
      const lastDate =
        g.responses.length > 0
          ? new Date(
            Math.max(...g.responses.map((r) => r.createdAt)),
          ).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : "-";
      return `<tr>
        <td>${g.template.step}</td>
        <td>${escapeHTML(moduleLabel)}</td>
        <td>${escapeHTML(g.template.title)}</td>
        <td style="text-align:center;font-weight:600">${g.responses.length}</td>
        <td>${escapeHTML(lastDate)}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Comprobante de Envío — UATF</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      color: #1a1a1a;
      padding: 32px 40px;
      line-height: 1.5;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #1e40af;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .header-text {
      text-align: center;
      flex: 1;
    }
    .header img {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }
    .header h1 { font-size: 18px; color: #1e40af; margin-bottom: 4px; }
    .header h2 { font-size: 12px; font-weight: normal; color: #475569; }
    .info-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 16px 20px;
      margin-bottom: 24px;
      background: #f8fafc;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
    .info-row span { color: #64748b; }
    .info-row strong { color: #1a1a1a; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    th {
      background: #1e40af;
      color: white;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    tr:nth-child(even) { background: #f1f5f9; }
    tfoot td {
      font-weight: 700;
      background: #e2e8f0;
      border-top: 2px solid #1e40af;
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      line-height: 1.6;
    }
    .signature {
      margin-top: 32px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      text-align: center;
      width: 200px;
    }
    .signature-line {
      border-top: 1px solid #1a1a1a;
      margin-top: 42px;
      padding-top: 4px;
      font-size: 11px;
      color: #475569;
    }
    @media print {
      body { padding: 16px 24px; }
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${window.location.origin}/logoUATF.png" alt="Logo UATF" />
    <div class="header-text">
    <h1>Universidad Autónoma Tomás Frías</h1>
    <h2>Comprobante de Envío de Reportes Académicos</h2>
    </div>
    <img src="${window.location.origin}/dsa-icon.png" alt="Logo DSA" />
  </div>

  <div class="info-box">
    <div class="info-row">
      <span>Director:</span> <strong>${escapeHTML(directorName)}</strong>
    </div>
    <div class="info-row">
      <span>Facultad:</span> <strong>${escapeHTML(faculty)}</strong>
    </div>
    <div class="info-row">
      <span>Carrera:</span> <strong>${escapeHTML(program)}</strong>
    </div>
    <div class="info-row">
      <span>Fecha de emisión:</span> <strong>${escapeHTML(now)}</strong>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Paso</th>
        <th>Módulo</th>
        <th>Formulario</th>
        <th style="text-align:center">Registros</th>
        <th>Último envío</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
    <tfoot>
      <tr>
        <td colspan="3" style="text-align:right">Total de registros enviados</td>
        <td style="text-align:center">${totalRecords}</td>
        <td></td>
      </tr>
    </tfoot>
  </table>

  <div class="signature">
    <div class="signature-box">
      <div class="signature-line">Firma del Director</div>
      <div>${escapeHTML(directorName)}</div>
    </div>
  </div>

  <div class="footer">
    Documento generado automáticamente por el Sistema de Reportes Académicos — UATF<br>
    Este comprobante certifica que los datos fueron registrados correctamente en el sistema.
  </div>
</body>
</html>`;
}
