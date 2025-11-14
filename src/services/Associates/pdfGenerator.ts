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
  let yPosition = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // ==================== COLORES SIMPLES ====================
  const colors = {
    primary: [40, 40, 40] as [number, number, number],        // Negro suave para texto
    secondary: [100, 100, 100] as [number, number, number],   // Gris para subtítulos
    border: [200, 200, 200] as [number, number, number],      // Gris claro para bordes
    headerBg: [245, 245, 245] as [number, number, number],    // Gris muy claro para fondos
  };

  // ==================== LOGO COMO MARCA DE AGUA ====================
  const logoUrl = '/mnt/user-data/uploads/1763096419506_image.png';
  
  const addWatermark = () => {
    try {
      // Cargar y agregar logo como marca de agua centrada
      const img = new Image();
      img.src = logoUrl;
      
      // Tamaño y posición del logo (centrado y grande pero sutil)
      const logoWidth = 80;
      const logoHeight = 70;
      const xPos = (pageWidth - logoWidth) / 2;
      const yPos = (pageHeight - logoHeight) / 2;
      
      // Agregar con opacidad reducida para que sea marca de agua
      doc.addImage(img, 'PNG', xPos, yPos, logoWidth, logoHeight, undefined, 'NONE');
      doc.setGState(new (doc.GState as any)({ opacity: 0.1 })); // Opacidad al 10%
    } catch (error) {
      console.warn('No se pudo cargar el logo:', error);
    }
  };

  // ==================== FUNCIONES AUXILIARES ====================
  const checkPageBreak = (neededSpace: number = 30) => {
    if (yPosition + neededSpace > pageHeight - 30) {
      doc.addPage();
      addWatermark(); // Agregar marca de agua en cada página nueva
      yPosition = 20;
      return true;
    }
    return false;
  };

  const addSection = (title: string, _addNumber: boolean = true) => {
    checkPageBreak(20);
    
    // Línea superior
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;
    
    // Título de sección
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text(title, margin, yPosition);
    
    yPosition += 8;
  };

  const addSubsection = (title: string) => {
    checkPageBreak(15);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.secondary);
    doc.text(title, margin, yPosition);
    yPosition += 6;
  };

  const addField = (label: string, value: string, fullWidth: boolean = false) => {
    checkPageBreak(10);
    const valueWidth = fullWidth ? pageWidth - margin * 2 - 10 : (pageWidth - margin * 2) / 2 - 10;
    
    // Label
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.secondary);
    doc.text(label + ':', margin, yPosition);
    
    // Value
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.primary);
    const splitValue = doc.splitTextToSize(value, valueWidth);
    doc.text(splitValue, margin, yPosition + 4);
    
    yPosition += 4 + (splitValue.length * 4) + 3;
  };

  const addFieldRow = (fields: Array<{ label: string; value: string }>) => {
    checkPageBreak(12);
    const fieldWidth = (pageWidth - margin * 2) / fields.length;
    let xPos = margin;
    
    fields.forEach((field) => {
      // Label
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.secondary);
      doc.text(field.label + ':', xPos, yPosition);
      
      // Value
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.primary);
      const splitValue = doc.splitTextToSize(field.value, fieldWidth - 5);
      doc.text(splitValue, xPos, yPosition + 4);
      
      xPos += fieldWidth;
    });
    
    yPosition += 12;
  };

  const addList = (items: string[]) => {
    if (!items || items.length === 0) return;
    
    items.forEach((item) => {
      checkPageBreak(6);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.primary);
      
      // Bullet point simple
      doc.text('-', margin + 2, yPosition);
      const splitText = doc.splitTextToSize(item, pageWidth - margin * 2 - 8);
      doc.text(splitText, margin + 6, yPosition);
      
      yPosition += splitText.length * 4 + 2;
    });
  };

  const addTable = (data: any[][], headers: string[]) => {
    checkPageBreak(30);
    
    autoTable(doc, {
      startY: yPosition,
      head: [headers],
      body: data,
      theme: 'grid',
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        lineColor: colors.border,
        lineWidth: 0.3,
        textColor: colors.primary,
      },
      headStyles: {
        fillColor: colors.headerBg,
        textColor: colors.primary,
        fontStyle: 'bold',
        halign: 'left',
      },
      margin: { left: margin, right: margin },
    });

    yPosition = doc.lastAutoTable.finalY + 8;
  };

  // ==================== AGREGAR MARCA DE AGUA EN PRIMERA PÁGINA ====================
  addWatermark();

  // ==================== ENCABEZADO CON LOGO ====================
  // Logo en esquina superior izquierda
  try {
    const img = new Image();
    img.src = logoUrl;
    doc.addImage(img, 'PNG', margin, 10, 25, 22);
  } catch (error) {
    console.warn('No se pudo cargar el logo en el header:', error);
  }

  // Texto del encabezado
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text('CAMARA DE GANADEROS', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Diagnostico de Finca', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 4;
  doc.setFontSize(9);
  doc.setTextColor(...colors.secondary);
  doc.text('Hojancha, Costa Rica', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  
  // Línea separadora
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Info del documento
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.secondary);
  doc.text(`Estado: ${solicitud.estado}`, margin, yPosition);
  doc.text(`Fecha: ${new Date(solicitud.createdAt).toLocaleDateString('es-CR')}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 10;

  // ==================== 1. INFORMACION DEL PRODUCTOR ====================
  addSection('1. INFORMACION DEL PRODUCTOR');

  addFieldRow([
    { label: 'Nombre completo', value: `${solicitud.persona.nombre} ${solicitud.persona.apellido1} ${solicitud.persona.apellido2}` },
    { label: 'Cedula', value: solicitud.persona.cedula },
  ]);

  addFieldRow([
    { label: 'Fecha de nacimiento', value: new Date(solicitud.persona.fechaNacimiento).toLocaleDateString('es-CR') },
    { label: 'Telefono', value: solicitud.persona.telefono },
  ]);

  addField('Correo electronico', solicitud.persona.email);
  addField('Direccion', solicitud.persona.direccion || 'No especificada', true);

  // Núcleo familiar
  if (associate?.nucleoFamiliar) {
    yPosition += 4;
    addSubsection('Nucleo Familiar');
    
    addTable(
      [[
        associate.nucleoFamiliar.nucleoHombres.toString(),
        associate.nucleoFamiliar.nucleoMujeres.toString(),
        associate.nucleoFamiliar.nucleoTotal.toString(),
      ]],
      ['Hombres', 'Mujeres', 'Total']
    );
  }

  addFieldRow([
    { label: 'Vive en la finca', value: associate?.viveEnFinca ? 'Si' : 'No' },
    { label: 'CVO', value: associate?.CVO || 'No especificado' },
  ]);

  addField('Marca de ganado', associate?.marcaGanado || 'No especificada');

  // ==================== 2. INFORMACION DE LA FINCA ====================
  if (fincas && fincas.length > 0) {
    fincas.forEach((finca: any, index: number) => {
      yPosition += 4;
      addSection(`2. INFORMACION DE LA FINCA${fincas.length > 1 ? ` ${index + 1}` : ''}`);

      addFieldRow([
        { label: 'Nombre de la finca', value: finca.nombre || 'Sin nombre' },
        { label: 'Area (hectareas)', value: finca.areaHa?.toString() || '0' },
      ]);

      addFieldRow([
        { label: 'Numero de plano', value: finca.numeroPlano || 'No especificado' },
        { label: 'Propietario', value: finca.propietario?.persona ? `${finca.propietario.persona.nombre} ${finca.propietario.persona.apellido1}` : 'El asociado' },
      ]);

      // Localización
      if (finca.geografia) {
        yPosition += 3;
        addSubsection('Localizacion');
        addFieldRow([
          { label: 'Provincia', value: finca.geografia.provincia },
          { label: 'Canton', value: finca.geografia.canton },
        ]);
        addFieldRow([
          { label: 'Distrito', value: finca.geografia.distrito },
          { label: 'Caserio', value: finca.geografia.caserio || 'No especificado' },
        ]);
      }

      // Forrajes
      if (finca.forrajes && finca.forrajes.length > 0) {
        yPosition += 4;
        addSubsection('Forrajes');

        const forrajeData = finca.forrajes.map((f: any) => [
          f.tipoForraje || 'No especificado',
          f.variedad || 'No especificada',
          f.hectareas?.toString() || '0',
          f.utilizacion || 'No especificada',
        ]);

        addTable(forrajeData, ['Tipo de forraje', 'Variedad', 'Hectareas', 'Utilizacion']);
      }

      // ==================== 3. DESCRIPCION DEL HATO ====================
      if (finca.hato) {
        yPosition += 4;
        addSection('3. DESCRIPCION DEL HATO');

        addFieldRow([
          { label: 'Tipo de explotacion', value: finca.hato.tipoExplotacion || 'No especificado' },
          { label: 'Total del hato', value: finca.hato.totalGanado?.toString() || '0' },
        ]);

        addField('Raza predominante', finca.hato.razaPredominante || 'No especificada');

        if (finca.hato.animales && finca.hato.animales.length > 0) {
          yPosition += 4;
          addSubsection('Distribucion del ganado');

          const animalData = finca.hato.animales.map((a: any) => [
            a.nombre || 'No especificado',
            a.edad || 'No especificada',
            a.cantidad?.toString() || '0',
          ]);

          addTable(animalData, ['Categoria', 'Edad aproximada', 'Cantidad']);
        }
      }

      // ==================== 4. REGISTROS ====================
      if (finca.registrosProductivos) {
        yPosition += 4;
        addSection('4. REGISTROS PRODUCTIVOS');
        
        const registros: string[] = [];
        if (finca.registrosProductivos.reproductivos) registros.push('Reproductivos en bovinos');
        if (finca.registrosProductivos.costosProductivos) registros.push('Costos de produccion');
        if (registros.length === 0) registros.push('No lleva registros');
        
        addList(registros);
      }

      // ==================== 5. FUENTES DE AGUA ====================
      if (finca.fuentesAgua && finca.fuentesAgua.length > 0) {
        yPosition += 4;
        addSection('5. FUENTES DE AGUA');
        addList(finca.fuentesAgua.map((f: any) => f.nombre));
      }

      // ==================== 6. OTRAS ACTIVIDADES ====================
      if (finca.actividades && finca.actividades.length > 0) {
        yPosition += 4;
        addSection('6. OTRAS ACTIVIDADES AGROPECUARIAS');
        addList(finca.actividades.map((a: any) => a.nombre));
      }

      // ==================== 7. INFRAESTRUCTURA ====================
      yPosition += 4;
      addSection('7. INFRAESTRUCTURA');

      if (finca.infraestructura) {
        addFieldRow([
          { label: 'Numero de apartos', value: finca.infraestructura.numeroAparatos?.toString() || '0' },
          { label: 'Numero de bebederos', value: finca.infraestructura.numeroBebederos?.toString() || '0' },
        ]);
        addField('Numero de saladeros', finca.infraestructura.numeroSaleros?.toString() || '0');
      }

      if (finca.tiposCerca && finca.tiposCerca.length > 0) {
        yPosition += 3;
        addSubsection('Tipos de cerca');
        const cercas: string[] = [];
        finca.tiposCerca.forEach((tc: any) => {
          if (tc.tipoCerca?.viva) cercas.push('Viva');
          if (tc.tipoCerca?.electrica) cercas.push('Electrica');
          if (tc.tipoCerca?.pMuerto) cercas.push('Poste muerto');
        });
        if (cercas.length > 0) addList(cercas);
      }

      if (finca.infraestructuras && finca.infraestructuras.length > 0) {
        yPosition += 3;
        addSubsection('Instalaciones');
        const infraList = finca.infraestructuras.map((i: any) => i.infraestructura?.nombre || 'No especificada');
        addList(infraList);
      }

      // ==================== 8. RIEGO ====================
      if (finca.metodosRiego && finca.metodosRiego.length > 0) {
        yPosition += 4;
        addSection('8. SISTEMAS DE RIEGO');
        addList(finca.metodosRiego.map((m: any) => m.nombre));
      }

      // ==================== 9. VIAS DE ACCESO ====================
      if (finca.accesos && finca.accesos.length > 0) {
        yPosition += 4;
        addSection('9. VIAS DE ACCESO');
        addList(finca.accesos.map((a: any) => a.nombre));
      }

      // ==================== 10. CORRIENTE ELECTRICA ====================
      if (finca.corriente) {
        yPosition += 4;
        addSection('10. CORRIENTE ELECTRICA');
        const corrientes: string[] = [];
        if (finca.corriente.publica) corrientes.push('Red publica');
        if (finca.corriente.privada) corrientes.push('Generacion privada');
        if (corrientes.length === 0) corrientes.push('Sin suministro electrico');
        addList(corrientes);
      }

      // ==================== 11. OTROS EQUIPOS ====================
      if (finca.otrosEquipos && finca.otrosEquipos.length > 0) {
        yPosition += 4;
        addSection('11. EQUIPAMIENTO');
        addList(finca.otrosEquipos.map((e: any) => e.nombreEquipo));
      }

      // ==================== 12. COMERCIALIZACION ====================
      if (finca.canales && finca.canales.length > 0) {
        yPosition += 4;
        addSection('12. COMERCIALIZACION');
        addList(finca.canales.map((c: any) => c.nombre));
      }
    });
  }

  // ==================== 13. NECESIDADES ====================
  if (associate?.necesidades && associate.necesidades.length > 0) {
    yPosition += 4;
    addSection('13. NECESIDADES Y MEJORAS');
    
    associate.necesidades.slice(0, 5).forEach((nec: any, idx: number) => {
      checkPageBreak(10);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...colors.primary);
      const splitText = doc.splitTextToSize(`${idx + 1}. ${nec.descripcion}`, pageWidth - margin * 2 - 5);
      doc.text(splitText, margin + 2, yPosition);
      yPosition += splitText.length * 4 + 3;
    });
  }

  // ==================== MOTIVO DE RECHAZO ====================
  if (solicitud.estado === 'RECHAZADO' && solicitud.motivo) {
    yPosition += 6;
    checkPageBreak(25);
    
    addSection('MOTIVO DE RECHAZO', false);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.primary);
    const splitMotivo = doc.splitTextToSize(solicitud.motivo, pageWidth - margin * 2);
    doc.text(splitMotivo, margin, yPosition);
    yPosition += splitMotivo.length * 5 + 5;
  }

  // ==================== PIE DE PAGINA ====================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Línea superior
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Información
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.secondary);
    
    doc.text(
      `Generado: ${new Date().toLocaleDateString('es-CR')}`,
      margin,
      pageHeight - 10
    );
    
    doc.text(
      `Pagina ${i} de ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  return doc;
};