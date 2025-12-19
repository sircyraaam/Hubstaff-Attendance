# 📦 Charts Container - Show/Hide All Graphs

## What's New

I've created a **unified container** that wraps all your charts with a **single Show/Hide button** at the top!

---

## 🎯 Features

### Single Toggle Button
- **One button controls all charts** - No more individual collapse buttons
- **Clear labeling** - "Show Charts" or "Hide Charts"
- **Large, prominent button** - Easy to find and click
- **Icon + Text** - ChevronUp/ChevronDown with text label

### Beautiful Container Design
- 📊 **Icon badge** - BarChart3 icon in the header
- 🎨 **Gradient header** - Subtle primary color gradient
- 📝 **Title & Description** - Customizable header text
- 🎭 **Smooth animations** - 500ms fade-in/slide-in effect
- 💫 **Shadow effects** - Enhanced depth and professionalism

---

## 📁 File Structure

### New Component Created
```
components/
└── charts-container.tsx ✨ NEW!
```

### Updated Components
```
components/
├── attendance-chart.tsx ✅ (Removed individual toggle)
├── attendance-trend-chart.tsx ✅ (Removed individual toggle)
├── department-chart.tsx ✅ (Removed individual toggle)
├── late-arrival-chart.tsx ✅ (Removed individual toggle)

app/
└── page.tsx ✅ (Now uses ChartsContainer)
```

---

## 🎨 Visual Design

### Container Header
```
┌─────────────────────────────────────────────────────┐
│ 📊  Analytics & Insights            [Hide Charts ▲] │
│     Visualize attendance patterns and trends        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Chart 1]              [Chart 2]                  │
│                                                     │
│  [Chart 3 - Full Width]                            │
│                                                     │
│  [Chart 4 - Full Width]                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

When clicked:
```
┌─────────────────────────────────────────────────────┐
│ 📊  Analytics & Insights            [Show Charts ▼] │
│     Visualize attendance patterns and trends        │
└─────────────────────────────────────────────────────┘
```

---

## 💻 Usage

### In page.tsx
```tsx
<ChartsContainer
  title="Analytics & Insights"
  description="Visualize attendance patterns and trends"
>
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AttendanceChart employeeData={employeeData} />
      <DepartmentChart employeeData={employeeData} />
    </div>
    <AttendanceTrendChart employeeData={employeeData} />
    <LateArrivalChart employeeData={employeeData} />
  </div>
</ChartsContainer>
```

### Props
- `title` (optional) - Main heading text (default: "Analytics & Insights")
- `description` (optional) - Subtitle text (default: "Visualize attendance patterns and trends")
- `children` - The charts to display inside

---

## 🎨 Customization

### Change Title & Description
```tsx
<ChartsContainer
  title="Your Custom Title"
  description="Your custom description"
>
  {/* Charts */}
</ChartsContainer>
```

### Change Icon
Open `charts-container.tsx` and replace:
```tsx
<BarChart3 className="h-6 w-6 text-primary" />
```

With your preferred icon:
```tsx
<TrendingUp className="h-6 w-6 text-primary" />
<Activity className="h-6 w-6 text-primary" />
<PieChart className="h-6 w-6 text-primary" />
```

### Change Button Style
The button uses `variant="outline"` and `size="lg"`. Modify in `charts-container.tsx`:
```tsx
// Current
<Button variant="outline" size="lg">

// Try these
<Button variant="default" size="lg">   // Filled button
<Button variant="secondary" size="lg">  // Secondary style
<Button variant="ghost" size="lg">      // Minimal style
```

### Change Animation Speed
```tsx
// Current: 500ms
className="... duration-500"

// Faster
className="... duration-300"

// Slower
className="... duration-700"
```

### Default State
To start with charts hidden:
```tsx
// In charts-container.tsx, change:
const [isVisible, setIsVisible] = useState(true)

// To:
const [isVisible, setIsVisible] = useState(false)
```

---

## 🎯 Button Location

The **Show/Hide button** is located at the **top-right** of the container header, next to the title.

### Visual Location
```
┌─────────────────────────────────────────┐
│ 📊 Title                    [Button] ◄── HERE
│    Description                          │
└─────────────────────────────────────────┘
```

---

## 📱 Responsive Behavior

### Desktop
- Button shows full text: "Show Charts" / "Hide Charts"
- Container takes full width
- Charts display in grid layout

### Tablet
- Button text may wrap if space is tight
- Container remains full width
- Charts stack appropriately

### Mobile
- Button remains visible and functional
- Header stacks vertically if needed
- Charts display in single column

---

## 🎭 Animations

### Expand Animation
- **Fade in**: `fade-in-0`
- **Slide down**: `slide-in-from-top-4`
- **Duration**: 500ms
- **Easing**: Tailwind default

### Collapse Animation
- **Instant** - Content disappears immediately
- Smooth height transition handled by CSS

---

## 🎨 Styling Details

### Header Gradient
```css
bg-gradient-to-r from-primary/10 via-primary/5 to-transparent
```

### Icon Badge
- Size: 12x12 (3rem x 3rem)
- Rounded: `rounded-xl`
- Background: `bg-primary/10`
- Icon size: 6x6 (1.5rem x 1.5rem)

### Button
- Variant: `outline`
- Size: `lg`
- Shadow: `shadow-sm` → `shadow-md` on hover
- Gap: `gap-2` (between icon and text)
- Font: `font-semibold`

---

## 🔧 Advanced Customization

### Save State to localStorage
Add this to `charts-container.tsx`:

```tsx
const [isVisible, setIsVisible] = useState(() => {
  const saved = localStorage.getItem('charts-visible')
  return saved !== null ? JSON.parse(saved) : true
})

useEffect(() => {
  localStorage.setItem('charts-visible', JSON.stringify(isVisible))
}, [isVisible])
```

Don't forget to import useEffect:
```tsx
import { useState, useEffect } from "react"
```

### Add Chart Count
Show how many charts are inside:

```tsx
// Add this to the description
<p className="text-sm text-muted-foreground mt-0.5">
  {description} • {React.Children.count(children)} charts
</p>
```

### Add Loading State
```tsx
<ChartsContainer
  title="Analytics & Insights"
  description="Loading charts..."
  isLoading={isLoadingCharts}
>
  {/* Charts */}
</ChartsContainer>
```

Then in the component:
```tsx
{isLoading ? (
  <div className="flex items-center justify-center p-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
) : isVisible && children}
```

---

## 🎉 Benefits

### User Experience
- ✅ **Single click** to hide all charts
- ✅ **Clear button** - easy to find
- ✅ **Fast** - instant response
- ✅ **Intuitive** - familiar pattern

### Developer Experience
- ✅ **Simple implementation** - wrap and done
- ✅ **Reusable** - use anywhere
- ✅ **Customizable** - easy to modify
- ✅ **Clean code** - no repetition

### Performance
- ✅ **Fast rendering** - charts unmount when hidden
- ✅ **Memory efficient** - reduced DOM when collapsed
- ✅ **Smooth animations** - CSS-based

---

## 🐛 Troubleshooting

### Button Not Showing
1. Check that `ChartsContainer` is imported
2. Verify Lucide React icons are installed
3. Check for console errors

### Charts Not Hiding
1. Verify `isVisible` state is working
2. Check conditional rendering: `{isVisible && children}`
3. Look for CSS conflicts

### Animation Issues
1. Ensure Tailwind animate plugin is configured
2. Check `tailwind.config.js` for animation classes
3. Try reducing duration for smoother effect

---

## 📚 Related Files

- `components/charts-container.tsx` - Main container component
- `app/page.tsx` - Implementation example
- All chart components - Now work inside container

---

## 🎯 Summary

You now have a **beautiful container box** with a **prominent Show/Hide button** that controls ALL your charts at once!

### Key Features:
- 📦 Single container for all charts
- 🔘 One button controls everything
- 🎨 Beautiful gradient header with icon
- ⚡ Smooth animations
- 📱 Fully responsive
- 🛠️ Easy to customize

**Look for the button in the top-right corner of the "Analytics & Insights" section!** 🎉

---

*Made with ❤️ for a better user experience*
