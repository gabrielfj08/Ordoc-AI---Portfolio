'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DepartmentData {
  name: string;
  documents: number;
  color: string;
}

interface DepartmentDocumentsChartProps {
  data?: DepartmentData[];
}

const defaultData: DepartmentData[] = [
  { name: 'Recursos Humanos', documents: 85, color: '#3B82F6' },
  { name: 'Financeiro', documents: 67, color: '#10B981' },
  { name: 'Jurídico', documents: 45, color: '#F59E0B' },
  { name: 'Marketing', documents: 32, color: '#EF4444' },
  { name: 'Vendas', documents: 28, color: '#8B5CF6' },
  { name: 'TI', documents: 18, color: '#06B6D4' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{payload[0].value}</span> documentos
        </p>
      </div>
    );
  }
  return null;
};

export default function DepartmentDocumentsChart({ data = defaultData }: DepartmentDocumentsChartProps) {
  const totalDocuments = data.reduce((sum, item) => sum + item.documents, 0);

  return (
    <div className="w-full h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Documentos por Departamento</h3>
        <span className="text-sm text-gray-500">Total: {totalDocuments} documentos</span>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="documents" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        {data.slice(0, 6).map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-xs text-gray-600 truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}