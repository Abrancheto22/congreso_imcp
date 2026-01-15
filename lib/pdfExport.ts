import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Registro } from '@/types/database';

export const exportToPdf = (data: Registro[], title: string = 'Lista de Inscritos') => {
  // 1. Configurar orientación HORIZONTAL (Landscape)
  const doc = new jsPDF({ orientation: 'landscape' });

  // Título
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${new Date().toLocaleDateString('es-PE')}`, 14, 30);

  // Definir columnas (Incluyendo las nuevas vacías)
  const tableColumn = ["Nombre Completo", "Celular", "Dpto", "Iglesia", "Edad", "¿Eres cristiano?", "¿Eres bautizado?", "¿Tienes alergias?", "¿Tienes enfermedades?"];

  // Agrupar datos por departamento
  const groupedData = data.reduce((acc, reg) => {
    const dept = reg.departamento || 'Sin Departamento';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(reg);
    return acc;
  }, {} as Record<string, Registro[]>);

  // Generar tabla agrupada por departamento
  let yPosition = 40;
  
  Object.entries(groupedData).forEach(([dept, registros]) => {
    // Agregar encabezado de departamento
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(249, 115, 22); // Color naranja
    doc.text(dept, 14, yPosition);
    yPosition += 10;

    // Mapear datos de este departamento
    const tableRows = registros.map(reg => {
      return [
        reg.nombre_completo,
        reg.numero,
        reg.departamento,
        reg.iglesia,
        reg.edad,
        '', // Vacío para marcar manual
        '',  // Vacío para marcar manual
        '',  // Vacío para alergias
        ''   // Vacío para enfermedades
      ];
    });

    // Generar tabla para este departamento
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: yPosition,
      theme: 'grid',
      // 2. Color NARANJA para el encabezado
      headStyles: { 
        fillColor: [249, 115, 22], // Color Naranja Vibrante
        textColor: 255, 
        fontStyle: 'bold' 
      },
      styles: { 
        fontSize: 9, // Reducido para caber todo
        cellPadding: 3, 
        valign: 'middle' 
      },
      // Ajustamos los anchos para aprovechar la hoja horizontal
      columnStyles: {
        0: { cellWidth: 60 }, // Nombre
        1: { cellWidth: 28 }, // Celular
        2: { cellWidth: 22 }, // Dpto
        3: { cellWidth: 45 }, // Iglesia
        4: { cellWidth: 10 }, // Edad
        5: { cellWidth: 20 }, // ¿Crist?
        6: { cellWidth: 20 }, // ¿Baut?
        7: { cellWidth: 22 }, // ¿Alerg?
        8: { cellWidth: 25 }, // ¿Enfer?
      }
    });

    // Actualizar posición Y para la siguiente tabla
    yPosition = (doc as any).lastAutoTable.finalY + 15;
    
    // Agregar espacio si no es el último departamento
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 40;
    }
  });

  doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
};