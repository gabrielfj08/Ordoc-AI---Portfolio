"use client";

import React from "react";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface KPICardProps {
    title: string;
    value: string | number;
    change: number;
    icon: LucideIcon;
    color: string;
    trend?: number[];
}

export function KPICard({ title, value, change, icon: Icon, color, trend }: KPICardProps) {
    const isPositive = change >= 0;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
                    <Icon size={24} className={color} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(change)}%
                </div>
            </div>

            <div>
                <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
                <p className="text-3xl font-bold text-slate-800">{value}</p>
            </div>

            {/* Sparkline */}
            {trend && trend.length > 0 && (
                <div className="mt-4 h-8 flex items-end gap-0.5">
                    {trend.map((val, i) => (
                        <div
                            key={i}
                            className={`flex-1 ${color} bg-opacity-20 rounded-t`}
                            style={{ height: `${(val / Math.max(...trend)) * 100}%` }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
