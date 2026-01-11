import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { ChartDataPoint } from '../types';

interface PriceChartProps {
  data: ChartDataPoint[];
  color?: string;
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-2xl">
        <p className="text-slate-400 text-xs mb-1 font-mono">{label}</p>
        <p className="text-white font-bold font-display text-lg">
          ${payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data, color = "#06b6d4" }) => {
  return (
    <div className="w-full h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tick={{ fontSize: 11 }} 
            tickMargin={15}
            minTickGap={40}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#64748b" 
            tick={{ fontSize: 11 }} 
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            domain={['auto', 'auto']}
            width={70}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;