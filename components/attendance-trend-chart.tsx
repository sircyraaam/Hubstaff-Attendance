"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
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

  const CustomLegend = () => (
    <div className="flex items-center justify-center gap-6 pb-2 flex-wrap">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-[#22c55e] shadow-sm" />
        <span className="text-sm font-medium text-foreground">On Time</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-[#fb923c] shadow-sm" />
        <span className="text-sm font-medium text-foreground">Late</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-[#f87171] shadow-sm" />
        <span className="text-sm font-medium text-foreground">Absent</span>
      </div>
    </div>
  )

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
          Attendance Trend
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Daily attendance patterns over time
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2 pb-6">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="currentColor"
              className="text-border"
              strokeOpacity={0.15}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
              fontWeight={500}
              tickLine={false}
              axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
              dy={10}
              tickFormatter={(value) => {
                const date = new Date(value)
                return `${date.getMonth() + 1}/${date.getDate()}`
              }}
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
            />
            <Line 
              type="monotone" 
              dataKey="On Time" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ 
                r: 5, 
                fill: "#22c55e", 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))",
              }}
              activeDot={{ 
                r: 7, 
                fill: "#22c55e", 
                strokeWidth: 2,
                stroke: "hsl(var(--background))"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="Late" 
              stroke="#fb923c" 
              strokeWidth={3}
              dot={{ 
                r: 5, 
                fill: "#fb923c", 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))",
              }}
              activeDot={{ 
                r: 7, 
                fill: "#fb923c", 
                strokeWidth: 2,
                stroke: "hsl(var(--background))"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="Absent" 
              stroke="#f87171" 
              strokeWidth={3}
              dot={{ 
                r: 5, 
                fill: "#f87171", 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))",
              }}
              activeDot={{ 
                r: 7, 
                fill: "#f87171", 
                strokeWidth: 2,
                stroke: "hsl(var(--background))"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Custom Legend */}
        <div className="mt-6">
          <CustomLegend />
        </div>
      </CardContent>
    </Card>
  )
}
