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
    { name: "On Time", value: statusCounts["On Time"] || 0, fill: "oklch(0.68 0.19 150)" },
    { name: "Late", value: statusCounts["Late"] || 0, fill: "oklch(0.78 0.16 85)" },
    { name: "Absent", value: statusCounts["Not started"] || 0, fill: "oklch(0.62 0.24 25)" },
  ]

  return (
    <Card className="gradient-card border-border/50 hover:border-border transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-foreground text-xl">Attendance Distribution</CardTitle>
        <CardDescription className="text-muted-foreground">Current status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" stroke="oklch(0.45 0.02 264)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.45 0.02 264)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.16 0.01 264)",
                border: "1px solid oklch(0.28 0.02 264)",
                borderRadius: "0.75rem",
                color: "oklch(0.95 0.005 264)",
                boxShadow: "0 4px 12px oklch(0 0 0 / 0.3)",
              }}
              cursor={{ fill: "oklch(0.25 0.015 264 / 0.3)" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={80}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    // </CHANGE>
  )
}
