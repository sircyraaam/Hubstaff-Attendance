import { Card, CardContent } from "@/components/ui/card"
import { Users, CheckCircle2, Clock, XCircle, CircleMinus } from "lucide-react"
import type { EmployeeData } from "@/lib/types"

// Status computation logic (same as employee table)
const parseTimeToMinutes = (value: string | null | undefined): number | null => {
  if (!value) return null
  const str = value.trim()
  const match = str.match(/(\d{1,2}):(\d{2})(?::\d{2})?/)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  return hours * 60 + minutes
}

const parseISODateTime = (value: string | null | undefined): Date | null => {
  if (!value) return null
  try {
    return new Date(value)
  } catch {
    return null
  }
}

const parseDurationToMinutes = (value?: string | null): number | null => {
  if (!value) return null
  const parts = value.trim().split(":")
  if (parts.length !== 3) return null
  const [hStr, mStr, sStr] = parts
  const h = Number(hStr)
  const m = Number(mStr)
  const s = Number(sStr)
  if ([h, m, s].some((n) => Number.isNaN(n))) return null
  return h * 60 + m + s / 60
}

const computeStatusFromTimes = (employee: EmployeeData): string => {
  const shiftMinutes = parseTimeToMinutes(employee.shiftStart as string | null)
  const shiftEndMinutes = parseTimeToMinutes((employee as any).shiftEnd as string | null)
  const startMinutes = parseTimeToMinutes(employee.startTime as string | null)
  const startDateTime = parseISODateTime(employee.startTime as string | null)
  const actualMinutes = parseDurationToMinutes(employee.actual as string | null)
  const now = new Date()
  const nowMinutesOfDay = now.getHours() * 60 + now.getMinutes()

  const hasActual = actualMinutes !== null && actualMinutes > 0
  const hasStartTime = startMinutes !== null

  const GRACE_MINUTES = 5
  const LATE_THRESHOLD_MINUTES = 240
  const ABANDONED_GAP_MINUTES = 240

  if (!shiftMinutes) {
    return "Not started"
  }

  // 2) Shift has not yet started (current time before shift start) → Not started
  if (nowMinutesOfDay < shiftMinutes) {
    return "Not started"
  }

  // 3) No Start + No Actual
  if (!hasStartTime && !hasActual) {
      return "Missed"
  }

  if (hasStartTime) {
    const diffMinutes = startMinutes - shiftMinutes

    if (hasActual && startDateTime && shiftEndMinutes !== null) {
      const now = new Date()
      const nowMinutesOfDay = now.getHours() * 60 + now.getMinutes()
      if (nowMinutesOfDay < shiftEndMinutes) {
        const minutesSinceStart = (now.getTime() - startDateTime.getTime()) / (1000 * 60)
        const minutesShortfall = minutesSinceStart - actualMinutes!
        if (minutesShortfall >= ABANDONED_GAP_MINUTES) return "Abandoned"
      }
    }

    if (diffMinutes > LATE_THRESHOLD_MINUTES) return "Missed"
    if (diffMinutes > GRACE_MINUTES && diffMinutes <= LATE_THRESHOLD_MINUTES) return "Late"
    return "On Time"
  }

  if (hasActual && !hasStartTime) return "On Time"
  return "Not started"
}

interface KPICardsProps {
  employeeData: EmployeeData[]
}

export function KPICards({ employeeData }: KPICardsProps) {
  const totalEmployees = employeeData.length
  
  // Compute status for each employee using the same logic as the table
  const employeeStatuses = employeeData.map(emp => computeStatusFromTimes(emp))
  
  const onTimeCount = employeeStatuses.filter((status) => status === "On Time").length
  const lateCount = employeeStatuses.filter((status) => status === "Late").length
  const absentCount = employeeStatuses.filter((status) => status === "Missed").length
  const notStartedCount = employeeStatuses.filter((status) => status === "Not started").length

  console.log("[v0] KPI Debug - Total:", totalEmployees, "On Time:", onTimeCount, "Late:", lateCount, "Absent:", absentCount, "Not Started:", notStartedCount)
  console.log("[v0] Computed statuses:", employeeStatuses)

  const onTimePercentage = totalEmployees > 0 ? ((onTimeCount / totalEmployees) * 100).toFixed(1) : "0"

  const kpis = [
    {
      title: "Total Staffs",
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
      subtitle: `${lateCount} staffs`,
      icon: Clock,
      gradientStyle: "linear-gradient(135deg, rgb(251, 146, 60) 0%, rgba(251, 146, 60, 0.6) 100%)",
      bgColor: "rgba(251, 146, 60, 0.1)",
    },
    {
      title: "Absent",
      value: absentCount,
      subtitle: "Missed/Absent",
      icon: XCircle,
      gradientStyle: "linear-gradient(135deg, rgb(239, 68, 68) 0%, rgba(239, 68, 68, 0.6) 100%)",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
    {
      title: "Not Started",
      value: notStartedCount,
      subtitle: "Not started shift",
      icon: CircleMinus,
      gradientStyle: "linear-gradient(135deg, rgb(107, 114, 128) 0%, rgba(107, 114, 128, 0.6) 100%)",
      bgColor: "rgba(107, 114, 128, 0.1)",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
