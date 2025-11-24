'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ActivityData {
  date: string;
  logins: number;
  documents: number;
  tasks: number;
}

interface UserActivityChartProps {
  data?: ActivityData[];
  period?: 'week' | 'month' | 'quarter';
}

const defaultData: ActivityData[] = [
  { date: '01/01', logins: 12, documents: 8, tasks: 15 },
  { date: '02/01', logins: 19, documents: 12, tasks: 22 },
  { date: '03/01', logins: 15, documents: 10, tasks: 18 },
  { date: '04/01', logins: 25, documents: 18, tasks: 28 },
  { date: '05/01', logins: 22, documents: 15, tasks: 25 },
  { date: '06/01', logins: 30, documents: 22, tasks: 35 },
  { date: '07/01', logins: 28, documents: 20, tasks: 32 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            <span className="font-medium">{entry.name}:</span> {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function UserActivityChart({ 
  data = defaultData, 
  period = 'week' 
}: UserActivityChartProps) {
  const periodLabels = {
    week: 'Últimos 7 dias',
    month: 'Último mês',
    quarter: 'Último trimestre'
  };

  return (
    <div className="w-full h-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Atividade dos Usuários</h3>
        <span className="text-sm text-gray-500">{periodLabels[period]}</span>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="logins"
            stackId="1"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
            name="Logins"
          />
          <Area
            type="monotone"
            dataKey="documents"
            stackId="1"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.6}
            name="Documentos"
          />
          <Area
            type="monotone"
            dataKey="tasks"
            stackId="1"
            stroke="#F59E0B"
            fill="#F59E0B"
            fillOpacity={0.6}
            name="Tarefas"
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Logins</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Documentos</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Tarefas</span>
        </div>
      </div>
    </div>
  );
}