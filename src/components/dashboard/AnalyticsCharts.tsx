import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface AnalyticsChartsProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  title: string;
  dataKey: string;
  xAxisKey?: string;
  colors?: string[];
  height?: number;
}

export function AnalyticsCharts({
  type,
  data,
  title,
  dataKey,
  xAxisKey = 'name',
  colors = ['#FF6A00', '#FFB366', '#FF8C42'],
  height = 300
}: AnalyticsChartsProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    return data;
  }, [data]);

  if (chartData.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 p-8 text-center">
        <p className="text-gray-400">No data available for {title}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 p-6">
      <h3 className="text-lg font-heading font-bold text-foreground mb-6">{title}</h3>

      <ResponsiveContainer width="100%" height={height}>
        {type === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey={xAxisKey} stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #404040',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#FFF' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={2}
              dot={{ fill: colors[0], r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : type === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis dataKey={xAxisKey} stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #404040',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#FFF' }}
            />
            <Legend />
            <Bar dataKey={dataKey} fill={colors[0]} radius={[8, 8, 0, 0]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              dataKey={dataKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #404040',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#FFF' }}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}

/**
 * Pre-built chart components for common analytics
 */

export function UserGrowthChart({ data }: { data: any[] }) {
  return (
    <AnalyticsCharts
      type="line"
      data={data}
      title="User Growth"
      dataKey="count"
      xAxisKey="month"
      height={300}
    />
  );
}

export function EnrollmentChart({ data }: { data: any[] }) {
  return (
    <AnalyticsCharts
      type="bar"
      data={data}
      title="Course Enrollments"
      dataKey="enrollments"
      xAxisKey="course"
      height={300}
    />
  );
}

export function AttendanceChart({ data }: { data: any[] }) {
  return (
    <AnalyticsCharts
      type="pie"
      data={data}
      title="Meeting Attendance"
      dataKey="count"
      xAxisKey="status"
      colors={['#FF6A00', '#FFB366', '#FF8C42']}
      height={300}
    />
  );
}

export function ProgressChart({ data }: { data: any[] }) {
  return (
    <AnalyticsCharts
      type="bar"
      data={data}
      title="Student Progress"
      dataKey="progress"
      xAxisKey="student"
      height={300}
    />
  );
}
