"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { KPICards } from "@/components/kpi-cards"
import { AttendanceChart } from "@/components/attendance-chart"
import { AttendanceTrendChart } from "@/components/attendance-trend-chart"
import { DepartmentChart } from "@/components/department-chart"
import { LateArrivalChart } from "@/components/late-arrival-chart"
import { EmployeeTable } from "@/components/employee-table-copy1"
import { FileUpload } from "@/components/file-upload"
import { ExportButtons } from "@/components/export-buttons"
import type { EmployeeData } from "@/lib/types"

export default function WorkforceDashboard() {
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([])
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const handleDataUpload = (data: EmployeeData[]) => {
    setEmployeeData(data)
    setIsDataLoaded(true)
  }

  return (
    <div className="min-h-screen bg-background smooth-transition">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-10 space-y-10">
        {!isDataLoaded ? (
          <div className="flex items-center justify-center min-h-[65vh]">
            <FileUpload onDataUpload={handleDataUpload} />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Workforce Overview</h2>
              <p className="text-lg text-muted-foreground font-medium">Real-time attendance monitoring and analytics</p>
            </div>

            <div className="flex items-center justify-between">
              <div />
              <ExportButtons employeeData={employeeData} />
            </div>

            <div id="dashboard-content" className="space-y-10">
              <KPICards employeeData={employeeData} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AttendanceChart employeeData={employeeData} />
                <DepartmentChart employeeData={employeeData} />
              </div>

              <AttendanceTrendChart employeeData={employeeData} />

              <LateArrivalChart employeeData={employeeData} />

              <EmployeeTable employeeData={employeeData} />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
