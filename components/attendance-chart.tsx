"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import type { EmployeeData } from "@/lib/types"

interface AttendanceChartProps {
  employeeData: EmployeeData[]
}

export function AttendanceChart({ employeeData }: AttendanceChartProps) {
  const statusCounts = employeeData.reduce(
    (acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = [
    { 
      name: "On Time", 
      value: statusCounts["On Time"] || 0,
      color: "#22c55e",
    },
    { 
      name: "Late", 
      value: statusCounts["Late"] || 0,
      color: "#fb923c",
    },
    { 
      name: "Absent", 
      value: statusCounts["Not started"] || 0,
      color: "#f87171",
    },
  ]

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
          Attendance Distribution
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Current status breakdown of all employees
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2 pb-6">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
          >
            <XAxis 
              dataKey="name" 
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={13}
              fontWeight={500}
              tickLine={false} 
              axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
              dy={10}
            />
            <YAxis 
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
              tickLine={false} 
              axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
              dx={-5}
            />
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
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
            />
            <Bar 
              dataKey="value" 
              radius={[12, 12, 0, 0]} 
              maxBarSize={100}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  opacity={0.9}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ 
                  backgroundColor: entry.color,
                }}
              />
              <span className="text-sm font-medium text-foreground">{entry.name}</span>
              <span className="text-sm font-bold text-muted-foreground">({entry.value})</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
