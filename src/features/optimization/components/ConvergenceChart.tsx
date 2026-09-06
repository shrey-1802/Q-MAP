import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import type { ConvergencePoint } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Activity } from 'lucide-react';

export interface ConvergenceChartProps {
  data?: ConvergencePoint[];
  className?: string;
}

export const ConvergenceChart: React.FC<ConvergenceChartProps> = ({ data, className }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((d) => ({
    iteration: `Gen ${d.iteration}`,
    bestFitness: Number((d.bestFitness * 100).toFixed(1)),
    avgFitness: d.averageFitness ? Number((d.averageFitness * 100).toFixed(1)) : undefined,
  }));

  return (
    <Card variant="glass" className={className}>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-quantum-400" />
          <CardTitle className="text-xs font-semibold">QIGA Fitness Convergence Telemetry</CardTitle>
        </div>
        <span className="text-[11px] font-mono text-quantum-300 bg-quantum-950/60 px-2 py-0.5 rounded border border-quantum-800">
          Qubit Chromosomes: 50
        </span>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="iteration" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} domain={[30, 100]} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#f8fafc',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                iconType="plainline"
              />
              <Line
                type="monotone"
                name="Best Fitness Score"
                dataKey="bestFitness"
                stroke="#14b8a6"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#14b8a6' }}
                activeDot={{ r: 5 }}
              />
              {chartData[0]?.avgFitness !== undefined && (
                <Line
                  type="monotone"
                  name="Population Average"
                  dataKey="avgFitness"
                  stroke="#818cf8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
