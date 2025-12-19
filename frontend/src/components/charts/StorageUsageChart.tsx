'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StorageData {
  name: string;
  value: number;
  color: string;
  size: string;
}

interface StorageUsageChartProps {
  data?: StorageData[];
  totalStorage?: number;
  usedStorage?: number;
}

const defaultData: StorageData[] = [
  { name: 'OrdocAir', value: 45, color: '#3B82F6', size: '1.2 GB' },
  { name: 'OrdocFlow', value: 30, color: '#10B981', size: '0.8 GB' },
  { name: 'OrdocSign', value: 15, color: '#F59E0B', size: '0.3 GB' },
  { name: 'OrdocReports', value: 10, color: '#EF4444', size: '0.1 GB' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{data.value}%</span> ({data.size})
        </p>
      </div>
    );
  }
  return null;
};

export default function StorageUsageChart({ 
  data = defaultData, 
  totalStorage = 100, 
  usedStorage = 2.4 
}: StorageUsageChartProps) {
  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="w-full h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Uso de Armazenamento</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Usado: {usedStorage} GB de {totalStorage} GB</p>
          <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">{usagePercentage.toFixed(1)}% usado</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => (
              <span style={{ color: entry.color }} className="text-sm font-medium">
                {value} ({entry.payload.size})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}