"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { EmployeeData } from "@/lib/types"

interface LateArrivalChartProps {
  employeeData: EmployeeData[]
}

export function LateArrivalChart({ employeeData }: LateArrivalChartProps) {
  // Get employees who were late and their late minutes
  const lateEmployees = employeeData
    .filter((emp) => emp.status === "Late" && emp.late)
    .map((emp) => ({
      name: emp.member,
      minutes: Number.parseInt(emp.late) || 0,
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10) // Top 10 late arrivals

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Top Late Arrivals</CardTitle>
        <CardDescription>Employees with highest late minutes</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={lateEmployees} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              width={120}
              tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value) => [`${value} minutes`, "Late by"]}
            />
            <Bar dataKey="minutes" fill="hsl(var(--warning))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
