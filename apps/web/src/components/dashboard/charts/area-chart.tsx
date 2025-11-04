'use client';

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz

import React from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface AreaChartProps {
  data: any[];
  dataKeys: string[];
  colors: string[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  stackOffset?: 'none' | 'expand' | 'wiggle' | 'silhouette';
}

export function AreaChart({
  data,
  dataKeys,
  colors,
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showTooltip = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = false,
  stackOffset = 'none',
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        stackOffset={stackOffset}
      >
        {showLegend && <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />}
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        {showXAxis && <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} />}
        {showYAxis && <YAxis tickLine={false} axisLine={false} />}
        {showTooltip && <Tooltip />}
        {dataKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.3}
            activeDot={{ r: 6 }}
            strokeWidth={2}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
