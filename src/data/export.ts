import * as fs from 'fs/promises';
import * as path from 'path';
import { app, dialog } from 'electron';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BusinessData } from '../automation/engine';

export class ExportService {
  async export(format: string, data: BusinessData[]): Promise<string> {
    const defaultPath = app.getPath('downloads');
    const timestamp = new Date().toISOString().split('T')[0];
    
    let filePath: string;
    
    switch (format.toLowerCase()) {
      case 'csv':
        filePath = path.join(defaultPath, `pegasus-atlas-export-${timestamp}.csv`);
        await this.exportToCSV(data, filePath);
        break;
      
      case 'excel':
      case 'xlsx':
        filePath = path.join(defaultPath, `pegasus-atlas-export-${timestamp}.xlsx`);
        await this.exportToExcel(data, filePath);
        break;
      
      case 'json':
        filePath = path.join(defaultPath, `pegasus-atlas-export-${timestamp}.json`);
        await this.exportToJSON(data, filePath);
        break;
      
      case 'pdf':
        filePath = path.join(defaultPath, `pegasus-atlas-export-${timestamp}.pdf`);
        await this.exportToPDF(data, filePath);
        break;
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    return filePath;
  }

  private async exportToCSV(data: BusinessData[], filePath: string) {
    const headers = ['Name', 'Address', 'Phone', 'Website', 'Category', 'Timestamp'];
    const rows = data.map(item => [
      item.name,
      item.address || '',
      item.phone || '',
      item.website || '',
      item.category || '',
      new Date(item.timestamp).toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    await fs.writeFile(filePath, csvContent, 'utf-8');
  }

  private async exportToExcel(data: BusinessData[], filePath: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Business Data');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Address', key: 'address', width: 40 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Website', key: 'website', width: 40 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Timestamp', key: 'timestamp', width: 25 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    data.forEach(item => {
      worksheet.addRow({
        name: item.name,
        address: item.address || '',
        phone: item.phone || '',
        website: item.website || '',
        category: item.category || '',
        timestamp: new Date(item.timestamp).toISOString(),
      });
    });

    await workbook.xlsx.writeFile(filePath);
  }

  private async exportToJSON(data: BusinessData[], filePath: string) {
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonContent, 'utf-8');
  }

  private async exportToPDF(data: BusinessData[], filePath: string) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Pegasus Atlas - Business Data Export', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Total Records: ${data.length}`, 14, 34);

    const tableData = data.slice(0, 100).map(item => [
      item.name,
      item.address || '-',
      item.phone || '-',
      item.category || '-',
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Name', 'Address', 'Phone', 'Category']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] },
    });

    if (data.length > 100) {
      const finalY = (doc as any).lastAutoTable.finalY || 40;
      doc.setFontSize(8);
      doc.text(`Note: Only first 100 records shown. Export to Excel/CSV for full data.`, 14, finalY + 10);
    }

    await fs.writeFile(filePath, doc.output('arraybuffer'));
  }
}
