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
  const tableColumn = ["Nombre Completo", "Celular", "Dpto", "Iglesia", "Edad", "¿Crist?", "¿Baut?"];

  // Mapear datos
  const tableRows = data.map(reg => {
    return [
      reg.nombre_completo,
      reg.numero,
      reg.departamento,
      reg.iglesia,
      reg.edad,
      '', // Vacío para marcar manual
      ''  // Vacío para marcar manual
    ];
  });

  // Generar tabla
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    // 2. Color NARANJA para el encabezado
    headStyles: { 
      fillColor: [249, 115, 22], // Color Naranja Vibrante
      textColor: 255, 
      fontStyle: 'bold' 
    },
    styles: { 
      fontSize: 10, // Aumenté un poco la letra ya que hay más espacio horizontal
      cellPadding: 4, 
      valign: 'middle' 
    },
    // Ajustamos los anchos para aprovechar la hoja horizontal
    columnStyles: {
      0: { cellWidth: 70 }, // Nombre (Más espacio)
      1: { cellWidth: 35 }, // Celular
      2: { cellWidth: 35 }, // Dpto
      3: { cellWidth: 60 }, // Iglesia (Más espacio)
      4: { cellWidth: 15 }, // Edad
      5: { cellWidth: 25 }, // ¿Crist?
      6: { cellWidth: 25 }, // ¿Baut?
    }
  });

  doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
};