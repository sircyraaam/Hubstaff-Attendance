import type { EmployeeData } from "./types"
import * as XLSX from "xlsx"

export function parseCSV(csvText: string): EmployeeData[] {
  const lines = csvText.trim().split("\n")

  if (lines.length < 2) {
    throw new Error("CSV file must contain at least a header row and one data row")
  }

  const headerLine = lines[0]
  const headers = headerLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((h) => h.trim().replace(/^"|"$/g, ""))

  console.log("[v0] CSV Headers:", headers)

  const data: EmployeeData[] = []

  // Skip header row and parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines

    // Handle both comma and semicolon delimiters, and quoted fields
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => v.trim().replace(/^"|"$/g, ""))

    const rowData: Record<string, string> = {}
    headers.forEach((header, index) => {
      rowData[header] = values[index] || ""
    })

    const organization = rowData["Organization"] || rowData["organization"] || ""
    const timeZone = rowData["Time zone"] || rowData["Timezone"] || rowData["timezone"] || ""
    const date = rowData["Date"] || rowData["date"] || ""
    const member = rowData["Member"] || rowData["member"] || rowData["Employee"] || rowData["Name"] || ""
    const status = rowData["Status"] || rowData["status"] || ""
    const shiftStart = rowData["Shift start"] || rowData["ShiftStart"] || rowData["shift_start"] || ""
    const shiftStop = rowData["Shift stop"] || rowData["ShiftStop"] || rowData["shift_stop"] || ""
    const startTime = rowData["Start time"] || rowData["StartTime"] || rowData["start_time"] || ""
    const required = rowData["Required"] || rowData["required"] || ""
    const actual = rowData["Actual"] || rowData["actual"] || ""
    const late = rowData["Late"] || rowData["late"] || ""

    console.log("[v0] Row", i, "- Member:", member, "Status:", status, "Late:", late)

    data.push({
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

  if (data.length === 0) {
    throw new Error("No valid data rows found in CSV file")
  }

  console.log("[v0] Successfully parsed", data.length, "employees from CSV")
  return data
}

export function parseExcel(file: File): Promise<EmployeeData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][]

        const employeeData: EmployeeData[] = []

        // Skip header row
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (row.length >= 11) {
            employeeData.push({
              organization: String(row[0] || ""),
              timeZone: String(row[1] || ""),
              date: String(row[2] || ""),
              member: String(row[3] || ""),
              status: String(row[4] || ""),
              shiftStart: String(row[5] || ""),
              shiftStop: String(row[6] || ""),
              startTime: String(row[7] || ""),
              required: String(row[8] || ""),
              actual: String(row[9] || ""),
              late: String(row[10] || ""),
            })
          }
        }

        resolve(employeeData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}

export function parseCSVImproved(csvText: string): EmployeeData[] {
  const lines = csvText.trim().split("\n")

  if (lines.length < 2) {
    throw new Error("CSV file must contain at least a header row and one data row")
  }

  const headerLine = lines[0]
  const headers = headerLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((h) => h.trim().replace(/^"|"$/g, ""))

  console.log("[v0] CSV Headers:", headers)

  const data: EmployeeData[] = []

  // Skip header row and parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines

    // Handle both comma and semicolon delimiters, and quoted fields
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) => v.trim().replace(/^"|"$/g, ""))

    const rowData: Record<string, string> = {}
    headers.forEach((header, index) => {
      rowData[header] = values[index] || ""
    })

    const organization = rowData["Organization"] || rowData["organization"] || ""
    const timeZone = rowData["Time zone"] || rowData["Timezone"] || rowData["timezone"] || ""
    const date = rowData["Date"] || rowData["date"] || ""
    const member = rowData["Member"] || rowData["member"] || rowData["Employee"] || rowData["Name"] || ""
    const status = rowData["Status"] || rowData["status"] || ""
    const shiftStart = rowData["Shift start"] || rowData["ShiftStart"] || rowData["shift_start"] || ""
    const shiftStop = rowData["Shift stop"] || rowData["ShiftStop"] || rowData["shift_stop"] || ""
    const startTime = rowData["Start time"] || rowData["StartTime"] || rowData["start_time"] || ""
    const required = rowData["Required"] || rowData["required"] || ""
    const actual = rowData["Actual"] || rowData["actual"] || ""
    const late = rowData["Late"] || rowData["late"] || ""

    console.log("[v0] Row", i, "- Member:", member, "Status:", status, "Late:", late)

    data.push({
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

  if (data.length === 0) {
    throw new Error("No valid data rows found in CSV file")
  }

  console.log("[v0] Successfully parsed", data.length, "employees from CSV")
  return data
}
