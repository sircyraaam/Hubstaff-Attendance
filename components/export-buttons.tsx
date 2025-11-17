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

  const handleImageExport = async () => {
    setIsExportingImage(true)
    try {
      console.log("[v0] Starting image export...")
      await exportToImage(employeeData)
      console.log("[v0] Image export completed")
    } catch (error) {
      console.error("[v0] Image export failed:", error)
    } finally {
      setIsExportingImage(false)
    }
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={handlePDFExport}
        disabled={isExportingPDF}
        className="gap-2 text-white smooth-transition"
        style={{
          background: "linear-gradient(135deg, rgb(93, 179, 251) 0%, rgba(93, 179, 251, 0.8) 100%)",
          boxShadow: "0 10px 15px -3px rgba(93, 179, 251, 0.2)",
        }}
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
