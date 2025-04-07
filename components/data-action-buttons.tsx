"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { ReportGenerator } from "@/components/report-generator"
import {
  Download,
  FileText,
  Share2,
  FileJson,
  FileSpreadsheet,
  FileSpreadsheetIcon as FileCsv,
  Mail,
  Link,
  Check,
  Printer,
} from "lucide-react"

interface DataActionButtonsProps {
  censusData: any
  fredData: any
  hudData: any
  countyComparisonData: any
  activeTab: string
  title?: string
  contentId?: string
  className?: string
}

export function DataActionButtons({
  censusData,
  fredData,
  hudData,
  countyComparisonData,
  activeTab,
  title = "Economic Data",
  contentId = "data-content",
  className = "",
}: DataActionButtonsProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [reportTitle, setReportTitle] = useState(title)
  const [reportNotes, setReportNotes] = useState("")
  const [shareUrl, setShareUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [emailSubject, setEmailSubject] = useState(`Shared Data: ${title}`)
  const [emailBody, setEmailBody] = useState("Here's the data I wanted to share with you.")

  // Handle export actions
  const handleExport = (format: "csv" | "json" | "excel") => {
    // In a real implementation, this would use the actual export functions
    // For now, we'll just show a toast notification
    toast({
      title: "Export Successful",
      description: `Your data has been exported as ${format.toUpperCase()}`,
    })
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Handle share via URL
  const handleShareViaUrl = () => {
    // In a real implementation, this would create a shareable URL
    setShareUrl("https://example.com/shared-data/abc123")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Link Copied",
      description: "Shareable link has been copied to clipboard",
    })
  }

  // Handle share via email
  const handleShareViaEmail = () => {
    // In a real implementation, this would open an email client
    setIsShareDialogOpen(false)
    toast({
      title: "Email Prepared",
      description: "Your email client should open with the data",
    })
  }

  let data
  switch (activeTab) {
    case "census":
      data = censusData
      break
    case "fred":
      data = fredData
      break
    case "hud":
      data = hudData
      break
    case "comparison":
      data = countyComparisonData
      break
    default:
      data = null
      break
  }

  return (
    <div className={`flex space-x-2 ${className}`}>
      {/* Export Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleExport("csv")}>
            <FileCsv className="mr-2 h-4 w-4" />
            <span>Export as CSV</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("json")}>
            <FileJson className="mr-2 h-4 w-4" />
            <span>Export as JSON</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExport("excel")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            <span>Export as Excel</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            <span>Print</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Report Button */}
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsReportDialogOpen(true)}>
        <FileText className="h-4 w-4" />
        <span>Report</span>
      </Button>

      {/* Share Button */}
      <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsShareDialogOpen(true)}>
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>

      {/* Report Generator Dialog */}
      <ReportGenerator
        data={data}
        title={title}
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
      />

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Data</DialogTitle>
            <DialogDescription>Share your data via link or email.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">Share Link</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>
            <TabsContent value="link" className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={shareUrl || "Click 'Generate Link' to create a shareable URL"}
                  readOnly
                  className="flex-1"
                />
                <Button size="sm" onClick={handleShareViaUrl} variant="outline">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Link className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Generate Link"}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This will create a link that contains the current data. Anyone with this link can view the data.
              </p>
            </TabsContent>
            <TabsContent value="email" className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email-subject" className="text-right">
                    Subject
                  </Label>
                  <Input
                    id="email-subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email-body" className="text-right">
                    Message
                  </Label>
                  <Textarea
                    id="email-body"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button onClick={handleShareViaEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Share via Email
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}

