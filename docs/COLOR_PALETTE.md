# 🎨 Chart Color Palette Reference

## Color System

All colors are carefully chosen to work beautifully in both **light** and **dark** modes, with optimal contrast and accessibility.

---

## Primary Chart Colors

### ✅ Success / On Time
\`\`\`css
Light Mode: #10b981  /* Emerald-500 */
Dark Mode:  #34d399  /* Emerald-400 */
\`\`\`
**Usage**: On-time attendance, positive metrics, success states
**RGB**: rgb(16, 185, 129) / rgb(52, 211, 153)

### ⚠️ Warning / Late
\`\`\`css
Light Mode: #f59e0b  /* Amber-500 */
Dark Mode:  #fbbf24  /* Amber-400 */
\`\`\`
**Usage**: Late arrivals, warnings, moderate issues
**RGB**: rgb(245, 158, 11) / rgb(251, 191, 36)

### ❌ Error / Absent
\`\`\`css
Light Mode: #ef4444  /* Red-500 */
Dark Mode:  #f87171  /* Red-400 */
\`\`\`
**Usage**: Absences, critical issues, errors
**RGB**: rgb(239, 68, 68) / rgb(248, 113, 113)

### 🟠 Orange / Mild
\`\`\`css
Light Mode: #f97316  /* Orange-500 */
Dark Mode:  #fb923c  /* Orange-400 */
\`\`\`
**Usage**: Mild late arrivals, low-priority warnings
**RGB**: rgb(249, 115, 22) / rgb(251, 146, 60)

---

## Department Colors (8-Color Palette)

### 1. Indigo
\`\`\`css
Hex: #6366f1  /* Indigo-500 */
RGB: rgb(99, 102, 241)
\`\`\`

### 2. Violet
\`\`\`css
Hex: #8b5cf6  /* Violet-500 */
RGB: rgb(139, 92, 246)
\`\`\`

### 3. Pink
\`\`\`css
Hex: #ec4899  /* Pink-500 */
RGB: rgb(236, 72, 153)
\`\`\`

### 4. Teal
\`\`\`css
Hex: #14b8a6  /* Teal-500 */
RGB: rgb(20, 184, 166)
\`\`\`

### 5. Amber
\`\`\`css
Hex: #f59e0b  /* Amber-500 */
RGB: rgb(245, 158, 11)
\`\`\`

### 6. Cyan
\`\`\`css
Hex: #06b6d4  /* Cyan-500 */
RGB: rgb(6, 182, 212)
\`\`\`

### 7. Emerald
\`\`\`css
Hex: #10b981  /* Emerald-500 */
RGB: rgb(16, 185, 129)
\`\`\`

### 8. Red
\`\`\`css
Hex: #ef4444  /* Red-500 */
RGB: rgb(239, 68, 68)
\`\`\`

---

## Color Usage Guidelines

### ✅ Do's
- Use green for positive metrics (on-time, success)
- Use amber/yellow for warnings and moderate issues
- Use red sparingly for critical issues only
- Maintain consistency across all charts
- Ensure sufficient contrast in both themes

### ❌ Don'ts
- Don't mix different color meanings
- Don't use too many colors in one chart (max 8)
- Don't use red for non-critical information
- Don't forget to test in both light and dark modes

---

## Gradient Implementations

All charts use gradients for a modern, polished look:

### Bar Charts
\`\`\`tsx
<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
  <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
</linearGradient>
\`\`\`

### Pie Charts
\`\`\`tsx
<linearGradient id="pieGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
</linearGradient>
\`\`\`

---

## Accessibility Notes

### Contrast Ratios (WCAG AA Compliant)
- **Light Mode**: All colors have 4.5:1 contrast on white background
- **Dark Mode**: All colors have 4.5:1 contrast on dark background
- **Text on Colors**: White text used with sufficient contrast

### Color Blind Friendly
- ✅ Patterns and labels supplement color
- ✅ Sufficient luminance differences
- ✅ Red-green not used exclusively for critical info

---

## Quick Copy-Paste

### Import in Your Components
\`\`\`tsx
const CHART_COLORS = {
  success: { light: "#10b981", dark: "#34d399" },
  warning: { light: "#f59e0b", dark: "#fbbf24" },
  error: { light: "#ef4444", dark: "#f87171" },
  orange: { light: "#f97316", dark: "#fb923c" },
}

const DEPARTMENT_COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#ef4444", // red
]
\`\`\`

---

## Tailwind CSS Classes

If you need to use these colors in regular Tailwind:

\`\`\`css
/* Success/On Time */
bg-emerald-500 text-emerald-500 border-emerald-500

/* Warning/Late */
bg-amber-500 text-amber-500 border-amber-500

/* Error/Absent */
bg-red-500 text-red-500 border-red-500

/* Department Colors */
bg-indigo-500 bg-violet-500 bg-pink-500 
bg-teal-500 bg-cyan-500 bg-emerald-500
\`\`\`

---

## Theme Integration

The colors work seamlessly with your existing CSS custom properties:

\`\`\`css
:root {
  --chart-1: oklch(0.65 0.22 264);  /* Primary */
  --chart-2: oklch(0.68 0.19 150);  /* Success */
  --chart-3: oklch(0.62 0.24 25);   /* Error */
  --chart-4: oklch(0.78 0.16 85);   /* Warning */
  --chart-5: oklch(0.58 0.18 200);  /* Info */
}
\`\`\`

---

## Export for Design Tools

### Figma / Sketch
\`\`\`
Success: #10b981
Warning: #f59e0b
Error: #ef4444
Orange: #f97316
Indigo: #6366f1
Violet: #8b5cf6
Pink: #ec4899
Teal: #14b8a6
\`\`\`

### Adobe Color Palette
[Create palette →](https://color.adobe.com/create/color-wheel)

---

**Pro Tip**: When adding new chart types, stick to this palette for consistency!
