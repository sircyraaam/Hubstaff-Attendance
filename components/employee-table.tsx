"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { EmployeeData } from "@/lib/types"
import { Clock, CheckCircle2, XCircle, Search, CircleMinus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/date-utils"

interface EmployeeTableProps {
  employeeData: EmployeeData[]
  onDeleteRow: (index: number) => void
}

/**
 * Extract "HH:MM[:SS]" from a string (e.g.
 * "2025-11-17T09:00:00+10:00" or "09:00:00") and convert to minutes.
 */
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

/**
 * Parse full ISO datetime string and return Date object
 */
const parseISODateTime = (value: string | null | undefined): Date | null => {
  if (!value) return null
  try {
    return new Date(value)
  } catch {
    return null
  }
}

/**
 * Parse "H:MM:SS" (e.g. "8:00:00", "2:50:02") from Hubstaff into minutes.
 */
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

/**
 * Compute status from Hubstaff-style fields.
 *
 * Rules:
 * - Not started:
 *    - no shift scheduled or no data available
 * - Missed/Absent:
 *    - no Start time AND no Actual (never clocked in)
 *    - OR Late by more than 2 hours
 * - Abandoned:
 *    - has Start time (logged in)
 *    - Calculate: Expected Duration = NOW - Start Time
 *    - If Actual Work < (Expected Duration - 2 hours) → Abandoned
 * - Late:
 *    - Start time is 5 minutes to 2 hours after shift start
 * - On Time:
 *    - Started within 5 minutes of shift start
 */
const computeStatusFromTimes = (employee: EmployeeData): string => {
  const shiftMinutes = parseTimeToMinutes(employee.shiftStart as string | null)
  const shiftEndMinutes = parseTimeToMinutes(
    (employee as any).shiftEnd as string | null, // adjust if shiftEnd is typed
  )
  const startMinutes = parseTimeToMinutes(employee.startTime as string | null)
  const startDateTime = parseISODateTime(employee.startTime as string | null)
  const actualMinutes = parseDurationToMinutes(employee.actual as string | null)

  const hasActual = actualMinutes !== null && actualMinutes > 0
  const hasStartTime = startMinutes !== null

  const now = new Date()
  const nowMinutesOfDay = now.getHours() * 60 + now.getMinutes()

  const GRACE_MINUTES = 5
  const LATE_THRESHOLD_MINUTES = 120 // 2 hours
  const ABANDONED_GAP_MINUTES = 120 // 2 hours behind where they "should" be

  // 1) No shift scheduled at all → treat as Not started
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
    const diffMinutes = startMinutes! - shiftMinutes

    // 5a) Abandoned:
    // Has actual work, has start time, knows shift end, and we're still in the shift window
    if (hasActual && startDateTime && shiftEndMinutes !== null) {
      if (nowMinutesOfDay < shiftEndMinutes) {
        const minutesSinceStart =
          (now.getTime() - startDateTime.getTime()) / (1000 * 60)

        const minutesShortfall = minutesSinceStart - actualMinutes!

        if (minutesShortfall >= ABANDONED_GAP_MINUTES) {
          return "Abandoned"
        }
      }
    }

    // 5b) Logged in more than 2 hours late → Missed
    if (diffMinutes > LATE_THRESHOLD_MINUTES) {
      return "Missed"
    }

    // 5c) Late: 5 minutes to 2 hours after shift start
    if (diffMinutes > GRACE_MINUTES && diffMinutes <= LATE_THRESHOLD_MINUTES) {
      return "Late"
    }

    // 5d) On Time: within 5-minute grace
    return "On Time"
  }

  // 6) Edge case: has work logged but no start time
  if (hasActual && !hasStartTime) {
    return "On Time"
  }

  // 7) Fallback
  return "Not started"
}


const getStatusBadge = (status: string) => {
  const normalizedStatus = status.trim()

  switch (normalizedStatus) {
    case "On Time":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            On Time
          </span>
        </div>
      )

    case "Late":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30">
          <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
            Late
          </span>
        </div>
      )

    case "Not started":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-500/15 border border-gray-500/30">
          <CircleMinus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Not Started
          </span>
        </div>
      )

    case "Missed":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-semibold text-red-700 dark:text-red-300">
            Missed
          </span>
        </div>
      )

    case "Abandoned":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-semibold text-red-700 dark:text-red-300">
            Abandoned
          </span>
        </div>
      )

    default:
      return (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-500/15 border border-slate-500/30">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {status}
          </span>
        </div>
      )
  }
}

export function EmployeeTable({ employeeData, onDeleteRow }: EmployeeTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEmployees = employeeData.filter((employee) =>
    employee.member.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="border-border/50 mt-8 shadow-lg dark:shadow-black/20">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground mb-4">
          Employee Details
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search staff by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-2.5 text-base rounded-lg border-border/50"
          />
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-y border-border/50 bg-muted/30">
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">
                  Staff
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">
                  Shift Start
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">
                  Actual Start
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">
                  Late Duration
                </th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">
                  Hours Worked
                </th>
                <th className="text-center py-4 px-6 text-sm font-bold text-foreground tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => {
                  // Compute status using the same logic
                  const computedStatus = computeStatusFromTimes(employee)

                  return (
                    <tr
                      key={index}
                      className={`border-b border-border/50 transition-all duration-200 hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/20"
                      }`}
                    >
                      <td className="py-4 px-6 text-sm font-semibold text-foreground">
                        {employee.member}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(computedStatus)}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {formatTime(employee.shiftStart)}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {formatTime(employee.startTime)}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {employee.late || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {employee.actual || "N/A"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteRow(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No staff found matching &quot;{searchQuery}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
