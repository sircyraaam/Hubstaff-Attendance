"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"
import type { EmployeeData } from "@/lib/types"

interface LateArrivalChartProps {
  employeeData: EmployeeData[]
}

export function LateArrivalChart({ employeeData }: LateArrivalChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
  
  // Get employees who were late and their late minutes
  const lateEmployees = employeeData
    .filter((emp) => emp.status === "Late" && emp.late)
    .map((emp) => ({
      name: emp.member,
      minutes: Number.parseInt(emp.late) || 0,
    }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10) // Top 10 late arrivals

  // Color gradient based on severity - brighter for dark mode
  const getBarColor = (minutes: number) => {
    const maxMinutes = Math.max(...lateEmployees.map(e => e.minutes))
    const intensity = minutes / maxMinutes
    
    if (intensity > 0.7) {
      return "#f87171" // red-400 - severe
    } else if (intensity > 0.4) {
      return "#fb923c" // orange-400 - moderate
    } else {
      return "#fbbf24" // amber-400 - mild
    }
  }

  return (
    <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-2xl font-bold tracking-tight">
          Top Late Arrivals
        </CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Employees with highest late minutes (Top 10)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-2 pb-6">
        {lateEmployees.length === 0 ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center space-y-2">
              <div className="text-4xl">🎉</div>
              <p className="text-lg font-semibold text-foreground">No late arrivals!</p>
              <p className="text-sm text-muted-foreground">Everyone is on time</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={lateEmployees} 
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="currentColor"
                className="text-border"
                strokeOpacity={0.15}
                horizontal={true}
                vertical={false}
              />
              <XAxis 
                type="number" 
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                label={{ 
                  value: "Minutes Late", 
                  position: "insideBottom", 
                  offset: -5,
                  style: { 
                    fill: "hsl(var(--muted-foreground))", 
                    fontSize: 12,
                    fontWeight: 500
                  }
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="currentColor"
                className="text-muted-foreground"
                fontSize={12}
                width={140}
                tickLine={false}
                axisLine={{ stroke: "currentColor", strokeOpacity: 0.2 }}
                tickFormatter={(value) => {
                  if (value.length > 18) {
                    return `${value.substring(0, 18)}...`
                  }
                  return value
                }}
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
                formatter={(value: any) => [`${value} minutes`, "Late by"]}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
              />
              <Bar 
                dataKey="minutes" 
                radius={[0, 8, 8, 0]}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                {lateEmployees.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.minutes)}
                    opacity={activeIndex === undefined || activeIndex === index ? 0.9 : 0.5}
                    style={{ 
                      transition: "opacity 0.3s ease",
                      cursor: "pointer"
                    }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {lateEmployees.length > 0 && (
          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#fbbf24] shadow-sm" />
              <span className="text-xs font-medium text-muted-foreground">Mild</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#fb923c] shadow-sm" />
              <span className="text-xs font-medium text-muted-foreground">Moderate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#f87171] shadow-sm" />
              <span className="text-xs font-medium text-muted-foreground">Severe</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
