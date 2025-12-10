// src/utils/personalPdfUtils.ts
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { PersonalPageType } from "../models/PersonalPageType";

// ===== PDF INDIVIDUAL =====
export function downloadPersonalPDF(person: PersonalPageType) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  let yPos = 25;

  // ===== ENCABEZADO FORMAL =====
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40, 40, 40);
  doc.text("CÁMARA DE GANADEROS", pageWidth / 2, yPos, { align: "center" });
  yPos += 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Información del Personal", pageWidth / 2, yPos, { align: "center" });
  yPos += 6;

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("Hojancha, Costa Rica", pageWidth / 2, yPos, { align: "center" });
  yPos += 3;

  // Línea separadora debajo del encabezado
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Fecha y hora en la esquina
  const today = new Date();
  const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha: ${dateStr}`, pageWidth - margin, yPos, { align: "right" });
  yPos += 10;

  // ===== FUNCIONES AUXILIARES =====
  const addSectionTitle = (title: string, y: number) => {
    // Línea superior
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 2, pageWidth - (2 * margin), 8, "F");
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(title, margin + 3, y + 4);
    
    return y + 12;
  };

  const addField = (label: string, value: string, x: number, y: number, width: number) => {
    // Label
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text(label.toUpperCase(), x, y);
    
    // Value
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    const displayValue = value || "—";
    
    // Agregar el texto con posible wrapping
    const lines = doc.splitTextToSize(displayValue, width - 5);
    doc.text(lines, x, y + 5);
    
    // Línea debajo del campo
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.3);
    doc.line(x, y + 8, x + width, y + 8);
    
    return y + 14;
  };

  // ===== 1. INFORMACIÓN PERSONAL =====
  yPos = addSectionTitle("1. INFORMACIÓN PERSONAL", yPos);

  const col1X = margin + 5;
  const col2X = pageWidth / 2 + 5;
  const colWidth = (pageWidth / 2) - margin - 10;

  // Nombre completo (full width)
  yPos = addField(
    "Nombre completo",
    `${person.name || ""} ${person.lastname1 || ""} ${person.lastname2 || ""}`.trim(),
    col1X,
    yPos,
    pageWidth - (2 * margin) - 10
  );

  // Cédula y Fecha de nacimiento
  let tempY = yPos;
  tempY = addField("Cédula", person.IDE || "—", col1X, tempY, colWidth);
  yPos = addField("Fecha de nacimiento", person.birthDate || "—", col2X, yPos, colWidth);
  yPos = Math.max(tempY, yPos);

  // Teléfono y Email
  tempY = yPos;
  tempY = addField("Teléfono", person.phone || "—", col1X, tempY, colWidth);
  yPos = addField("Correo electrónico", person.email || "—", col2X, yPos, colWidth);
  yPos = Math.max(tempY, yPos);

  // Dirección (full width)
  yPos = addField(
    "Dirección",
    person.direction || "—",
    col1X,
    yPos,
    pageWidth - (2 * margin) - 10
  );

  yPos += 5;

  // ===== 2. INFORMACIÓN LABORAL =====
  yPos = addSectionTitle("2. INFORMACIÓN LABORAL", yPos);

  // Puesto (full width)
  yPos = addField(
    "Puesto",
    person.occupation || "—",
    col1X,
    yPos,
    pageWidth - (2 * margin) - 10
  );

  // Estado y Fecha de inicio
  tempY = yPos;
  tempY = addField("Estado", person.isActive ? "Activo" : "Inactivo", col1X, tempY, colWidth);
  yPos = addField("Fecha de inicio laboral", person.startWorkDate || "—", col2X, yPos, colWidth);
  yPos = Math.max(tempY, yPos);

  // Fecha de salida (solo si está inactivo)
  if (!person.isActive && person.endWorkDate) {
    yPos = addField("Fecha de salida", person.endWorkDate, col1X, yPos, colWidth);
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 20;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(120, 120, 120);
  doc.text(`Generado: ${dateStr}`, pageWidth / 2, footerY + 5, { align: "center" });
  doc.text("Página 1 de 1", pageWidth / 2, footerY + 10, { align: "center" });

  // ===== GUARDAR PDF =====
  const fileName = `Personal_${person.name}_${person.lastname1}_${person.IDE}.pdf`
    .replace(/\s+/g, "_")
    .toLowerCase();
  
  doc.save(fileName);
}

// ===== PDF GENERAL (LISTADO) =====
export function downloadPersonalListPDF(people: PersonalPageType[], filterText?: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  let currentPage = 1;
  let totalPages = 1;

  const addHeader = () => {
    let yPos = 25;
    
    // Encabezado
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("CÁMARA DE GANADEROS", pageWidth / 2, yPos, { align: "center" });
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Listado del Personal", pageWidth / 2, yPos, { align: "center" });
    yPos += 6;

    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Hojancha, Costa Rica", pageWidth / 2, yPos, { align: "center" });
    yPos += 3;

    // Línea separadora
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Fecha
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Fecha: ${dateStr}`, pageWidth - margin, yPos + 8, { align: "right" });
  };

  const addFooter = (pageNum: number) => {
    const footerY = pageHeight - 20;
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(120, 120, 120);
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    doc.text(`Generado: ${dateStr}`, pageWidth / 2, footerY + 5, { align: "center" });
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth / 2, footerY + 10, { align: "center" });
  };

  addHeader();

  let startY = 60;
  
  // Filtro (si existe)
  if (filterText && filterText.trim()) {
    doc.setFillColor(250, 250, 250);
    doc.rect(margin, startY - 3, pageWidth - (2 * margin), 8, "F");
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80, 80, 80);
    doc.text(`Filtro aplicado: ${filterText}`, margin + 3, startY + 2);
    startY += 12;
  }

  // Calcular páginas totales
  totalPages = Math.ceil(people.length / 10) || 1;

  // Tabla formal
  (doc as any).autoTable({
    startY: startY,
    head: [['Cédula', 'Nombre Completo', 'Teléfono', 'Puesto', 'Estado']],
    body: people.map(p => [
      p.IDE || '—',
      `${p.name || ''} ${p.lastname1 || ''} ${p.lastname2 || ''}`.trim(),
      p.phone || '—',
      p.occupation || '—',
      p.isActive ? 'Activo' : 'Inactivo'
    ]),
    headStyles: {
      fillColor: [245, 245, 245],
      textColor: [40, 40, 40],
      fontSize: 9,
      fontStyle: 'bold',
      lineWidth: 0.3,
      lineColor: [180, 180, 180],
      halign: 'left',
      cellPadding: 3
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
      lineWidth: 0.2,
      lineColor: [220, 220, 220],
      cellPadding: 3
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252]
    },
    columnStyles: {
      0: { cellWidth: 30 },  // Cédula
      1: { cellWidth: 55 },  // Nombre
      2: { cellWidth: 28 },  // Teléfono
      3: { cellWidth: 40 },  // Puesto
      4: { cellWidth: 22 }   // Estado
    },
    margin: { top: startY, left: margin, right: margin, bottom: 30 },
    didDrawPage: (data: any) => {
      if (data.pageNumber > 1) {
        addHeader();
      }
      addFooter(currentPage);
      currentPage++;
    }
  });

  // Guardar
  const fileName = filterText && filterText.trim() 
    ? `Personal_Listado_${filterText.replace(/\s+/g, '_')}.pdf`
    : 'Personal_Listado_Completo.pdf';
  
  doc.save(fileName);
}