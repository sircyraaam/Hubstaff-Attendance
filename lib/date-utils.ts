/**
 * Safely parse a date string that might be in various formats
 * Handles ISO datetime strings, date strings, and invalid values
 */
export function parseDate(dateString: string | undefined | null): Date | null {
  if (!dateString || dateString === "N/A" || dateString.trim() === "") {
    return null
  }

  try {
    const date = new Date(dateString)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null
    }
    return date
  } catch {
    return null
  }
}

/**
 * Format a date string to a readable time format
 * Returns "N/A" if the date is invalid
 */
export function formatTime(dateString: string | undefined | null): string {
  const date = parseDate(dateString)
  if (!date) return "N/A"

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

/**
 * Format a date string to a readable date format
 * Returns "N/A" if the date is invalid
 */
export function formatDate(dateString: string | undefined | null): string {
  const date = parseDate(dateString)
  if (!date) return "N/A"

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/**
 * Format a date string to a readable datetime format
 * Returns "N/A" if the date is invalid
 */
export function formatDateTime(dateString: string | undefined | null): string {
  const date = parseDate(dateString)
  if (!date) return "N/A"

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDateShort(dateString: string | undefined | null): string {
  const date = parseDate(dateString)
  if (!date) return "N/A"

  const day = String(date.getDate()).padStart(2, "0")
  const month = date.toLocaleString("en-US", { month: "short" })
  const year = String(date.getFullYear()).slice(-2)
  return `${day}-${month}-${year}`
}
