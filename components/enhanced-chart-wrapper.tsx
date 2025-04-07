"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EnhancedChartWrapperProps {
  title: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function EnhancedChartWrapper({ title, children, className, icon }: EnhancedChartWrapperProps) {
  return (
    <Card className={cn("border-0 shadow-lg overflow-hidden", className)}>
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-4">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-800">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4">{children}</div>
      </CardContent>
    </Card>
  )
}

