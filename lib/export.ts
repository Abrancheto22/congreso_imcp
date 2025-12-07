import * as XLSX from 'xlsx';
import { Registro } from '@/types/database';

export const exportToExcel = (data: Registro[], fileName: string = 'Reporte_Congreso') => {
  const excelData = data.map((reg) => ({
    'Fecha Registro': new Date(reg.created_at).toLocaleDateString('es-PE') + ' ' + new Date(reg.created_at).toLocaleTimeString('es-PE'),
    'Estado': reg.estado || 'Pendiente',
    'Nombre Completo': reg.nombre_completo,
    'Celular': reg.numero,
    'Edad': reg.edad,
    'Iglesia': reg.iglesia,
    'Departamento': reg.departamento,
    // --- COLUMNAS VACÍAS PARA LLENAR A MANO ---
    'Provincia': '', 
    'Ciudad': '',    
    // ------------------------------------------
    // AQUÍ ESTÁ LA CORRECCIÓN:
    'Voucher (Link)': Array.isArray(reg.voucher_url) 
        ? (reg.voucher_url[0] || '') 
        : (reg.voucher_url || '')
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const columnWidths = [
    { wch: 20 },
    { wch: 15 },
    { wch: 30 },
    { wch: 15 },
    { wch: 5 },
    { wch: 25 },
    { wch: 15 },
    { wch: 20 },
    { wch: 20 },
    { wch: 50 },
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inscritos");

  XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};