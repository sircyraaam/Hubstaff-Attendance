"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, BarChart3 } from "lucide-react"
import type { EmployeeData } from "@/lib/types"

interface ChartsContainerProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function ChartsContainer({ 
  children, 
  title = "Analytics & Insights",
  description = "Visualize attendance patterns and trends"
}: ChartsContainerProps) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <Card className="border-border/50 shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setIsVisible(!isVisible)}
            variant="outline"
            size="lg"
            className="gap-2 font-semibold shadow-sm hover:shadow-md transition-all"
          >
            {isVisible ? (
              <>
                <ChevronUp className="h-5 w-5" />
                Hide Charts
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5" />
                Show Charts
              </>
            )}
          </Button>
        </div>
      </div>

      {isVisible && (
        <CardContent className="p-6 animate-in fade-in-0 slide-in-from-top-4 duration-500">
          {children}
        </CardContent>
      )}
    </Card>
  )
}
