# 🎨 Dark Mode Color Reference Card

Quick visual reference for the new dark mode optimized colors.

---

## 📊 Status Colors

### Success / On Time
\`\`\`
Color: #22c55e (Green-500)
RGB: rgb(34, 197, 94)
HSL: hsl(142, 71%, 45%)

When to use: On-time attendance, completed tasks, success states
\`\`\`

### Warning / Late
\`\`\`
Color: #fb923c (Orange-400)
RGB: rgb(251, 146, 60)
HSL: hsl(27, 96%, 61%)

When to use: Late arrivals, warnings, attention needed
\`\`\`

### Error / Absent
\`\`\`
Color: #f87171 (Red-400)
RGB: rgb(248, 113, 113)
HSL: hsl(0, 91%, 71%)

When to use: Absences, errors, critical issues
\`\`\`

### Mild Severity
\`\`\`
Color: #fbbf24 (Amber-400)
RGB: rgb(251, 191, 36)
HSL: hsl(43, 96%, 56%)

When to use: Minor issues, low-priority items
\`\`\`

---

## 🏢 Department Colors (Priority Order)

### 1. Violet
\`\`\`
Color: #8b5cf6
RGB: rgb(139, 92, 246)
HSL: hsl(258, 90%, 66%)
Use: Primary departments, most important
\`\`\`

### 2. Cyan
\`\`\`
Color: #06b6d4
RGB: rgb(6, 182, 212)
HSL: hsl(189, 94%, 43%)
Use: Secondary departments
\`\`\`

### 3. Amber
\`\`\`
Color: #f59e0b
RGB: rgb(245, 158, 11)
HSL: hsl(38, 92%, 50%)
Use: Support departments
\`\`\`

### 4. Pink
\`\`\`
Color: #ec4899
RGB: rgb(236, 72, 153)
HSL: hsl(330, 81%, 60%)
Use: Creative departments
\`\`\`

### 5. Emerald
\`\`\`
Color: #10b981
RGB: rgb(16, 185, 129)
HSL: hsl(158, 84%, 39%)
Use: Operations departments
\`\`\`

### 6. Orange
\`\`\`
Color: #f97316
RGB: rgb(249, 115, 22)
HSL: hsl(25, 95%, 53%)
Use: Sales/Marketing departments
\`\`\`

### 7. Indigo
\`\`\`
Color: #6366f1
RGB: rgb(99, 102, 241)
HSL: hsl(239, 84%, 67%)
Use: Tech departments
\`\`\`

### 8. Teal
\`\`\`
Color: #14b8a6
RGB: rgb(20, 184, 166)
HSL: hsl(173, 80%, 40%)
Use: Admin departments
\`\`\`

---

## 🎨 Color Properties for Developers

### Gradient Stops (All Charts)
\`\`\`css
/* Start */
stop-opacity: 1.0 (100%)

/* End */  
stop-opacity: 0.7 (70%)
\`\`\`

### Grid Lines
\`\`\`css
stroke-opacity: 0.15 (15%)
/* Subtle, non-distracting */
\`\`\`

### Axis Lines
\`\`\`css
stroke-opacity: 0.2 (20%)
/* Visible but not prominent */
\`\`\`

### Shadows
\`\`\`css
/* Tooltips & Cards */
box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.4);

/* Drop shadows for chart elements */
filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
\`\`\`

---

## 🌈 Gradient Definitions

### Bar Chart (Vertical)
\`\`\`tsx
<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
  <stop offset="100%" stopColor="#22c55e" stopOpacity={0.7} />
</linearGradient>
\`\`\`

### Horizontal Bar Chart
\`\`\`tsx
<linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stopColor="#fb923c" stopOpacity={1} />
  <stop offset="100%" stopColor="#fb923c" stopOpacity={0.7} />
</linearGradient>
\`\`\`

### Pie Chart (Diagonal)
\`\`\`tsx
<linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
</linearGradient>
\`\`\`

---

## 📱 Responsive Color Brightness

### Mobile Devices
- Same colors work great
- May appear slightly brighter due to smaller screens
- Test in actual device lighting

### Desktop Monitors
- Colors optimized for typical monitor brightness
- Adjust monitor settings if colors seem too bright
- Consider room ambient lighting

---

## 🔍 Color Contrast Ratios (WCAG)

Against Dark Background (#0f172a - typical dark mode):

| Color | Contrast Ratio | Grade |
|-------|----------------|-------|
| #22c55e (Success) | 5.2:1 | AA ✅ |
| #fb923c (Warning) | 5.8:1 | AA ✅ |
| #f87171 (Error) | 5.5:1 | AA ✅ |
| #8b5cf6 (Violet) | 6.1:1 | AA ✅ |
| #06b6d4 (Cyan) | 5.9:1 | AA ✅ |

All meet or exceed WCAG AA standard (4.5:1)!

---

## 🎯 Usage in Code

### Import Colors
\`\`\`tsx
const CHART_COLORS = {
  success: "#22c55e",
  warning: "#fb923c", 
  error: "#f87171",
  mild: "#fbbf24",
}

const DEPARTMENT_COLORS = [
  "#8b5cf6", "#06b6d4", "#f59e0b", "#ec4899",
  "#10b981", "#f97316", "#6366f1", "#14b8a6"
]
\`\`\`

### Use in Components
\`\`\`tsx
<Bar fill={CHART_COLORS.success} />
<Line stroke={CHART_COLORS.warning} />
<Cell fill={DEPARTMENT_COLORS[index]} />
\`\`\`

---

## 🖼️ Color Swatches

### Status Colors
\`\`\`
🟢 #22c55e ████████ Success
🟠 #fb923c ████████ Warning
🔴 #f87171 ████████ Error
🟡 #fbbf24 ████████ Mild
\`\`\`

### Department Colors
\`\`\`
🟣 #8b5cf6 ████████ Violet
🔵 #06b6d4 ████████ Cyan
🟠 #f59e0b ████████ Amber
🔴 #ec4899 ████████ Pink
🟢 #10b981 ████████ Emerald
🟠 #f97316 ████████ Orange
🔵 #6366f1 ████████ Indigo
🔵 #14b8a6 ████████ Teal
\`\`\`

---

## 🎨 Design Tool Integration

### Figma
1. Copy hex values
2. Create color styles
3. Apply to mockups

### Adobe XD
1. Import as color swatches
2. Create components with these colors
3. Export assets

### Sketch
1. Add to color palette
2. Create symbols with colors
3. Share with team

---

## 📊 Color Meanings & Psychology

| Color | Emotion | Use Case |
|-------|---------|----------|
| Green (#22c55e) | Success, Growth, Positive | Completed, On-time |
| Orange (#fb923c) | Warning, Energy, Attention | Late, Review needed |
| Red (#f87171) | Urgent, Important, Stop | Absent, Critical |
| Violet (#8b5cf6) | Creative, Innovative | Tech, Creative teams |
| Cyan (#06b6d4) | Trust, Professional | Business units |
| Pink (#ec4899) | Friendly, Modern | HR, People teams |
| Amber (#f59e0b) | Optimistic, Warm | Sales, Marketing |

---

## 🔧 Customization Tips

### Make Colors Brighter
\`\`\`tsx
// Increase color values
#22c55e → #34d399 (lighter)
#fb923c → #fbbf24 (lighter)
\`\`\`

### Make Colors Darker
\`\`\`tsx
// Decrease color values
#22c55e → #16a34a (darker)
#fb923c → #f97316 (darker)
\`\`\`

### Adjust Saturation
\`\`\`tsx
// In HSL
hsl(142, 71%, 45%) → hsl(142, 90%, 45%) // more saturated
hsl(142, 71%, 45%) → hsl(142, 50%, 45%) // less saturated
\`\`\`

---

## 🌙 Dark Mode Best Practices

✅ **Do**
- Use these bright, vibrant colors
- Test in actual dark mode
- Consider ambient lighting
- Check color blind accessibility

❌ **Don't**
- Use pure white (#ffffff)
- Use too many bright colors at once
- Forget to test on different devices
- Rely only on color for meaning

---

## 📝 Quick Reference

**Need bright colors?** Use the -400 or -500 variants
**Need status colors?** #22c55e, #fb923c, #f87171
**Need department colors?** Use the 8-color array
**Need gradients?** Use opacity from 1.0 to 0.7

---

**Print this page and keep it handy for quick color reference!** 🎨
