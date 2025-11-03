"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz

import React from "react";
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface LineChartProps {
  data: any[];
  dataKeys: string[];
  colors: string[];
  xAxisKey?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  curveType?: "basis" | "linear" | "natural" | "monotone" | "step" | "stepAfter" | "stepBefore";
}

export function LineChart({
  data,
  dataKeys,
  colors,
  xAxisKey = "name",
  height = 300,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
  curveType = "monotone",
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        {showXAxis && <XAxis 
          dataKey={xAxisKey} 
          tickLine={false} 
          axisLine={false} 
        />}
        {showYAxis && <YAxis 
          tickLine={false} 
          axisLine={false} 
        />}
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type={curveType}
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            activeDot={{ r: 6 }}
            dot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
