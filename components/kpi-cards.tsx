import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle2, Clock, XCircle } from "lucide-react"
import type { EmployeeData } from "@/lib/types"

interface KPICardsProps {
  employeeData: EmployeeData[]
}

export function KPICards({ employeeData }: KPICardsProps) {
  const totalEmployees = employeeData.length
  const onTimeCount = employeeData.filter((emp) => emp.status === "On Time").length
  const lateCount = employeeData.filter((emp) => emp.status === "Late").length
  const absentCount = employeeData.filter((emp) => emp.status === "Not started" || emp.status === "Missed").length

  const onTimePercentage = totalEmployees > 0 ? ((onTimeCount / totalEmployees) * 100).toFixed(1) : "0"

  const kpis = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      gradientStyle: "linear-gradient(135deg, rgb(93, 179, 251) 0%, rgba(93, 179, 251, 0.6) 100%)",
      bgColor: "rgba(93, 179, 251, 0.1)",
    },
    {
      title: "On Time",
      value: onTimeCount,
      subtitle: `${onTimePercentage}% of workforce`,
      icon: CheckCircle2,
      gradientStyle: "linear-gradient(135deg, rgb(34, 197, 94) 0%, rgba(34, 197, 94, 0.6) 100%)",
      bgColor: "rgba(34, 197, 94, 0.1)",
    },
    {
      title: "Late Arrivals",
      value: lateCount,
      subtitle: `${lateCount} employees`,
      icon: Clock,
      gradientStyle: "linear-gradient(135deg, rgb(206, 138, 44) 0%, rgba(206, 138, 44, 0.6) 100%)",
      bgColor: "rgba(206, 138, 44, 0.1)",
    },
    {
      title: "Absent",
      value: absentCount,
      subtitle: "Not started shift",
      icon: XCircle,
      gradientStyle: "linear-gradient(135deg, rgb(239, 68, 68) 0%, rgba(239, 68, 68, 0.6) 100%)",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        return (
          <Card
            key={kpi.title}
            className="relative overflow-hidden smooth-transition hover:scale-105 hover:shadow-xl border-border/60 hover:border-border"
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${kpi.bgColor} 0%, transparent 100%)`,
                opacity: 0.4,
              }}
            />

            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{kpi.title}</p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">{kpi.value}</p>
                  {kpi.subtitle && <p className="text-sm text-muted-foreground font-medium">{kpi.subtitle}</p>}
                </div>
                <div
                  className="p-3 rounded-xl flex-shrink-0 ml-4 shadow-lg"
                  style={{
                    background: kpi.gradientStyle,
                    boxShadow: `0 10px 15px -3px ${kpi.bgColor.replace("0.1", "0.2")}`,
                  }}
                >
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
