# 🛠️ Chart Customization Guide

Quick guide for customizing your redesigned charts.

---

## 📏 Adjust Chart Heights

### Current Heights
\`\`\`tsx
// Attendance Distribution
<ResponsiveContainer width="100%" height={320}>

// Attendance Trend  
<ResponsiveContainer width="100%" height={380}>

// Department Distribution
<ResponsiveContainer width="100%" height={380}>

// Late Arrivals
<ResponsiveContainer width="100%" height={400}>
\`\`\`

### To Change
Simply modify the `height` prop:
\`\`\`tsx
<ResponsiveContainer width="100%" height={500}> // Larger
<ResponsiveContainer width="100%" height={250}> // Smaller
\`\`\`

---

## 🎨 Change Colors

### Option 1: Edit Individual Chart Files
Find the color definitions in each file:

**attendance-chart.tsx**
\`\`\`tsx
const chartData = [
  { 
    name: "On Time", 
    lightColor: "#10b981", // Change this
    darkColor: "#34d399",  // And this
  },
  // ...
]
\`\`\`

**department-chart.tsx**
\`\`\`tsx
const COLORS = [
  "#6366f1", // Your custom color 1
  "#8b5cf6", // Your custom color 2
  // Add or remove colors as needed
]
\`\`\`

### Option 2: Create a Shared Color Config
Create `lib/chart-colors.ts`:
\`\`\`tsx
export const CHART_COLORS = {
  success: { light: "#10b981", dark: "#34d399" },
  warning: { light: "#f59e0b", dark: "#fbbf24" },
  error: { light: "#ef4444", dark: "#f87171" },
  orange: { light: "#f97316", dark: "#fb923c" },
}

export const DEPARTMENT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#14b8a6",
  "#f59e0b", "#06b6d4", "#10b981", "#ef4444",
]
\`\`\`

Then import in your chart files:
\`\`\`tsx
import { CHART_COLORS, DEPARTMENT_COLORS } from "@/lib/chart-colors"
\`\`\`

---

## 🔄 Change Default Collapse State

By default, all charts are expanded. To change:

\`\`\`tsx
// Current (expanded by default)
const [isExpanded, setIsExpanded] = useState(true)

// Collapsed by default
const [isExpanded, setIsExpanded] = useState(false)
\`\`\`

---

## 💾 Save Collapse State (LocalStorage)

To remember the user's preference:

\`\`\`tsx
const [isExpanded, setIsExpanded] = useState(() => {
  const saved = localStorage.getItem('attendance-chart-expanded')
  return saved !== null ? JSON.parse(saved) : true
})

useEffect(() => {
  localStorage.setItem('attendance-chart-expanded', JSON.stringify(isExpanded))
}, [isExpanded])
\`\`\`

Add at the top:
\`\`\`tsx
import { useEffect } from "react"
\`\`\`

---

## 📊 Adjust Bar Widths

### Bar Charts
\`\`\`tsx
// Current
<Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={100}>

// Wider bars
<Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={150}>

// Thinner bars
<Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={60}>
\`\`\`

---

## 🎯 Change Pie Chart Size

**department-chart.tsx**
\`\`\`tsx
// Current
<Pie
  outerRadius={130}  // Outer size
  innerRadius={60}   // Inner size (donut hole)
  // ...
>

// Larger donut
<Pie outerRadius={150} innerRadius={70}>

// Smaller donut
<Pie outerRadius={100} innerRadius={40}>

// Solid pie (no hole)
<Pie outerRadius={130} innerRadius={0}>
\`\`\`

---

## 📈 Line Thickness & Dot Size

**attendance-trend-chart.tsx**
\`\`\`tsx
// Current
<Line 
  type="monotone" 
  dataKey="On Time" 
  stroke="#10b981" 
  strokeWidth={3}           // Line thickness
  dot={{ r: 5, ... }}       // Dot radius (normal)
  activeDot={{ r: 7, ... }} // Dot radius (hover)
/>

// Thicker lines, bigger dots
<Line strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />

// Thinner lines, smaller dots
<Line strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />

// No dots
<Line dot={false} />
\`\`\`

---

## 🔢 Change Top N Late Arrivals

**late-arrival-chart.tsx**
\`\`\`tsx
// Current - Top 10
.slice(0, 10)

// Top 5
.slice(0, 5)

// Top 20
.slice(0, 20)

// All late employees (remove slice)
// .slice(0, 10) <- comment out or remove
\`\`\`

---

## 🎨 Customize Tooltip Styles

Find the Tooltip component and adjust:
\`\`\`tsx
<Tooltip
  contentStyle={{
    backgroundColor: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.75rem",        // Roundness
    color: "hsl(var(--popover-foreground))",
    boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.2)",
    padding: "12px 16px",           // Inner spacing
    fontSize: "14px",               // Text size
  }}
/>

// More rounded
borderRadius: "1rem"

// Square corners
borderRadius: "0.25rem"

// Bigger text
fontSize: "16px"
\`\`\`

---

## 🏷️ Customize Legends

### Remove Legend
Simply remove the `<Legend />` component or custom legend div.

### Reposition Legend
For recharts Legend component:
\`\`\`tsx
<Legend 
  verticalAlign="top"    // top, middle, bottom
  align="center"         // left, center, right
  height={36}
/>
\`\`\`

For custom legends (already implemented):
Just move the div to wherever you want in the component.

---

## 📐 Adjust Margins

\`\`\`tsx
// Current
margin={{ top: 20, right: 30, left: 10, bottom: 20 }}

// More space on right (for long labels)
margin={{ top: 20, right: 50, left: 10, bottom: 20 }}

// More space on left (for Y-axis labels)
margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
\`\`\`

---

## 🎭 Animation Speed

The collapse/expand animation:
\`\`\`css
// Current in components
className="... animate-in fade-in-0 slide-in-from-top-2 duration-300"

// Slower (500ms)
duration-500

// Faster (150ms)
duration-150

// No animation
// Remove the animate-in classes
\`\`\`

---

## 🌓 Force Light/Dark Colors

If you want specific colors regardless of theme:

### Current (Theme-aware)
\`\`\`tsx
lightColor: "#10b981",
darkColor: "#34d399",
\`\`\`

### Force Single Color
\`\`\`tsx
lightColor: "#10b981",
darkColor: "#10b981", // Same color for both themes
\`\`\`

Or directly in the fill:
\`\`\`tsx
<Cell fill="#10b981" /> // Always green
\`\`\`

---

## 🔤 Font Sizes

### Axis Labels
\`\`\`tsx
// Current
<XAxis fontSize={13} />
<YAxis fontSize={12} />

// Bigger
<XAxis fontSize={14} />
<YAxis fontSize={13} />
\`\`\`

### Titles
\`\`\`tsx
// Current
<CardTitle className="... text-2xl ...">

// Bigger
<CardTitle className="... text-3xl ...">

// Smaller
<CardTitle className="... text-xl ...">
\`\`\`

---

## 🎨 Add Background Patterns

For a more decorative look:

\`\`\`tsx
<Card className="... bg-gradient-to-br from-background to-muted/20">
\`\`\`

Or with patterns:
\`\`\`tsx
<Card style={{
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`,
}}>
\`\`\`

---

## 🎯 Quick Presets

### Minimal Style
- Remove shadows: `shadow-lg` → `shadow-none`
- Remove gradients: Use solid colors
- Reduce animations: `duration-300` → `duration-150`

### Bold Style
- Increase shadows: `shadow-lg` → `shadow-2xl`
- Brighter colors: Increase opacity
- Larger fonts: Increase all font sizes by 2px

### Compact Style
- Reduce heights: -50px to -100px
- Smaller fonts: -1px to -2px
- Tighter margins: Reduce all margins by 5-10px

---

## 🐛 Troubleshooting

### Colors Not Showing
1. Check CSS variables in `globals.css`
2. Verify hex colors are valid
3. Check for typos in color names

### Animation Lag
1. Reduce animation duration
2. Simplify gradients
3. Limit number of data points

### Overflow Issues
1. Adjust margins
2. Increase ResponsiveContainer height
3. Check parent container width

---

## 📚 Learn More

- [Recharts Documentation](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Need Help?** Check the `CHART_IMPROVEMENTS.md` file for more details!
