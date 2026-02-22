/**
 * Excel Export Service
 * Exports demo bookings and student data to Excel files
 * Auto-updates personal Excel file for admin use
 */

interface ExcelConfig {
  fileName: string;
  sheetName: string;
  columns: Array<{
    key: string;
    header: string;
    width?: number;
  }>;
}

export class ExcelExportService {
  /**
   * Format demo sessions for Excel export
   */
  static formatDemoSessionsForExcel(sessions: any[]) {
    return sessions.map(session => ({
      "Date Registered": session.created_at ? new Date(session.created_at).toLocaleDateString() : 'N/A',
      "Parent Name": session.parent_name || 'N/A',
      "Parent Email": session.student_email || 'N/A',
      "Parent Phone": session.parent_phone || 'N/A',
      "Student Name": session.student_name || 'N/A',
      "Student Age": session.student_age || 'N/A',
      "Preferred Date": session.scheduled_date ? new Date(session.scheduled_date).toLocaleDateString() : 'N/A',
      "Preferred Time": session.preferred_time || 'N/A',
      "Interests": session.interests || 'N/A',
      "Message": session.message || 'N/A',
      "Status": session.status || 'pending',
      "Booking ID": session.id ? session.id.substring(0, 8) : 'N/A'
    }));
  }

  /**
   * Create CSV format (compatible with all spreadsheet apps)
   * Since we can't use xlsx in browser, we'll use CSV as fallback
   */
  static createCSVFromData(data: any[], fileName: string): string {
    if (data.length === 0) return '';

    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV header row
    const csvHeader = headers.map(h => `"${h}"`).join(',');
    
    // Create CSV data rows
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header] || '';
        // Escape quotes in values
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',');
    });

    return [csvHeader, ...csvRows].join('\n');
  }

  /**
   * Download Excel file as CSV (works in all browsers)
   */
  static downloadAsCSV(data: any[], fileName: string) {
    const csv = this.createCSVFromData(data, fileName);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`✓ Excel export downloaded: ${fileName}.csv`);
  }

  /**
   * Export demo sessions to downloadable Excel file
   */
  static async exportDemoSessions(sessions: any[]) {
    try {
      console.log(`[ExcelExport] Exporting ${sessions.length} demo sessions...`);
      
      const formattedData = this.formatDemoSessionsForExcel(sessions);
      const fileName = `Demo-Bookings-${new Date().toISOString().split('T')[0]}`;
      
      this.downloadAsCSV(formattedData, fileName);
      
      return {
        success: true,
        message: `Exported ${sessions.length} demo bookings`,
        fileName
      };
    } catch (error) {
      console.error('[ExcelExport] Error exporting demo sessions:', error);
      return {
        success: false,
        error: 'Failed to export demo sessions',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create auto-save data in localStorage
   * Can be manually synced to Excel via import
   */
  static saveToLocalStorage(sessions: any[]) {
    try {
      const data = {
        lastUpdated: new Date().toISOString(),
        sessions: this.formatDemoSessionsForExcel(sessions),
        count: sessions.length
      };
      
      localStorage.setItem('demoBookingsBackup', JSON.stringify(data));
      console.log(`✓ Saved ${sessions.length} demo bookings to local storage`);
      
      return true;
    } catch (error) {
      console.error('[ExcelExport] Error saving to localStorage:', error);
      return false;
    }
  }

  /**
   * Get JSON format for manual Excel import
   */
  static getJSONForExcelImport(sessions: any[]) {
    return JSON.stringify(this.formatDemoSessionsForExcel(sessions), null, 2);
  }

  /**
   * Generate Excel import instruction
   */
  static getExcelImportInstructions(): string {
    return `
INSTRUCTIONS TO IMPORT DATA INTO EXCEL:

1. Download the CSV file exported by this system
2. Open Microsoft Excel
3. Go to "File" > "Open" or "Insert" > "From Text"
4. Select the CSV file
5. Accept the import settings (comma-separated, UTF-8)
6. Data will be auto-populated in Excel

For automatic updates:
- Export the file regularly (daily recommended)
- Import into your Excel workbook using "Refresh" or manual reimport

The CSV file is compatible with:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Apple Numbers
- Any spreadsheet application
    `;
  }
}
