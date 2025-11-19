"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, FileImage, Loader2 } from "lucide-react"
import { exportToPDF, exportToImage } from "@/lib/export-utils"
import type { EmployeeData } from "@/lib/types"

interface ExportButtonsProps {
  employeeData: EmployeeData[]
}

export function ExportButtons({ employeeData }: ExportButtonsProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isExportingImage, setIsExportingImage] = useState(false)

  const handlePDFExport = async () => {
    setIsExportingPDF(true)
    try {
      console.log("[v0] Starting PDF export...")
      await exportToPDF(employeeData)
      console.log("[v0] PDF export completed")
    } catch (error) {
      console.error("[v0] PDF export failed:", error)
    } finally {
      setIsExportingPDF(false)
    }
  }

  // const handleImageExport = async () => {
  //   setIsExportingImage(true)
  //   try {
  //     console.log("[v0] Starting image export...")
  //     await exportToImage(employeeData)
  //     console.log("[v0] Image export completed")
  //   } catch (error) {
  //     console.error("[v0] Image export failed:", error)
  //   } finally {
  //     setIsExportingImage(false)
  //   }
  // }

  return (
    <div className="flex gap-3">
      {/* <Button
        variant="outline"
        onClick={handleImageExport}
        disabled={isExportingImage}
        className="gap-2 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
      >
        {isExportingImage ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <FileImage className="w-4 h-4" />
            Export as Image
          </>
        )}
      </Button> */}
      <Button
        onClick={handlePDFExport}
        disabled={isExportingPDF}
        className="gap-2 text-white transition-all duration-200 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isExportingPDF ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Export as PDF
          </>
        )}
      </Button>
    </div>
  )
}
