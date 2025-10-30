import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

type SolicitudData = any;
type AssociateData = any;
type FincaData = any;

export const generateSolicitudPDF = (
  solicitud: SolicitudData,
  associate: AssociateData,
  fincas: FincaData[]
) => {
  const doc = new jsPDF();
  let yPosition = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // ==================== FUNCIONES AUXILIARES ====================
  const checkPageBreak = (neededSpace: number = 25) => {
    if (yPosition + neededSpace > pageHeight - 25) {
      doc.addPage();
      yPosition = 15;
      return true;
    }
    return false;
  };

  const addMainSection = (number: string, title: string) => {
    checkPageBreak(15);
    
    // Fondo más sutil con borde
    doc.setFillColor(245, 247, 243); // Gris verdoso muy claro
    doc.setDrawColor(91, 115, 46); // Verde oscuro para el borde
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, yPosition - 5, pageWidth - margin * 2, 9, 1, 1, 'FD');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(91, 115, 46); // Verde oscuro para el texto
    doc.text(`${number}. ${title}`, margin + 3, yPosition + 1);
    doc.setTextColor(0, 0, 0);
    yPosition += 10;
  };

  const addFieldRow = (fields: Array<{ label: string; value: string; width?: number }>) => {
    checkPageBreak(12);
    let xPos = margin;
    const rowHeight = 11;

    fields.forEach((field) => {
      const fieldWidth = field.width || (pageWidth - margin * 2) / fields.length;
      
      // Label
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 100, 100);
      doc.text(field.label, xPos, yPosition);
      
      // Línea debajo del valor
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(xPos, yPosition + 6, xPos + fieldWidth - 3, yPosition + 6);
      
      // Value
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      const valueText = doc.splitTextToSize(field.value, fieldWidth - 3);
      doc.text(valueText, xPos, yPosition + 4);
      
      xPos += fieldWidth;
    });

    yPosition += rowHeight;
  };

  const addCheckboxGroup = (title: string, items: string[]) => {
    if (!items || items.length === 0) return;
    
    checkPageBreak(10);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(title, margin, yPosition);
    
    yPosition += 5;
    
    let xPos = margin + 3;
    const boxSize = 3;

    
    items.forEach((item) => {
      const itemWidth = doc.getTextWidth(item) + boxSize + 10;
      
      if (xPos + itemWidth > pageWidth - margin) {
        xPos = margin + 3;
        yPosition += 6;
        checkPageBreak(6);
      }
      
      // Checkbox con borde
      doc.setDrawColor(91, 115, 46);
      doc.setLineWidth(0.4);
      doc.rect(xPos, yPosition - 2.5, boxSize, boxSize);
      
      // Check mark
      doc.setDrawColor(91, 115, 46);
      doc.setLineWidth(0.8);
      doc.line(xPos + 0.5, yPosition - 1, xPos + 1.2, yPosition - 0.2);
      doc.line(xPos + 1.2, yPosition - 0.2, xPos + 2.5, yPosition - 2.3);
      
      // Texto
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text(item, xPos + boxSize + 2, yPosition);
      
      xPos += itemWidth;
    });
    
    yPosition += 8;
  };

  const addCompactTable = (data: any[][], headers: string[]) => {
    checkPageBreak(30);
    
    autoTable(doc, {
      startY: yPosition,
      head: [headers],
      body: data,
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 2.5,
        lineColor: [220, 220, 220],
        lineWidth: 0.3,
        textColor: [40, 40, 40],
      },
      headStyles: {
        fillColor: [91, 115, 46],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      alternateRowStyles: {
        fillColor: [250, 251, 248],
      },
      margin: { left: margin, right: margin },
    });

    yPosition = doc.lastAutoTable.finalY + 7;
  };

  // ==================== HEADER ====================
  // Logo o espacio para logo (opcional)
  doc.setFillColor(245, 247, 243);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(91, 115, 46);
  doc.text('CÁMARA DE GANADEROS', pageWidth / 2, yPosition + 3, { align: 'center' });
  yPosition += 8;
  
  doc.setFontSize(13);
  doc.setTextColor(100, 100, 100);
  doc.text('DIAGNÓSTICO DE FINCA', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Estado y fecha
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const estadoColor: [number, number, number] = 
    solicitud.estado === 'PENDIENTE' ? [234, 179, 8] :
    solicitud.estado === 'APROBADO' ? [34, 139, 34] : [220, 53, 69];
  
  doc.setFillColor(...estadoColor);
  doc.roundedRect(margin, yPosition - 3, 35, 5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.text(solicitud.estado, margin + 17.5, yPosition, { align: 'center' });
  
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha: ${new Date(solicitud.createdAt).toLocaleDateString('es-CR')}`, pageWidth - margin, yPosition, { align: 'right' });
  
  yPosition += 8;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // ==================== 1. INFORMACIÓN DEL PRODUCTOR ====================
  addMainSection('1', 'INFORMACIÓN DEL PRODUCTOR');

  addFieldRow([
    { label: 'Nombre completo', value: `${solicitud.persona.nombre} ${solicitud.persona.apellido1} ${solicitud.persona.apellido2}`, width: 110 },
    { label: 'No. de cédula', value: solicitud.persona.cedula, width: 45 },
  ]);

  addFieldRow([
    { label: 'Fecha de nacimiento', value: new Date(solicitud.persona.fechaNacimiento).toLocaleDateString('es-CR'), width: 50 },
    { label: 'Teléfono', value: solicitud.persona.telefono, width: 50 },
    { label: 'Correo electrónico', value: solicitud.persona.email, width: 80 },
  ]);

  addFieldRow([
    { label: 'Dirección de la casa de habitación', value: solicitud.persona.direccion || 'No especificada' },
  ]);

  // Núcleo familiar
  if (associate?.nucleoFamiliar) {
    yPosition += 2;
    checkPageBreak(15);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('Miembros del núcleo familiar:', margin, yPosition);
    yPosition += 5;
    
    addCompactTable(
      [[
        associate.nucleoFamiliar.nucleoHombres.toString(),
        associate.nucleoFamiliar.nucleoMujeres.toString(),
        associate.nucleoFamiliar.nucleoTotal.toString(),
      ]],
      ['Hombres', 'Mujeres', 'Total']
    );
  }

  addFieldRow([
    { label: '¿Viven en la finca?', value: associate?.viveEnFinca ? 'Sí' : 'No', width: 60 },
    { label: 'CVO', value: associate?.CVO || 'No especificado', width: 60 },
    { label: 'Marca de ganado', value: associate?.marcaGanado || 'No especificada', width: 60 },
  ]);

  // ==================== 2. INFORMACIÓN GENERAL DE LA FINCA ====================
  if (fincas && fincas.length > 0) {
    fincas.forEach((finca: any, index: number) => {
      yPosition += 3;
      checkPageBreak(30);
      
      addMainSection('2', `INFORMACIÓN GENERAL DE LA FINCA${fincas.length > 1 ? ` #${index + 1}` : ''}`);

      addFieldRow([
        { label: 'Nombre de la finca', value: finca.nombre || 'Sin nombre', width: 65 },
        { label: 'Propietario', value: finca.propietario?.persona ? `${finca.propietario.persona.nombre} ${finca.propietario.persona.apellido1}` : 'El asociado', width: 90 },
      ]);

      addFieldRow([
        { label: 'Área (Hectáreas)', value: finca.areaHa?.toString() || '0', width: 40 },
        { label: 'Número de plano', value: finca.numeroPlano || 'No especificado', width: 70 },
      ]);

      // Localización
      if (finca.geografia) {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text('Localización de la finca:', margin, yPosition);
        yPosition += 5;

        addFieldRow([
          { label: 'Provincia', value: finca.geografia.provincia, width: 38 },
          { label: 'Cantón', value: finca.geografia.canton, width: 38 },
          { label: 'Distrito', value: finca.geografia.distrito, width: 38 },
          { label: 'Caserío', value: finca.geografia.caserio || '—', width: 38 },
        ]);
      }

      // ==================== DISPOSICIÓN DE FORRAJES ====================
      if (finca.forrajes && finca.forrajes.length > 0) {
        yPosition += 3;
        checkPageBreak(25);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text('Disposición de forrajes para alimentación de ganado', margin, yPosition);
        yPosition += 6;

        const forrajeData = finca.forrajes.map((f: any) => [
          f.tipoForraje || '—',
          f.variedad || '—',
          f.hectareas?.toString() || '0',
          f.utilizacion || '—',
        ]);

        addCompactTable(forrajeData, ['Tipo de forraje', 'Variedad', 'Ha', 'Utilización']);
      }

      // ==================== 3. DESCRIPCIÓN DEL HATO ====================
      if (finca.hato) {
        yPosition += 3;
        checkPageBreak(25);
        addMainSection('3', 'DESCRIPCIÓN DEL HATO GANADERO');

        addFieldRow([
          { label: 'Tipo de explotación', value: finca.hato.tipoExplotacion || 'No especificado', width: 70 },
          { label: 'Total del hato', value: finca.hato.totalGanado?.toString() || '0', width: 40 },
          { label: 'Raza predominante', value: finca.hato.razaPredominante || 'No especificada', width: 70 },
        ]);

        if (finca.hato.animales && finca.hato.animales.length > 0) {
          yPosition += 3;
          checkPageBreak(25);
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(80, 80, 80);
          doc.text('No. de animales por tipo y edad', margin, yPosition);
          yPosition += 5;

          const animalData = finca.hato.animales.map((a: any) => [
            a.nombre || '—',
            a.edad || '—',
            a.cantidad?.toString() || '0',
          ]);

          addCompactTable(animalData, ['Categoría', 'Edad Aprox.', 'Cantidad']);
        }
      }

      // ==================== 4. REGISTROS ====================
      if (finca.registrosProductivos) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('4', 'REGISTROS');
        
        const registros: string[] = [];
        if (finca.registrosProductivos.reproductivos) registros.push('Reproductivos en bovinos');
        if (finca.registrosProductivos.costosProductivos) registros.push('Costos de producción');
        if (registros.length === 0) registros.push('No lleva registros');
        
        addCheckboxGroup('Lleva registros en su finca:', registros);
      }

      // ==================== 5. FUENTES DE AGUA ====================
      if (finca.fuentesAgua && finca.fuentesAgua.length > 0) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('5', 'FUENTES DE AGUA');
        addCheckboxGroup('Tipo de fuente de agua en la finca:', finca.fuentesAgua.map((f: any) => f.nombre));
      }

      // ==================== 6. OTRAS ACTIVIDADES ====================
      if (finca.actividades && finca.actividades.length > 0) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('6', 'OTRAS ACTIVIDADES AGROPECUARIAS');
        addCheckboxGroup('Otros cultivos en la finca:', finca.actividades.map((a: any) => a.nombre));
      }

      // ==================== 7. INFRAESTRUCTURA ====================
      yPosition += 3;
      checkPageBreak(25);
      addMainSection('7', 'INFRAESTRUCTURA Y EQUIPO PARA LA PRODUCCIÓN');

      if (finca.infraestructura) {
        addFieldRow([
          { label: 'No. de apartos', value: finca.infraestructura.numeroAparatos?.toString() || '0', width: 40 },
          { label: 'No. de bebederos', value: finca.infraestructura.numeroBebederos?.toString() || '0', width: 40 },
          { label: 'No. de saladeros', value: finca.infraestructura.numeroSaleros?.toString() || '0', width: 40 },
        ]);
      }

      if (finca.tiposCerca && finca.tiposCerca.length > 0) {
        yPosition += 2;
        const cercas: string[] = [];
        finca.tiposCerca.forEach((tc: any) => {
          if (tc.tipoCerca?.viva) cercas.push('Viva');
          if (tc.tipoCerca?.electrica) cercas.push('Eléctrica');
          if (tc.tipoCerca?.pMuerto) cercas.push('Poste muerto');
        });
        if (cercas.length > 0) {
          addCheckboxGroup('Tipo de cerca:', cercas);
        }
      }

      if (finca.infraestructuras && finca.infraestructuras.length > 0) {
        yPosition += 2;
        const infraList = finca.infraestructuras.map((i: any) => i.infraestructura?.nombre || '—');
        addCheckboxGroup('Infraestructuras disponibles:', infraList);
      }

      // ==================== 8. RIEGO ====================
      if (finca.metodosRiego && finca.metodosRiego.length > 0) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('8', 'RIEGO PARA FORRAJES O CULTIVOS');
        addCheckboxGroup('Métodos de riego:', finca.metodosRiego.map((m: any) => m.nombre));
      }

      // ==================== 9. VÍAS DE ACCESO ====================
      if (finca.accesos && finca.accesos.length > 0) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('9', 'VÍAS DE ACCESO');
        addCheckboxGroup('Tipo de vía:', finca.accesos.map((a: any) => a.nombre));
      }

      // ==================== 10. CORRIENTE ELÉCTRICA ====================
      if (finca.corriente) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('10', 'CORRIENTE ELÉCTRICA EN LA FINCA');
        const corrientes: string[] = [];
        if (finca.corriente.publica) corrientes.push('Pública');
        if (finca.corriente.privada) corrientes.push('Privada');
        if (corrientes.length === 0) corrientes.push('No hay');
        addCheckboxGroup('Tipo de corriente:', corrientes);
      }

      // ==================== 11. OTROS EQUIPOS ====================
      if (finca.otrosEquipos && finca.otrosEquipos.length > 0) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('11', 'OTROS EQUIPOS');
        addCheckboxGroup('Equipos disponibles:', finca.otrosEquipos.map((e: any) => e.nombreEquipo));
      }

      // ==================== 12. COMERCIALIZACIÓN ====================
      if (finca.canales && finca.canales.length > 0) {
        yPosition += 3;
        checkPageBreak(15);
        addMainSection('12', 'COMERCIALIZACIÓN');
        addCheckboxGroup('Canales de venta:', finca.canales.map((c: any) => c.nombre));
      }
    });
  }

  // ==================== 13. NECESIDADES ====================
  if (associate?.necesidades && associate.necesidades.length > 0) {
    yPosition += 5;
    checkPageBreak(30);
    addMainSection('13', 'NECESIDADES O MEJORAS A REALIZAR EN LA FINCA');
    
    associate.necesidades.slice(0, 5).forEach((nec: any, idx: number) => {
      checkPageBreak(10);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(40, 40, 40);
      doc.text(`${idx + 1}.`, margin, yPosition);
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(margin + 5, yPosition + 2, pageWidth - margin, yPosition + 2);
      const splitText = doc.splitTextToSize(nec.descripcion, pageWidth - margin * 2 - 10);
      doc.text(splitText, margin + 6, yPosition);
      yPosition += Math.max(8, splitText.length * 4 + 2);
    });
  }

  // ==================== MOTIVO DE RECHAZO ====================
  if (solicitud.estado === 'RECHAZADO' && solicitud.motivo) {
    yPosition += 5;
    checkPageBreak(25);
    
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(220, 53, 69);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, yPosition - 5, pageWidth - margin * 2, 9, 1, 1, 'FD');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 53, 69);
    doc.text('MOTIVO DE RECHAZO', margin + 3, yPosition + 1);
    yPosition += 10;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const splitMotivo = doc.splitTextToSize(solicitud.motivo, pageWidth - margin * 2 - 4);
    doc.text(splitMotivo, margin + 2, yPosition);
    yPosition += splitMotivo.length * 5 + 5;
  }

  // ==================== FOOTER ====================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Línea superior del footer
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generado: ${new Date().toLocaleDateString('es-CR')} ${new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' })}`,
      margin,
      pageHeight - 10
    );
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  return doc;
};