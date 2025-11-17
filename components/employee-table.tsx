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

export function EmployeeTable({ employeeData }: EmployeeTableProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredEmployees = employeeData.filter((employee) =>
    employee.member.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
      case "Missed":
        return (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30">
            <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">
              {normalizedStatus === "Not started" ? "Absent" : "Missed"}
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


  return (
    <Card className="border-border/50 mt-8 shadow-lg dark:shadow-black/20">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground mb-4">Employee Details</CardTitle>
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
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">Employee</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">Status</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">Shift Start</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">Actual Start</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">Late Duration</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-foreground tracking-wide">Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border/50 transition-all duration-200 hover:bg-muted/50 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    }`}
                  >
                    <td className="py-4 px-6 text-sm font-semibold text-foreground">{employee.member}</td>
                    <td className="py-4 px-6">{getStatusBadge(employee.status)}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{formatTime(employee.shiftStart)}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{formatTime(employee.startTime)}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{employee.late || "N/A"}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{employee.actual || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                    No employees found matching "{searchQuery}"
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
