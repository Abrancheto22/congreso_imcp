import ExcelJS from 'exceljs';
import { Registro } from '@/types/database';

export const exportToExcel = async (data: Registro[], fileName: string = 'Reporte_Congreso') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inscritos');

  // Definir Columnas
  worksheet.columns = [
    { header: 'Nombre Completo', key: 'nombre', width: 35 },
    { header: 'Celular', key: 'numero', width: 15 },
    { header: 'Edad', key: 'edad', width: 8 },
    { header: 'Iglesia', key: 'iglesia', width: 25 },
    { header: 'Departamento', key: 'departamento', width: 15 },
    { header: '¿Eres cristiano?', key: 'cristiano', width: 18 },
    { header: '¿Eres bautizado?', key: 'bautizado', width: 18 },
  ];

  // Agregar Datos
  data.forEach((reg) => {
    worksheet.addRow({
      nombre: reg.nombre_completo,
      numero: reg.numero,
      edad: reg.edad,
      iglesia: reg.iglesia,
      departamento: reg.departamento,
      cristiano: '', 
      bautizado: ''  
    });
  });

  // --- ESTILOS CORREGIDOS ---

  const headerRow = worksheet.getRow(1);
  headerRow.height = 30;

  // CORRECCIÓN: Iteramos solo las celdas que existen en el encabezado
  // en lugar de pintar toda la fila infinita.
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '166534' } // Verde oscuro
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    
    // Borde blanco para separar encabezados visualmente
    cell.border = {
        right: { style: 'thin', color: { argb: 'FFFFFF' } }
    };
  });

  // Bordes para el cuerpo de la tabla
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Saltamos el encabezado que ya estilamos arriba
        row.eachCell((cell, colNumber) => {
            // Bordes negros finos
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
            
            cell.alignment = { vertical: 'middle', wrapText: true };
            
            // Alineación según tipo de dato
            const columnKey = worksheet.getColumn(colNumber).key;
            if (columnKey === 'edad' || columnKey === 'cristiano' || columnKey === 'bautizado') {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            } else {
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            }
        });
    }
  });

  // Generar y Descargar
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};