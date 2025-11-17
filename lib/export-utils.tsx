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
    const exportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    pdf.text(`Report Generated: ${exportDate}`, pageWidth / 2, yPosition + 7, { align: "center" })

    yPosition += 18

    // KPI calculations
    const totalEmployees = employeeData.length
    const onTimeCount = employeeData.filter((emp) => emp.status?.toLowerCase() === "on time").length
    const lateCount = employeeData.filter((emp) => emp.status?.toLowerCase() === "late").length
    const notStartedCount = employeeData.filter(
      (emp) => emp.status?.toLowerCase() === "not started" || emp.status?.toLowerCase() === "absent",
    ).length

    const kpiBoxWidth = (pageWidth - 28) / 4
    const kpiBoxHeight = 16
    const kpiPadding = 2
    const kpiData = [
      { label: "Total Employees", value: totalEmployees, color: COLOR_PALETTE.gray },
      { label: "On Time", value: onTimeCount, color: COLOR_PALETTE.lightGreen },
      { label: "Late", value: lateCount, color: COLOR_PALETTE.lightOrange },
      { label: "Not Started", value: notStartedCount, color: COLOR_PALETTE.red },
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
    const columns = ["Employee", "Status", "Date", "Shift Start", "Actual Start", "Late"]
    const availableWidth = pageWidth - 20
    const columnWidths = Array(columns.length).fill(availableWidth / columns.length)

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

      // Status cell background (pastel)
      const statusColor = getStatusColorRGB(emp.status || "N/A")
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
        emp.status || "N/A",
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

  const container = document.createElement("div")
  container.style.cssText = `
    width: 1400px;
    background: white;
    padding: 40px;
    font-family: Arial, 'Helvetica Neue', sans-serif;
    box-sizing: border-box;
  `

  const totalEmployees = employeeData.length
  const onTimeCount = employeeData.filter((emp) => emp.status?.toLowerCase() === "on time").length
  const lateCount = employeeData.filter((emp) => emp.status?.toLowerCase() === "late").length
  const notStartedCount = employeeData.filter(
    (emp) => emp.status?.toLowerCase() === "not started" || emp.status?.toLowerCase() === "absent",
  ).length

  const kpiBoxes = [
    { label: "Total Employees", value: totalEmployees, bgColor: "#E5E7EB", textColor: "#1F2933" }, // soft gray
    { label: "On Time", value: onTimeCount, bgColor: "#D4F3D1", textColor: "#1F2933" }, // pastel green
    { label: "Late", value: lateCount, bgColor: "#FFE2B8", textColor: "#1F2933" }, // pastel peach
    { label: "Not Started", value: notStartedCount, bgColor: "#F8B4B4", textColor: "#1F2933" }, // soft red
  ]

  let kpiHTML =
    '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px;">'
  kpiBoxes.forEach((box) => {
    kpiHTML += `
      <div style="
        background: ${box.bgColor};
        color: ${box.textColor};
        padding: 25px;
        text-align: center;
        border: 1px solid #D1D5DB;
        font-weight: bold;
        border-radius: 6px;
      ">
        <div style="font-size: 14px; margin-bottom: 12px; font-weight: bold;">${box.label}</div>
        <div style="font-size: 32px; font-weight: bold;">${box.value}</div>
      </div>
    `
  })
  kpiHTML += "</div>"

  let tableHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #D1D5DB;">
      <thead>
        <tr style="background: #0074D9; color: white; font-weight: bold;">
          <th style="padding: 12px 10px; text-align: center; border: 1px solid #666; font-weight: bold;">Employee</th>
          <th style="padding: 12px 10px; text-align: center; border: 1px solid #666; font-weight: bold;">Status</th>
          <th style="padding: 12px 10px; text-align: center; border: 1px solid #666; font-weight: bold;">Date</th>
          <th style="padding: 12px 10px; text-align: center; border: 1px solid #666; font-weight: bold;">Shift Start</th>
          <th style="padding: 12px 10px; text-align: center; border: 1px solid #666; font-weight: bold;">Actual Start</th>
          <th style="padding: 12px 10px; text-align: center; border: 1px solid #666; font-weight: bold;">Late Duration</th>
        </tr>
      </thead>
      <tbody>
  `

  employeeData.forEach((emp, idx) => {
    const statusColor = getStatusColor(emp.status || "N/A")
    const bgColor = idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB"

    tableHTML += `
      <tr style="background: ${bgColor};">
        <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: left; font-weight: bold; color: #111827;">
          ${emp.member || "N/A"}
        </td>
        <td style="
          padding: 10px;
          border: 1px solid #E5E7EB;
          text-align: center;
          background: ${statusColor.bg};
          color: ${statusColor.text};
          font-weight: bold;
        ">
          ${emp.status || "N/A"}
        </td>
        <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: center; color: #374151;">
          ${formatDateShort(emp.date) || "N/A"}
        </td>
        <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: center; color: #374151;">
          ${formatTime(emp.shiftStart) || "N/A"}
        </td>
        <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: center; color: #374151;">
          ${formatTime(emp.startTime) || "N/A"}
        </td>
        <td style="padding: 10px; border: 1px solid #E5E7EB; text-align: center; color: #374151;">
          ${emp.late || "N/A"}
        </td>
      </tr>
    `
  })

  tableHTML += `
      </tbody>
    </table>
  `

  container.innerHTML = kpiHTML + tableHTML
  document.body.appendChild(container)

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
    })

    document.body.removeChild(container)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.download = `Attendance-Report-${new Date().toISOString().split("T")[0]}.png`
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
    console.error("Error generating image:", error)
    document.body.removeChild(container)
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
