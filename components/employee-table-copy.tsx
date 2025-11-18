"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { EmployeeData } from "@/lib/types"
import { Clock, CheckCircle2, XCircle, Search, CircleMinus } from "lucide-react"
import { formatTime } from "@/lib/date-utils"

interface EmployeeTableProps {
  employeeData: EmployeeData[]
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
 * - Missed:
 *    - no Start time AND no Actual
 * - Abandoned:
 *    - has Start time AND Actual
 *    - AND Actual <= Required - 60 minutes
 * - Late:
 *    - Start time > Shift start + 5 minutes
 * - On Time:
 *    - everything else
 */
const computeStatusFromTimes = (employee: EmployeeData): string => {
  const shiftMinutes = parseTimeToMinutes(employee.shiftStart as string | null)
  const startMinutes = parseTimeToMinutes(employee.startTime as string | null)
  const requiredMinutes = parseDurationToMinutes(employee.required as string | null)
  const actualMinutes = parseDurationToMinutes(employee.actual as string | null)

  const hasActual = actualMinutes !== null && actualMinutes > 0

  // 1) Missed: scheduled but never clocked in and no work logged
  if (!startMinutes && !hasActual && shiftMinutes !== null) {
    return "Missed"
  }

  // 2) Abandoned: started but worked significantly less than required
  if (
    startMinutes !== null &&
    hasActual &&
    requiredMinutes !== null
  ) {
    const ABANDONED_SHORTFALL_MIN = 60 // tweak if you want stricter/looser
    if (actualMinutes! <= requiredMinutes - ABANDONED_SHORTFALL_MIN) {
      return "Abandoned"
    }
  }

  // 3) If we can't compare times properly but they did work, just treat as On Time
  if (!shiftMinutes || !startMinutes) {
    return hasActual ? "On Time" : "Not started"
  }

  // 4) On Time vs Late based on start vs shift
  const diffMinutes = startMinutes - shiftMinutes
  const GRACE_MINUTES = 5

  if (diffMinutes > GRACE_MINUTES) {
    return "Late"
  }

  return "On Time"
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30">
          <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            Late
          </span>
        </div>
      )

    case "Not started":
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm font-semibold text-red-700 dark:text-red-300">
            Absent
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30">
          <CircleMinus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
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

export function EmployeeTable({ employeeData }: EmployeeTableProps) {
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
            placeholder="Search employees by name..."
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
                  Employee
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
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => {
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
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No employees found matching &quot;{searchQuery}&quot;
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
