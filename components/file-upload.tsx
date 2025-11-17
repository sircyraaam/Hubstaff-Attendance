"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react"
import { parseCSV } from "@/lib/csv-parser"
import { parseExcelFile } from "@/lib/xlsx-parser"
import type { EmployeeData } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadProps {
  onDataUpload: (data: EmployeeData[]) => void
}

export function FileUpload({ onDataUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(
    async (file: File) => {
      const isCSV = file.name.endsWith(".csv")
      const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls")

      if (!isCSV && !isExcel) {
        setError("Please upload a CSV or Excel file (.csv, .xlsx, .xls)")
        return
      }

      setIsProcessing(true)
      setError(null)

      try {
        let data: EmployeeData[]

        if (isCSV) {
          const text = await file.text()
          data = parseCSV(text)
        } else {
          data = await parseExcelFile(file)
        }

        if (data.length === 0) {
          throw new Error("No valid data found in file")
        }

        onDataUpload(data)
      } catch (error) {
        console.error("[v0] Error parsing file:", error)
        const errorMessage = error instanceof Error ? error.message : "Error parsing file. Please check the format."
        setError(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    },
    [onDataUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  return (
    <div className="w-full max-w-2xl space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-16 px-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileSpreadsheet className="w-8 h-8 text-primary" />
          </div>

          <h3 className="text-xl font-semibold text-foreground mb-2">Upload Workforce Data</h3>

          <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
            Drag and drop your CSV or Excel file here, or click to browse
          </p>

          <label htmlFor="file-upload">
            <Button disabled={isProcessing} className="cursor-pointer" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Select File"}
              </span>
            </Button>
          </label>

          <input id="file-upload" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileInput} className="hidden" />

          <p className="text-xs text-muted-foreground mt-4">Supported formats: CSV, XLSX, XLS</p>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
