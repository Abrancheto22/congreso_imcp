import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Registro } from '@/types/database';

export const exportToPdf = (data: Registro[], title: string = 'Lista de Inscritos') => {
  const doc = new jsPDF();

  // 1. Título del Documento
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fecha de reporte: ${new Date().toLocaleDateString('es-PE')}`, 14, 30);

  // 2. Definir las columnas
  const tableColumn = ["Fecha", "Nombre", "Celular", "Estado", "Ubicación", "Iglesia", "Edad"];

  // 3. Mapear los datos (Filas)
  const tableRows = data.map(reg => {
    const fecha = new Date(reg.created_at).toLocaleDateString('es-PE');
    // Combinamos ubicación para ahorrar espacio
    const ubicacion = `${reg.departamento}\n${reg.ciudad || ''}`;
    
    return [
      fecha,
      reg.nombre_completo,
      reg.numero,
      reg.estado || 'Pendiente',
      ubicacion,
      reg.iglesia,
      reg.edad
    ];
  });

  // 4. Generar la tabla
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74] }, // Color verde (puedes cambiarlo a [41, 37, 36] para gris oscuro)
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 20 }, // Fecha
      1: { cellWidth: 40 }, // Nombre
      2: { cellWidth: 25 }, // Celular
      3: { cellWidth: 20 }, // Estado
      4: { cellWidth: 30 }, // Ubicación
      5: { cellWidth: 35 }, // Iglesia
      6: { cellWidth: 10 }, // Edad
    }
  });

  // 5. Guardar archivo
  doc.save(`${title}_${new Date().toISOString().split('T')[0]}.pdf`);
};