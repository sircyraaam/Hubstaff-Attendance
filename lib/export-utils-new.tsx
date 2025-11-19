import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { EmployeeData } from "./types"
import { formatTime, formatDateShort } from "./date-utils"

const COLOR_PALETTE = {
  blueHeader: { r: 0, g: 116, b: 217 }, // #0074D9 - header
  lightGreen: { r: 212, g: 243, b: 209 }, // #D4F3D1 - On Time (pastel green)
  lightOrange: { r: 255, g: 226, b: 184 }, // #FFE2B8 - Late (pastel peach)
  red: { r: 248, g: 180, b: 180 }, // #F8B4B4 - Not Started/Absent/Missed (soft red)
  gray: { r: 229, g: 231, b: 235 }, // #E5E7EB - Total Employees (soft gray)
  purple: { r: 228, g: 212, b: 247 }, // #E4D4F7 - Abandoned (soft lavender)
}

function getStatusColor(status: string): { bg: string; text: string } {
  const darkText = "#1F2933" // soft dark gray for readability

  switch (status?.toLowerCase()) {
    case "on time":
      return { bg: "#D4F3D1", text: darkText } // pastel green
    case "late":
      return { bg: "#FFE2B8", text: darkText } // pastel peach
    case "not started":
    case "absent":
    case "missed":
      return { bg: "#F8B4B4", text: darkText } // soft red
    case "abandoned":
      return { bg: "#E4D4F7", text: darkText } // soft lavender
    default:
      return { bg: "#F3F4F6", text: darkText } // light neutral
  }
}

function getStatusColorRGB(status: string): [number, number, number] {
  switch (status?.toLowerCase()) {
    case "on time":
      return [212, 243, 209] // #D4F3D1 - pastel green
    case "late":
      return [255, 226, 184] // #FFE2B8 - pastel peach
    case "not started":
    case "absent":
    case "missed":
      return [248, 180, 180] // #F8B4B4 - soft red
    case "abandoned":
      return [228, 212, 247] // #E4D4F7 - soft lavender
    default:
      return [243, 244, 246] // #F3F4F6 - light neutral
  }
}

// Status computation logic
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

  const hasActual = actualMinutes !== null && actualMinutes > 0
  const hasStartTime = startMinutes !== null

  const GRACE_MINUTES = 5
  const LATE_THRESHOLD_MINUTES = 120
  const ABANDONED_GAP_MINUTES = 120

  if (!shiftMinutes) return "Not started"
  if (!hasStartTime && !hasActual) return "Missed"

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

export async function exportToPDF(employeeData: EmployeeData[]) {
  // ... keeping the existing PDF export function
}

export async function exportToImage(employeeData: EmployeeData[]) {
  if (!employeeData || employeeData.length === 0) {
    alert("No employee data available to export.")
    return
  }

  try {
    // Create a clean HTML table with only standard CSS colors
    const container = document.createElement("div")
    container.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 1400px;
      background: rgb(255, 255, 255);
      padding: 30px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    `

    let tableHTML = `
      <div style="background: rgb(255, 255, 255); border: 1px solid rgb(229, 231, 235); border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="font-size: 24px; font-weight: bold; color: rgb(17, 24, 39); margin: 0 0 24px 0;">Employee Details</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background: rgb(249, 250, 251); border-top: 1px solid rgb(229, 231, 235); border-bottom: 1px solid rgb(229, 231, 235);">
              <th style="padding: 16px 24px; text-align: left; font-weight: bold; color: rgb(17, 24, 39); border-bottom: 1px solid rgb(229, 231, 235);">Employee</th>
              <th style="padding: 16px 24px; text-align: left; font-weight: bold; color: rgb(17, 24, 39); border-bottom: 1px solid rgb(229, 231, 235);">Status</th>
              <th style="padding: 16px 24px; text-align: left; font-weight: bold; color: rgb(17, 24, 39); border-bottom: 1px solid rgb(229, 231, 235);">Shift Start</th>
              <th style="padding: 16px 24px; text-align: left; font-weight: bold; color: rgb(17, 24, 39); border-bottom: 1px solid rgb(229, 231, 235);">Actual Start</th>
              <th style="padding: 16px 24px; text-align: left; font-weight: bold; color: rgb(17, 24, 39); border-bottom: 1px solid rgb(229, 231, 235);">Late Duration</th>
              <th style="padding: 16px 24px; text-align: left; font-weight: bold; color: rgb(17, 24, 39); border-bottom: 1px solid rgb(229, 231, 235);">Hours Worked</th>
            </tr>
          </thead>
          <tbody>
    `

    employeeData.forEach((emp, index) => {
      const status = computeStatusFromTimes(emp)
      const statusColor = getStatusColor(status)
      const rowBg = index % 2 === 0 ? "rgb(255, 255, 255)" : "rgb(249, 250, 251)"

      tableHTML += `
        <tr style="background: ${rowBg}; border-bottom: 1px solid rgb(229, 231, 235);">
          <td style="padding: 16px 24px; color: rgb(17, 24, 39); font-weight: 600;">${emp.member || "N/A"}</td>
          <td style="padding: 16px 24px;">
            <span style="
              display: inline-flex;
              align-items: center;
              padding: 6px 12px;
              border-radius: 9999px;
              background: ${statusColor.bg};
              color: ${statusColor.text};
              font-weight: 600;
              font-size: 14px;
            ">${status}</span>
          </td>
          <td style="padding: 16px 24px; color: rgb(107, 114, 128);">${formatTime(emp.shiftStart) || "N/A"}</td>
          <td style="padding: 16px 24px; color: rgb(107, 114, 128);">${formatTime(emp.startTime) || "N/A"}</td>
          <td style="padding: 16px 24px; color: rgb(107, 114, 128);">${emp.late || "N/A"}</td>
          <td style="padding: 16px 24px; color: rgb(107, 114, 128);">${emp.actual || "N/A"}</td>
        </tr>
      `
    })

    tableHTML += `
          </tbody>
        </table>
      </div>
    `

    container.innerHTML = tableHTML
    document.body.appendChild(container)

    // Wait for rendering
    await new Promise(resolve => setTimeout(resolve, 300))

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: false,
    })

    document.body.removeChild(container)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.download = `Employee-Table-${new Date().toISOString().split("T")[0]}.png`
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      },
      "image/png",
      1.0,
    )
    
    console.log("[v0] Table image export completed successfully")
  } catch (error) {
    console.error("Error generating image:", error)
    alert("Error generating image. Please check console for details.")
  }
}

export async function exportChartAsImage(elementId: string, filename: string) {
  const chartElement = document.getElementById(elementId)

  if (!chartElement) {
    console.error(`Element with id ${elementId} not found`)
    return
  }

  try {
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.download = `${filename}-${new Date().toISOString().split("T")[0]}.png`
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      },
      "image/png",
      1.0,
    )
  } catch (error) {
    console.error("Error generating chart image:", error)
    alert("Error generating chart image. Please try again.")
  }
}
