import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Registro } from '@/types/database';

export const exportToPdf = (data: Registro[], title: string = 'Lista de Inscritos') => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;

  // --- 1. ENCABEZADO ESTILIZADO ---
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(title.toUpperCase(), margin, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${new Date().toLocaleDateString('es-PE')}`, margin, 28);
  
  // Línea decorativa
  doc.setDrawColor(249, 115, 22);
  doc.setLineWidth(1);
  doc.line(margin, 32, pageWidth - margin, 32);

  // Agrupar datos por departamento
  const groupedData = data.reduce((acc, reg) => {
    const dept = reg.departamento || 'Sin Departamento';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(reg);
    return acc;
  }, {} as Record<string, Registro[]>);

  let yPosition = 40;

  Object.entries(groupedData).forEach(([dept, registros], index) => {
    // Verificar si queda espacio para el título del departamento y al menos una fila
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }

    // --- 2. TÍTULO DE SECCIÓN (DEPARTAMENTO) ---
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPosition - 6, pageWidth - (margin * 2), 10, 'F');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22);
    doc.text(`Departamento: ${dept}`, margin + 2, yPosition);
    
    yPosition += 6;

    // Mapear datos
    const tableRows = registros.map((reg, i) => [
      i + 1, // Índice para mejor control
      reg.nombre_completo,
      reg.numero,
      reg.departamento,
      reg.iglesia,
      reg.edad,
    ]);

    // --- 3. TABLA OPTIMIZADA ---
    autoTable(doc, {
      head: [["#", "Nombre Completo", "Celular", "Dpto", "Iglesia", "Edad"]],
      body: tableRows,
      startY: yPosition,
      theme: 'striped',
      headStyles: { 
        fillColor: [249, 115, 22],
        textColor: 255, 
        fontSize: 11,
        fontStyle: 'bold',
        halign: 'center'
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 4, 
        valign: 'middle',
        overflow: 'linebreak'
      },
      // Expandimos las columnas para llenar los 297mm del landscape
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' }, // #
        1: { cellWidth: 85 },                   // Nombre (Más amplio)
        2: { cellWidth: 35, halign: 'center' }, // Celular
        3: { cellWidth: 35 },                   // Dpto
        4: { cellWidth: 80 },                   // Iglesia (Más amplio)
        5: { cellWidth: 20, halign: 'center' }, // Edad
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        // Pie de página: Número de página
        doc.setFontSize(8);
        doc.setTextColor(150);
        const str = `Página ${doc.getNumberOfPages()}`;
        doc.text(str, pageWidth - margin - 20, doc.internal.pageSize.height - 10);
      }
    });

    // Actualizar posición para el siguiente bloque
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  });

  doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
};