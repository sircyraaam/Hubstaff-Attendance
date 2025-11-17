"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import type { EmployeeData } from "@/lib/types"

interface AttendanceTrendChartProps {
  employeeData: EmployeeData[]
}

export function AttendanceTrendChart({ employeeData }: AttendanceTrendChartProps) {
  // Group data by date
  const dateGroups = employeeData.reduce(
    (acc, emp) => {
      if (!acc[emp.date]) {
        acc[emp.date] = { onTime: 0, late: 0, absent: 0 }
      }
      if (emp.status === "On Time") acc[emp.date].onTime++
      else if (emp.status === "Late") acc[emp.date].late++
      else acc[emp.date].absent++
      return acc
    },
    {} as Record<string, { onTime: number; late: number; absent: number }>,
  )

  // Convert to chart data and sort by date
  const chartData = Object.entries(dateGroups)
    .map(([date, counts]) => ({
      date,
      "On Time": counts.onTime,
      Late: counts.late,
      Absent: counts.absent,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Attendance Trend</CardTitle>
        <CardDescription>Daily attendance patterns over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="On Time" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Late" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Absent" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
