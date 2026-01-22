
import React from 'react';

interface MetricsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        {trend && (
          <div className={`mt-2 text-sm flex items-center ${trend.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span>{trend.isUp ? '↑' : '↓'} {trend.value}%</span>
            <span className="text-slate-400 ml-1">vs last month</span>
          </div>
        )}
      </div>
      <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
        {icon}
      </div>
    </div>
  );
};
