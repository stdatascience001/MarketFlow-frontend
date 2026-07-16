import React from 'react';
import type { SectorData } from '../../types';
import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SectorsChartProps {
  data: SectorData[];
}

export const SectorsChart: React.FC<SectorsChartProps> = ({ data }) => {
  return (
    <Card className="flex flex-col bg-[var(--bg-secondary)] border-[var(--border-color)] p-4 h-full">
      <h3 className="text-sm font-semibold text-[var(--text-color)] mb-4">Sectors</h3>
      
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between w-full h-full">
        <div className="h-40 w-40 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-color)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
                itemStyle={{ color: 'var(--text-color)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col justify-center space-y-2 mt-4 md:mt-0 w-full md:w-1/2">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-[var(--text-secondary)] truncate max-w-[80px]" title={entry.name}>
                  {entry.name}
                </span>
              </div>
              <span className="font-medium">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
