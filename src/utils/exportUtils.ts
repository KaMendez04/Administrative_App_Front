import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ColumnDef = { header: string; field: string; width?: number | "auto" };

export function downloadPDFFromRows(
  filename: string,
  rows: Array<Record<string, any>>,
  columns: Array<ColumnDef>,
  opts?: { title?: string; filterText?: string; logoSrc?: string }
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Paleta de la cámara
  const brandGreen: [number, number, number] = [112, 140, 62]; // #708C3E
  const brandGold: [number, number, number] = [163, 133, 61];  // #A3853D

  // Márgenes y posiciones base 
  const marginLeft = 40;
  const marginRight = 40;
  let y = 40; 

  // ---- Encabezado
  const title = opts?.title ?? "Gestión del Personal — Reporte";
  doc.setFontSize(16);
  doc.setTextColor(46, 50, 27); // #2E321B
  doc.text(title, marginLeft, y);

  y += 22;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado: ${new Date().toLocaleString()}`, marginLeft, y);

  y += 16;
  doc.setFontSize(10);
  doc.setTextColor(70);
  doc.text(`Filtro aplicado: ${opts?.filterText ?? "Sin filtro"}`, marginLeft, y);

  // Línea dorada 
  y += 12; // espacio antes de la línea
  const topLineY = y;
  doc.setDrawColor(...brandGold);
  doc.setLineWidth(0.8);
  doc.line(marginLeft, topLineY, pageWidth - marginRight, topLineY);

  // Tabla
  const head = [columns.map(c => c.header)];
  const body = rows.map(r => columns.map(c => String(r[c.field] ?? "")));

  autoTable(doc, {
  head,
  body,
  startY: 86,
  
  styles: { 
    fontSize: 10,
    cellPadding: 6,
    valign: "middle",
    overflow: "linebreak",  // permite salto de línea en textos largos
  },
  headStyles: { fillColor: brandGreen, textColor: 255, fontStyle: "bold" },
  alternateRowStyles: { fillColor: [250, 249, 245] },

  // Márgenes simétricos + centrado
  margin: { top: 86, left: 40, right: 40 },
  tableWidth: "auto",   
  halign: "center",     

  // 👇 Tipamos 'data' para TP
  didDrawPage: (data: any) => {
    const str = `Página ${data.pageNumber} de ${doc.internal.getNumberOfPages()}`;
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(str, pageWidth - 40, pageHeight - 20, { align: "right" });

    doc.setDrawColor(...brandGold);
    doc.setLineWidth(0.8);
    doc.line(40, 64, pageWidth - 40, 64);
  },
});


  // ---- Resumen final
  const afterTableY = (doc as any).lastAutoTable?.finalY ?? topLineY + 14;
  doc.setFontSize(11);
  doc.setTextColor(46, 50, 27);
  doc.text(`Total de registros: ${rows.length}`, marginLeft, afterTableY + 24);

  // Descargar
  doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
}