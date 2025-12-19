import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { EmployeeData } from "./types"
import { formatTime, formatDateShort } from "./date-utils"

const COLOR_PALETTE = {
  blueHeader: { r: 0, g: 116, b: 217 }, // #0074D9 - header
  lightGreen: { r: 212, g: 243, b: 209 }, // #D4F3D1 - On Time (pastel green)
  lightOrange: { r: 255, g: 226, b: 184 }, // #FFE2B8 - Late (pastel orange)
  red: { r: 248, g: 180, b: 180 }, // #F8B4B4 - Missed/Abandoned (soft red)
  gray: { r: 209, g: 213, b: 219 }, // #D1D5DB - Not Started (soft gray)
}

function getStatusColor(status: string): { bg: string; text: string } {
  const darkText = "#1F2933" // soft dark gray for readability

  switch (status?.toLowerCase()) {
    case "on time":
      return { bg: "#D4F3D1", text: darkText } // pastel green
    case "late":
      return { bg: "#FFE2B8", text: darkText } // pastel orange
    case "not started":
      return { bg: "#D1D5DB", text: darkText } // soft gray
    case "missed":
    case "abandoned":
      return { bg: "#F8B4B4", text: darkText } // soft red
    default:
      return { bg: "#F3F4F6", text: darkText } // light neutral
  }
}

function getStatusColorRGB(status: string): [number, number, number] {
  switch (status?.toLowerCase()) {
    case "on time":
      return [212, 243, 209] // #D4F3D1 - pastel green
    case "late":
      return [255, 226, 184] // #FFE2B8 - pastel orange
    case "not started":
      return [209, 213, 219] // #D1D5DB - soft gray
    case "missed":
    case "abandoned":
      return [248, 180, 180] // #F8B4B4 - soft red
    default:
      return [243, 244, 246] // #F3F4F6 - light neutral
  }
}

// Status computation logic for image export
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
  const now = new Date()
  const nowMinutesOfDay = now.getHours() * 60 + now.getMinutes()

  const hasActual = actualMinutes !== null && actualMinutes > 0
  const hasStartTime = startMinutes !== null

  const GRACE_MINUTES = 5
  const LATE_THRESHOLD_MINUTES = 240
  const ABANDONED_GAP_MINUTES = 240

  if (!shiftMinutes) return "Not started"
  if (nowMinutesOfDay < shiftMinutes) {
    return "Not started"
  }

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
  if (!employeeData || employeeData.length === 0) {
    alert("No employee data available to export.")
    return
  }

  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 10

    // Title
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(14)
    pdf.setTextColor(0, 116, 217)
    pdf.text("Workforce Attendance Report", pageWidth / 2, yPosition, { align: "center" })

    // Subtitle / date
    pdf.setFont("helvetica", "normal")
    pdf.setFontSize(9)
    pdf.setTextColor(100, 100, 100)

    const now = new Date()

    const formattedDate = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })

    pdf.text(
      `Report Generated: ${formattedDate} ${formattedTime}`,
      pageWidth / 2,
      yPosition + 7,
      { align: "center" },
    )

    yPosition += 18

    // KPI calculations - use computed status
    const totalEmployees = employeeData.length
    const onTimeCount = employeeData.filter((emp) => computeStatusFromTimes(emp) === "On Time").length
    const lateCount = employeeData.filter((emp) => computeStatusFromTimes(emp) === "Late").length
    const absentCount = employeeData.filter(
      (emp) => {
        const status = computeStatusFromTimes(emp)
        return status === "Missed"
      }
    ).length
    const notStartedCount = employeeData.filter((emp) => computeStatusFromTimes(emp) === "Not started").length

    const kpiBoxWidth = (pageWidth - 30) / 5
    const kpiBoxHeight = 16
    const kpiPadding = 2
    const kpiData = [
      { label: "Total Staff", value: totalEmployees, color: COLOR_PALETTE.gray },
      { label: "On Time", value: onTimeCount, color: COLOR_PALETTE.lightGreen },
      { label: "Late", value: lateCount, color: COLOR_PALETTE.lightOrange },
      { label: "Absent", value: absentCount, color: COLOR_PALETTE.red },
      { label: "Not Started", value: notStartedCount, color: COLOR_PALETTE.gray },
    ]

    // KPI row
    let xPosition = 10
    kpiData.forEach((kpi) => {
      pdf.setFillColor(kpi.color.r, kpi.color.g, kpi.color.b)
      pdf.rect(xPosition, yPosition, kpiBoxWidth, kpiBoxHeight, "F")

      pdf.setDrawColor(0, 0, 0)
      pdf.setLineWidth(0.5)
      pdf.rect(xPosition, yPosition, kpiBoxWidth, kpiBoxHeight)

      // Dark text for all pastel backgrounds
      pdf.setTextColor(31, 41, 55) // #1F2937
      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      pdf.text(kpi.label, xPosition + kpiBoxWidth / 2, yPosition + 4.5, {
        align: "center",
        maxWidth: kpiBoxWidth - 2,
      })

      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text(kpi.value.toString(), xPosition + kpiBoxWidth / 2, yPosition + 11, { align: "center" })

      xPosition += kpiBoxWidth + kpiPadding
    })

    yPosition += 24

    // Table header
    const columns = ["Staff", "Status", "Date", "Shift Start", "Actual Start", "Late"]
    const availableWidth = pageWidth - 20
    const columnWidths = [
      availableWidth * 0.26, // Staff - widest
      availableWidth * 0.12, // Status - short label
      availableWidth * 0.16, // Date
      availableWidth * 0.16, // Shift Start
      availableWidth * 0.16, // Actual Start
      availableWidth * 0.14, // Late
    ]

    pdf.setFillColor(COLOR_PALETTE.blueHeader.r, COLOR_PALETTE.blueHeader.g, COLOR_PALETTE.blueHeader.b)
    pdf.rect(10, yPosition, availableWidth, 7, "F")

    pdf.setTextColor(255, 255, 255)
    pdf.setFont("helvetica", "bold")
    pdf.setFontSize(8)

    let colX = 10
    columns.forEach((col, idx) => {
      pdf.text(col, colX + columnWidths[idx] / 2, yPosition + 4.5, { align: "center" })
      colX += columnWidths[idx]
    })

    yPosition += 8

    // Table body
    pdf.setFontSize(7)
    pdf.setFont("helvetica", "normal")
    let rowIndex = 0

    employeeData.forEach((emp) => {
      const rowHeight = 5.5

      // Zebra rows
      if (rowIndex % 2 === 1) {
        pdf.setFillColor(245, 245, 245)
        pdf.rect(10, yPosition, availableWidth, rowHeight, "F")
      }

      pdf.setDrawColor(150, 150, 150)
      pdf.setLineWidth(0.3)

      // Status cell background (pastel) - use computed status
      const statusColor = getStatusColorRGB(computeStatusFromTimes(emp))
      pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2])
      pdf.rect(10 + columnWidths[0], yPosition, columnWidths[1], rowHeight, "F")

      // Column borders
      colX = 10
      columnWidths.forEach((width) => {
        pdf.rect(colX, yPosition, width, rowHeight)
        colX += width
      })

      colX = 10
      const rowData = [
        emp.member || "N/A",
        computeStatusFromTimes(emp) || "N/A",
        formatDateShort(emp.date) || "N/A",
        formatTime(emp.shiftStart) || "N/A",
        formatTime(emp.startTime) || "N/A",
        emp.late || "N/A",
      ]

      rowData.forEach((data, colIdx) => {
        if (colIdx === 1) {
          // Status text: bold, dark gray on pastel background
          pdf.setTextColor(31, 41, 55)
          pdf.setFont("helvetica", "bold")
        } else {
          pdf.setTextColor(55, 65, 81)
          pdf.setFont("helvetica", "normal")
        }

        const textX = colX + columnWidths[colIdx] / 2
        const maxWidth = columnWidths[colIdx] - 2
        pdf.text(data.toString(), textX, yPosition + 3.2, { align: "center", maxWidth })
        colX += columnWidths[colIdx]
      })

      yPosition += rowHeight
      rowIndex++

      // New page if needed
      if (yPosition > pageHeight - 12) {
        pdf.addPage()
        yPosition = 10

        pdf.setFillColor(COLOR_PALETTE.blueHeader.r, COLOR_PALETTE.blueHeader.g, COLOR_PALETTE.blueHeader.b)
        pdf.rect(10, yPosition, availableWidth, 7, "F")

        pdf.setTextColor(255, 255, 255)
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(8)

        colX = 10
        columns.forEach((col, idx) => {
          pdf.text(col, colX + columnWidths[idx] / 2, yPosition + 4.5, { align: "center" })
          colX += columnWidths[idx]
        })

        yPosition += 8
        pdf.setFontSize(7)
        pdf.setFont("helvetica", "normal")
        rowIndex = 0
      }
    })

    // Page numbers
    const pageCount = pdf.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 5, { align: "center" })
    }

    pdf.save(`Attendance-Report-${new Date().toISOString().split("T")[0]}.pdf`)
    console.log("[v0] PDF export completed successfully in portrait A4 format")
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Error generating PDF. Please check console for details.")
  }
}

export async function exportToImage(employeeData: EmployeeData[]) {
  if (!employeeData || employeeData.length === 0) {
    alert("No employee data available to export.")
    return
  }

  try {
    // Create a clean HTML table with only standard CSS colors (rgb format)
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
      const status = computeStatusFromTimes(emp) // Use computed status
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
      onclone: (clonedDoc) => {
        // Remove all stylesheets to prevent lab() color parsing issues
        const styleSheets = clonedDoc.querySelectorAll('link[rel="stylesheet"], style')
        styleSheets.forEach(sheet => sheet.remove())
        
        // Ensure the container in the cloned document has explicit styles
        const clonedContainer = clonedDoc.querySelector('div')
        if (clonedContainer) {
          clonedContainer.style.cssText = `
            width: 1400px;
            background: rgb(255, 255, 255);
            padding: 30px;
            font-family: Arial, sans-serif;
          `
        }
      }
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
