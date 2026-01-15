import ExcelJS from 'exceljs';
import { Registro } from '@/types/database';

export const exportToExcel = async (data: Registro[], fileName: string = 'Reporte_Congreso') => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inscritos');

  // Agrupar datos por departamento
  const groupedData = data.reduce((acc, reg) => {
    const dept = reg.departamento || 'Sin Departamento';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(reg);
    return acc;
  }, {} as Record<string, Registro[]>);

  // Definir Columnas
  worksheet.columns = [
    { header: 'Nombre Completo', key: 'nombre', width: 35 },
    { header: 'Celular', key: 'numero', width: 15 },
    { header: 'Edad', key: 'edad', width: 10 },
    { header: 'Iglesia', key: 'iglesia', width: 25 },
    { header: 'Departamento', key: 'departamento', width: 15 },
    { header: '¿Eres cristiano?', key: 'cristiano', width: 25 },
    { header: '¿Eres bautizado?', key: 'bautizado', width: 25 },
    { header: '¿Tienes alergias?', key: 'alergias', width: 25 },
    { header: '¿Tienes enfermedades?', key: 'enfermedades', width: 30 },
  ];

  // Agregar Datos agrupados por departamento
  let currentRow = 2;
  Object.entries(groupedData).forEach(([dept, registros]) => {
    // Agregar encabezado de departamento
    const deptRow = worksheet.getRow(currentRow);
    deptRow.getCell(1).value = dept;
    deptRow.getCell(1).font = { bold: true, color: { argb: 'FFFFFF' }, size: 14 };
    deptRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '166534' } // Verde oscuro
    };
    deptRow.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
    currentRow++;

    // Agregar registros de este departamento
    registros.forEach((reg) => {
      worksheet.addRow({
        nombre: reg.nombre_completo,
        numero: reg.numero,
        edad: reg.edad,
        iglesia: reg.iglesia,
        departamento: reg.departamento,
        cristiano: '', 
        bautizado: '',
        alergias: '',
        enfermedades: ''
      });
      currentRow++;
    });
    
    // Agregar espacio después de cada departamento
    currentRow++;
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
            if (columnKey === 'edad' || columnKey === 'cristiano' || columnKey === 'bautizado' || columnKey === 'alergias' || columnKey === 'enfermedades') {
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