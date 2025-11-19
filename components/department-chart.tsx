"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts"
import type { EmployeeData } from "@/lib/types"

interface DepartmentChartProps {
  employeeData: EmployeeData[]
}

export function DepartmentChart({ employeeData }: DepartmentChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  
  // Group by organization/department
  const orgCounts = employeeData.reduce(
    (acc, emp) => {
      acc[emp.organization] = (acc[emp.organization] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(orgCounts).map(([name, value]) => ({
    name,
    value,
  }))

  // Vibrant color palette - optimized for dark mode visibility
  const COLORS = [
    "#8b5cf6", // violet-500 - most vibrant
    "#06b6d4", // cyan-500 - bright cyan
    "#f59e0b", // amber-500 - bright amber
    "#ec4899", // pink-500 - bright pink
    "#10b981", // emerald-500 - bright green
    "#f97316", // orange-500 - bright orange
    "#6366f1", // indigo-500 - bright indigo
    "#14b8a6", // teal-500 - bright teal
  ]

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={1}
        />
      </g>
    )
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Don't show label if less than 5%

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-bold text-sm"
        style={{ 
          paintOrder: "stroke",
          stroke: "rgba(0, 0, 0, 0.8)",
          strokeWidth: "4px",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
          Department Distribution
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Employee count by department
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2 pb-6">
        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={130}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  opacity={0.95}
                  style={{ 
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.4)",
                padding: "12px 16px",
              }}
              itemStyle={{
                color: "hsl(var(--popover-foreground))",
                fontWeight: 500,
              }}
              labelStyle={{ 
                color: "hsl(var(--popover-foreground))",
                fontWeight: 600, 
                marginBottom: 8,
              }}
              formatter={(value: any, name: any) => [
                `${value} employee${value !== 1 ? 's' : ''}`,
                name
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Custom Legend */}
        <div className="grid grid-cols-2 gap-3 mt-6 max-w-md mx-auto">
          {chartData.map((entry, index) => (
            <div 
              key={entry.name} 
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/10 transition-colors cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
            >
              <div 
                className="w-4 h-4 rounded-sm flex-shrink-0 shadow-sm" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground truncate block">
                  {entry.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {entry.value} emp{entry.value !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
