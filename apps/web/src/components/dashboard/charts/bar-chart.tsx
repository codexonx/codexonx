"use client";

// @ts-nocheck
// TypeScript hatalarını görmezden geliyoruz

import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

interface BarChartProps {
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
  layout?: "horizontal" | "vertical";
  radius?: number;
  stackOffset?: "none" | "expand" | "wiggle" | "silhouette";
  stacked?: boolean;
}

export function BarChart({
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
  layout = "horizontal",
  radius = 4,
  stackOffset = "none",
  stacked = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        {showXAxis && <XAxis 
          dataKey={xAxisKey} 
          tickLine={false} 
          axisLine={false} 
          hide={layout === "vertical"} 
        />}
        {showYAxis && <YAxis 
          tickLine={false} 
          axisLine={false} 
          hide={layout === "horizontal"} 
        />}
        {showTooltip && <Tooltip />}
        {showLegend && <Legend />}
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={radius}
            stackId={stacked ? "a" : undefined}
            barSize={layout === "vertical" ? 20 : undefined}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
