"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { ReportGenerator } from "@/components/report-generator"

interface ReportGeneratorButtonProps {
  data?: any
  title?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ReportGeneratorButton({
  data = null,
  title = "Economic Data Report",
  variant = "outline",
  size = "default",
  className = "",
}: ReportGeneratorButtonProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={() => setIsReportDialogOpen(true)}
      >
        <FileText className="h-4 w-4" />
        <span>Generate Report</span>
      </Button>

      <ReportGenerator
        data={data}
        title={title}
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
      />
    </>
  )
}

