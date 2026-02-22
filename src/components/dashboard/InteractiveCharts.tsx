import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

export default function InteractiveCharts() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedChart, setSelectedChart] = useState<'grades' | 'attendance' | 'submissions'>('grades');

  // Mock data
  const gradeData: ChartData[] = [
    { name: 'A (90-100)', value: 12, percentage: 30 },
    { name: 'B (80-89)', value: 18, percentage: 45 },
    { name: 'C (70-79)', value: 8, percentage: 20 },
    { name: 'D (60-69)', value: 2, percentage: 5 }
  ];

  const attendanceData: ChartData[] = [
    { name: 'Present', value: 35, percentage: 87.5 },
    { name: 'Absent', value: 3, percentage: 7.5 },
    { name: 'Late', value: 2, percentage: 5 }
  ];

  const submissionData: ChartData[] = [
    { name: 'On Time', value: 38, percentage: 95 },
    { name: 'Late', value: 2, percentage: 5 }
  ];

  const getCurrentData = () => {
    switch (selectedChart) {
      case 'attendance':
        return attendanceData;
      case 'submissions':
        return submissionData;
      default:
        return gradeData;
    }
  };

  const data = getCurrentData();
  const maxValue = Math.max(...data.map(d => d.value));

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      if (direction === 'in') {
        return Math.min(200, prev + 10);
      } else {
        return Math.max(50, prev - 10);
      }
    });
  };

  const handleExport = () => {
    alert(`Exporting ${selectedChart} chart as PNG...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Interactive Charts</h2>
        <p className="text-gray-400">Zoom, pan, and interact with real-time data visualizations</p>
      </div>

      {/* Chart Type Selection */}
      <div className="flex gap-2 flex-wrap">
        {(['grades', 'attendance', 'submissions'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedChart(type)}
            className={`px-4 py-2 rounded-lg border transition-all capitalize ${
              selectedChart === type
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-secondary-foreground/10 border-primary/20 text-gray-400 hover:text-white'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Chart Container */}
      <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-6 space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleZoom('out')}
              variant="outline"
              size="sm"
              className="border-primary/30 text-gray-300 hover:bg-primary/10"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-gray-400 text-sm min-w-12 text-center">{zoomLevel}%</span>
            <Button
              onClick={() => handleZoom('in')}
              variant="outline"
              size="sm"
              className="border-primary/30 text-gray-300 hover:bg-primary/10"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="border-primary/30 text-gray-300 hover:bg-primary/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Bar Chart */}
        <div
          className="overflow-x-auto"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
        >
          <div className="space-y-4 min-w-96">
            {data.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{item.value}</span>
                    <Badge className="bg-primary/20 text-primary border-0">{item.percentage}%</Badge>
                  </div>
                </div>
                <div className="w-full bg-primary-foreground rounded-full h-8 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-full flex items-center justify-center transition-all duration-300"
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  >
                    {(item.value / maxValue) * 100 > 15 && (
                      <span className="text-white text-xs font-semibold">{item.percentage}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Total</div>
          <div className="text-2xl font-bold text-primary mt-1">
            {data.reduce((sum, item) => sum + item.value, 0)}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Average</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Highest</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {Math.max(...data.map(d => d.value))}
          </div>
        </div>
        <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
          <div className="text-gray-400 text-sm">Lowest</div>
          <div className="text-2xl font-bold text-yellow-400 mt-1">
            {Math.min(...data.map(d => d.value))}
          </div>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="bg-secondary-foreground/10 border border-primary/20 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3">Legend</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{
                  background: `linear-gradient(to right, #FF6A00, #FF8C42)`
                }}
              />
              <span className="text-gray-300 text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Features Info */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2">Interactive Features</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>✓ Zoom in/out to see details</li>
          <li>✓ Switch between different chart types</li>
          <li>✓ Export charts as images</li>
          <li>✓ Real-time data updates</li>
          <li>✓ Responsive design</li>
        </ul>
      </div>
    </div>
  );
}
