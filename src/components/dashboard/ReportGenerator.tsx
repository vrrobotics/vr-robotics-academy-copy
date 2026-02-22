import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, File } from 'lucide-react';

type ReportType = 'batch' | 'student' | 'system';
type ExportFormat = 'pdf' | 'csv' | 'excel';

interface ReportGeneratorProps {
  onGenerateReport?: (type: ReportType, format: ExportFormat) => void;
}

export default function ReportGenerator({ onGenerateReport }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<ReportType>('batch');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('pdf');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data
  const batches = [
    { id: 'batch-1', name: 'Batch A - Level 1' },
    { id: 'batch-2', name: 'Batch B - Level 2' },
    { id: 'batch-3', name: 'Batch C - Level 3' }
  ];

  const students = [
    { id: 'student-1', name: 'Alice Johnson' },
    { id: 'student-2', name: 'Bob Smith' },
    { id: 'student-3', name: 'Carol Davis' }
  ];

  const handleGenerateReport = async () => {
    if (reportType === 'batch' && !selectedBatch) {
      alert('Please select a batch');
      return;
    }
    if (reportType === 'student' && !selectedStudent) {
      alert('Please select a student');
      return;
    }

    try {
      setIsGenerating(true);
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onGenerateReport?.(reportType, exportFormat);
      
      // Simulate download
      const filename = `${reportType}-report-${Date.now()}.${exportFormat === 'pdf' ? 'pdf' : exportFormat === 'excel' ? 'xlsx' : 'csv'}`;
      console.log(`Report generated: ${filename}`);
      alert(`Report generated successfully: ${filename}`);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Report Generator</h2>
        <p className="text-gray-400">Generate and export reports in multiple formats</p>
      </div>

      {/* Report Type Selection */}
      <div className="space-y-3">
        <label className="text-gray-400 text-sm">Report Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['batch', 'student', 'system'] as ReportType[]).map((type) => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`p-4 rounded-lg border transition-all text-left ${
                reportType === type
                  ? 'bg-primary/20 border-primary'
                  : 'bg-secondary-foreground/10 border-primary/20 hover:bg-secondary-foreground/20'
              }`}
            >
              <div className="font-semibold text-white capitalize">{type} Report</div>
              <div className="text-gray-400 text-sm mt-1">
                {type === 'batch' && 'Class-level analytics'}
                {type === 'student' && 'Individual performance'}
                {type === 'system' && 'System-wide metrics'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Batch Selection */}
      {reportType === 'batch' && (
        <div className="space-y-3">
          <label className="text-gray-400 text-sm">Select Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-4 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
          >
            <option value="">Choose a batch...</option>
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Student Selection */}
      {reportType === 'student' && (
        <div className="space-y-3">
          <label className="text-gray-400 text-sm">Select Student</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-4 py-2 bg-secondary-foreground/10 border border-primary/20 text-white rounded-md"
          >
            <option value="">Choose a student...</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Export Format Selection */}
      <div className="space-y-3">
        <label className="text-gray-400 text-sm">Export Format</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['pdf', 'csv', 'excel'] as ExportFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`p-4 rounded-lg border transition-all text-left ${
                exportFormat === format
                  ? 'bg-primary/20 border-primary'
                  : 'bg-secondary-foreground/10 border-primary/20 hover:bg-secondary-foreground/20'
              }`}
            >
              <div className="flex items-center gap-2">
                {format === 'pdf' ? (
                  <FileText className="w-5 h-5 text-red-400" />
                ) : (
                  <File className="w-5 h-5 text-blue-400" />
                )}
                <div>
                  <div className="font-semibold text-white uppercase">{format}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {format === 'pdf' && 'Formatted document'}
                    {format === 'csv' && 'Spreadsheet data'}
                    {format === 'excel' && 'Excel workbook'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Report Preview */}
      <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Report Summary</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Report Type</span>
            <Badge className="bg-primary/20 text-primary border-0 capitalize">{reportType}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Export Format</span>
            <Badge className="bg-blue-500/20 text-blue-400 border-0 uppercase">{exportFormat}</Badge>
          </div>
          {reportType === 'batch' && selectedBatch && (
            <div className="flex justify-between">
              <span className="text-gray-400">Selected Batch</span>
              <span className="text-white">
                {batches.find(b => b.id === selectedBatch)?.name}
              </span>
            </div>
          )}
          {reportType === 'student' && selectedStudent && (
            <div className="flex justify-between">
              <span className="text-gray-400">Selected Student</span>
              <span className="text-white">
                {students.find(s => s.id === selectedStudent)?.name}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Generated At</span>
            <span className="text-white">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
      >
        <Download className="w-5 h-5 mr-2" />
        {isGenerating ? 'Generating Report...' : 'Generate & Download Report'}
      </Button>

      {/* Recent Reports */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
        <div className="space-y-2">
          {[
            { name: 'Batch A Report', date: '2024-12-08', format: 'pdf' },
            { name: 'Student Performance', date: '2024-12-07', format: 'excel' },
            { name: 'System Analytics', date: '2024-12-06', format: 'csv' }
          ].map((report, index) => (
            <div
              key={index}
              className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-white font-medium">{report.name}</div>
                <div className="text-gray-400 text-sm">{report.date}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-0 uppercase text-xs">
                  {report.format}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-gray-300 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
