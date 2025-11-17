import * as XLSX from "xlsx"
import type { EmployeeData } from "./types"

export async function parseExcelFile(file: File): Promise<EmployeeData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: "",
        }) as Record<string, string>[]

        console.log("[v0] Parsed Excel data sample:", jsonData[0])
        console.log("[v0] Total rows:", jsonData.length)

        if (jsonData.length === 0) {
          throw new Error("Excel file must contain at least one data row")
        }

        const employeeData: EmployeeData[] = []

        for (let i = 0; i < jsonData.length; i++) {
          const row = jsonData[i]

          // Handle various possible column name variations
          const organization = row["Organization"] || row["organization"] || ""
          const timeZone = row["Time zone"] || row["Timezone"] || row["timezone"] || ""
          const date = row["Date"] || row["date"] || ""
          const member = row["Member"] || row["member"] || row["Employee"] || row["Name"] || ""
          const status = row["Status"] || row["status"] || ""
          const shiftStart = row["Shift start"] || row["ShiftStart"] || row["shift_start"] || ""
          const shiftStop = row["Shift stop"] || row["ShiftStop"] || row["shift_stop"] || ""
          const startTime = row["Start time"] || row["StartTime"] || row["start_time"] || ""
          const required = row["Required"] || row["required"] || ""
          const actual = row["Actual"] || row["actual"] || ""
          const late = row["Late"] || row["late"] || ""

          console.log("[v0] Row", i, "- Member:", member, "Status:", status, "Late:", late)

          employeeData.push({
            organization,
            timeZone,
            date,
            member,
            status,
            shiftStart,
            shiftStop,
            startTime,
            required,
            actual,
            late,
          })
        }

        if (employeeData.length === 0) {
          throw new Error("No valid data rows found in Excel file")
        }

        console.log("[v0] Successfully parsed", employeeData.length, "employees")
        resolve(employeeData)
      } catch (error) {
        console.error("[v0] Excel parsing error:", error)
        reject(error instanceof Error ? error : new Error("Failed to parse Excel file"))
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}
