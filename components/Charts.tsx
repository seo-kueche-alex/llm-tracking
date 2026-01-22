
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { LLMMentionItem } from '../types';

interface ChartsProps {
  items: LLMMentionItem[];
}

export const VisibilityChart: React.FC<ChartsProps> = ({ items }) => {
  const data = items.map(item => ({
    name: item.keyword.length > 20 ? item.keyword.substring(0, 20) + '...' : item.keyword,
    volume: item.search_volume,
  }));

  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            height={70} 
            tick={{fontSize: 12}}
          />
          <YAxis />
          <Tooltip 
             contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SentimentPie: React.FC<ChartsProps> = ({ items }) => {
  const sentimentCounts = items.reduce((acc: any, item) => {
    const s = item.sentiment || 'neutral';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const data = [
    { name: 'Positive', value: sentimentCounts.positive || 0, color: '#10b981' },
    { name: 'Neutral', value: sentimentCounts.neutral || 0, color: '#94a3b8' },
    { name: 'Negative', value: sentimentCounts.negative || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
