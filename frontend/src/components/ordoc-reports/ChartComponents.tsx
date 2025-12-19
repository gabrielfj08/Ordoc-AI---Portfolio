'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ChartData {
  [key: string]: any;
}

interface BaseChartProps {
  data: ChartData[];
  title?: string;
  className?: string;
}

interface BarChartProps extends BaseChartProps {
  xKey: string;
  yKey: string;
  color?: string;
}

interface LineChartProps extends BaseChartProps {
  xKey: string;
  yKey: string;
  color?: string;
}

interface PieChartProps extends BaseChartProps {
  dataKey: string;
  nameKey: string;
  colors?: string[];
}

interface TableProps extends BaseChartProps {
  columns: Array<{
    key: string;
    label: string;
    format?: (value: any) => string;
  }>;
}

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
];

export function ReportBarChart({ data, title, xKey, yKey, color = '#3B82F6', className = '' }: BarChartProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Legend />
          <Bar dataKey={yKey} fill={color} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportLineChart({ data, title, xKey, yKey, color = '#3B82F6', className = '' }: LineChartProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportPieChart({ data, title, dataKey, nameKey, colors = COLORS, className = '' }: PieChartProps) {
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey={dataKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportTable({ data, title, columns, className = '' }: TableProps) {
  const formatValue = (value: any, format?: (value: any) => string) => {
    if (format) {
      return format(value);
    }
    
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    return value?.toString() || '-';
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatValue(row[column.key], column.format)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
}

// Componente para métricas/KPIs
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'positive' | 'negative' | 'neutral';
  };
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function MetricCard({ title, value, change, icon: Icon, className = '' }: MetricCardProps) {
  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive': return '↗';
      case 'negative': return '↘';
      default: return '→';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${getChangeColor(change.type)}`}>
              <span className="mr-1">{getChangeIcon(change.type)}</span>
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        )}
      </div>
    </div>
  );
}

// Componente wrapper para layout de dashboard
interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function DashboardLayout({ children, title, className = '' }: DashboardLayoutProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}

// Componente para exportar gráficos
interface ExportButtonProps {
  onExport: (format: 'png' | 'pdf' | 'svg') => void;
  className?: string;
}

export function ExportButton({ onExport, className = '' }: ExportButtonProps) {
  return (
    <div className={`relative inline-block text-left ${className}`}>
      <select
        onChange={(e) => {
          const format = e.target.value as 'png' | 'pdf' | 'svg';
          if (format) {
            onExport(format);
            e.target.value = '';
          }
        }}
        className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Exportar</option>
        <option value="png">PNG</option>
        <option value="pdf">PDF</option>
        <option value="svg">SVG</option>
      </select>
    </div>
  );
}
