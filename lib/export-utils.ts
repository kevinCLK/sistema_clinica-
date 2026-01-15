import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Tipos para las columnas de exportación
export interface ExportColumn {
    header: string;
    key: string;
}

// Función genérica para exportar a Excel
export const exportToExcel = (data: any[], columns: ExportColumn[], fileName: string) => {
    // 1. Preparar los datos para Excel (mapear keys a headers)
    const exportData = data.map(item => {
        const row: Record<string, any> = {};
        columns.forEach(col => {
            // Manejar propiedades anidadas (ej. user.name)
            const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
            row[col.header] = value;
        });
        return row;
    });

    // 2. Crear hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // 3. Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // 4. Escribir archivo
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

// Función genérica para exportar a PDF
export const exportToPDF = (data: any[], columns: ExportColumn[], title: string, fileName: string) => {
    const doc = new jsPDF();

    // 1. Configurar título
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

    // 2. Preparar columnas y filas para autoTable
    const tableHeaders = columns.map(col => col.header);
    const tableData = data.map(item => {
        return columns.map(col => {
            const value = col.key.split('.').reduce((obj, key) => obj?.[key], item);
            return value === null || value === undefined ? '' : String(value);
        });
    });

    // 3. Generar tabla
    autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 133, 244] } // Color azul de Google/Medical
    });

    // 4. Guardar archivo
    doc.save(`${fileName}.pdf`);
};
