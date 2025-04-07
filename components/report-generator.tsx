"use client"

import { useState, useRef, useEffect } from "react"
import {
  FileText,
  Download,
  Plus,
  Trash2,
  Image,
  BarChart4,
  LineChart,
  PieChart,
  Table2,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import dynamic from "next/dynamic"

// Dynamically import jsPDF with no SSR to avoid issues
const jsPDF = dynamic(() => import("jspdf").then((mod) => mod.default), { ssr: false })
// Dynamically import jspdf-autotable with no SSR
const autoTable = dynamic(() => import("jspdf-autotable").then((mod) => mod.default), { ssr: false })

interface ReportGeneratorProps {
  data?: any
  title?: string
  onClose: () => void
  open: boolean
}

export function ReportGenerator({ data = {}, title = "Economic Data Report", onClose, open }: ReportGeneratorProps) {
  const [reportTitle, setReportTitle] = useState(title)
  const [reportSubtitle, setReportSubtitle] = useState("Generated Report")
  const [reportDescription, setReportDescription] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorTitle, setAuthorTitle] = useState("")
  const [includeDate, setIncludeDate] = useState(true)
  const [includePageNumbers, setIncludePageNumbers] = useState(true)
  const [includeTableOfContents, setIncludeTableOfContents] = useState(true)
  const [includeExecutiveSummary, setIncludeExecutiveSummary] = useState(true)
  const [executiveSummary, setExecutiveSummary] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const [selectedColorScheme, setSelectedColorScheme] = useState("blue")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(false)
  const [includeMethodology, setIncludeMethodology] = useState(true)
  const [methodology, setMethodology] = useState(
    "Data was collected from the U.S. Census Bureau, Federal Reserve Economic Data (FRED), and the Department of Housing and Urban Development (HUD).",
  )
  const [sections, setSections] = useState([
    { title: "Introduction", content: "This report provides an analysis of economic data.", include: true },
    { title: "Key Findings", content: "The analysis reveals several important trends.", include: true },
    { title: "Data Analysis", content: "Detailed analysis of the collected data.", include: true },
    { title: "Conclusions", content: "Based on the data, we can conclude the following.", include: true },
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [jsPdfLoaded, setJsPdfLoaded] = useState(false)

  // Reference for the report preview
  const reportPreviewRef = useRef<HTMLDivElement>(null)

  // Check if jsPDF is loaded
  useEffect(() => {
    if (typeof jsPDF !== "undefined") {
      setJsPdfLoaded(true)
    }
  }, [])

  // Handle adding a new section
  const addSection = () => {
    setSections([
      ...sections,
      {
        title: `Section ${sections.length + 1}`,
        content: "Enter section content here.",
        include: true,
      },
    ])
  }

  // Handle removing a section
  const removeSection = (index: number) => {
    const newSections = [...sections]
    newSections.splice(index, 1)
    setSections(newSections)
  }

  // Handle updating a section
  const updateSection = (index: number, field: "title" | "content" | "include", value: string | boolean) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setSections(newSections)
  }

  // Generate executive summary based on data
  const generateExecutiveSummary = () => {
    let summary = "This report analyzes economic data from multiple sources to identify key trends and insights."

    // Add data-specific summary content based on actual data
    if (data?.type === "census" || data?.censusData) {
      const censusData = data?.type === "census" ? data?.data : data?.censusData
      if (censusData && Array.isArray(censusData) && censusData.length > 0) {
        const years = censusData
          .map((d) => d.year)
          .filter(Boolean)
          .join(", ")
        summary += `\n\nThe Census data for ${years || "the selected period"} reveals demographic patterns and housing characteristics that are critical for understanding local communities and planning economic development initiatives.`

        // Add specific insights if available
        const latestData = censusData[censusData.length - 1]
        if (latestData && latestData.variables) {
          const popVar = latestData.variables.find(
            (v: any) => v.name?.includes("Population") || v.code === "B01003_001E",
          )

          if (popVar) {
            summary += `\n\nThe population data shows ${popVar.formattedValue || popVar.value || "demographic information"} for the selected area, which can inform community planning and resource allocation.`
          }

          const housingVar = latestData.variables.find(
            (v: any) => v.name?.includes("Housing") || v.code?.includes("B25"),
          )

          if (housingVar) {
            summary += `\n\nHousing data indicates patterns in occupancy and ownership that impact community stability and economic mobility.`
          }
        }
      } else {
        summary +=
          "\n\nThe Census data reveals demographic patterns and housing characteristics that are critical for understanding local communities and planning economic development initiatives."
      }
    } else if (data?.type === "fred" || data?.fredData) {
      const fredData = data?.type === "fred" ? data?.data : data?.fredData
      if (fredData && Array.isArray(fredData) && fredData.length > 0) {
        const years = fredData
          .map((d) => d.year)
          .filter(Boolean)
          .join(", ")
        summary += `\n\nThe FRED economic indicators for ${years || "the selected period"} show important macroeconomic trends that impact policy decisions and business strategies.`

        // Add specific insights if available
        if (fredData.length > 1) {
          summary +=
            "\n\nYear-over-year comparison of economic indicators reveals patterns that can inform fiscal and monetary policy decisions."
        }
      } else {
        summary +=
          "\n\nThe FRED economic indicators show important macroeconomic trends that impact policy decisions and business strategies."
      }
    } else if (data?.type === "hud" || data?.hudData) {
      const hudData = data?.type === "hud" ? data?.data : data?.hudData
      if (hudData && hudData.variables && hudData.variables.length > 0) {
        summary += `\n\nHUD housing data for ${hudData.stateName || hudData.countyName || "the selected area"} demonstrates the current state of housing affordability, availability, and potential areas for housing development or intervention.`

        // Add specific insights if available
        const fmrVars = hudData.variables.filter((v: any) => v.name?.includes("FMR") || v.code?.includes("fmr"))

        if (fmrVars.length > 0) {
          summary +=
            "\n\nFair Market Rent data provides insights into housing costs across different unit sizes, which is essential for understanding affordability challenges."
        }
      } else {
        summary +=
          "\n\nHUD housing data demonstrates the current state of housing affordability, availability, and potential areas for housing development or intervention."
      }
    } else if (data?.type === "comparison" || data?.comparisonData) {
      const comparisonData = data?.type === "comparison" ? data?.data : data?.comparisonData
      if (comparisonData && comparisonData.counties && comparisonData.counties.length > 0) {
        const counties = comparisonData.counties.filter((c: any) => c.data)
        if (counties.length > 1) {
          const countyNames = counties
            .map((c: any) => c.countyName)
            .filter(Boolean)
            .join(", ")
          summary += `\n\nThe county comparison analysis between ${countyNames || "the selected counties"} highlights significant differences and similarities between regions, which can inform targeted economic development and resource allocation strategies.`
        } else if (counties.length === 1) {
          summary += `\n\nThe analysis of ${counties[0].countyName || "the selected county"} provides insights into local economic conditions and demographic characteristics.`
        } else {
          summary +=
            "\n\nThe county comparison analysis highlights significant differences and similarities between regions, which can inform targeted economic development and resource allocation strategies."
        }
      } else {
        summary +=
          "\n\nThe county comparison analysis highlights significant differences and similarities between regions, which can inform targeted economic development and resource allocation strategies."
      }
    } else if (data?.type === "visualization") {
      summary +=
        "\n\nMultiple data sources have been visualized to identify correlations and trends that might not be apparent when looking at individual data sets in isolation."
    }

    // Add concluding statement
    summary +=
      "\n\nThe key findings presented in this report can guide decision-making processes for policymakers, businesses, and community organizations seeking to address local economic challenges and opportunities."

    return summary
  }

  // Handle generating the report
  const handleGenerateReport = () => {
    setIsGenerating(true)

    // Generate data-specific section content
    const updatedSections = [...sections]

    // Update Introduction section
    const introIndex = updatedSections.findIndex((s) => s.title === "Introduction")
    if (introIndex !== -1) {
      let introContent = "This report provides an analysis of economic data"

      if (data?.type === "census" || data?.censusData) {
        const censusData = data?.type === "census" ? data?.data : data?.censusData
        if (censusData && Array.isArray(censusData) && censusData.length > 0) {
          const years = censusData
            .map((d) => d.year)
            .filter(Boolean)
            .join(", ")
          introContent += ` from the U.S. Census Bureau for ${years || "the selected period"}`
        } else {
          introContent += " from the U.S. Census Bureau"
        }
      } else if (data?.type === "fred" || data?.fredData) {
        const fredData = data?.type === "fred" ? data?.data : data?.fredData
        if (fredData && Array.isArray(fredData) && fredData.length > 0) {
          const years = fredData
            .map((d) => d.year)
            .filter(Boolean)
            .join(", ")
          introContent += ` from the Federal Reserve Economic Data (FRED) for ${years || "the selected period"}`
        } else {
          introContent += " from the Federal Reserve Economic Data (FRED)"
        }
      } else if (data?.type === "hud" || data?.hudData) {
        const hudData = data?.type === "hud" ? data?.data : data?.hudData
        if (hudData) {
          introContent += ` from the Department of Housing and Urban Development (HUD) for ${hudData.stateName || hudData.countyName || "the selected area"}`
        } else {
          introContent += " from the Department of Housing and Urban Development (HUD)"
        }
      } else if (data?.type === "comparison" || data?.comparisonData) {
        const comparisonData = data?.type === "comparison" ? data?.data : data?.comparisonData
        if (comparisonData && comparisonData.counties && comparisonData.counties.length > 0) {
          const counties = comparisonData.counties.filter((c: any) => c.data)
          if (counties.length > 0) {
            const countyNames = counties
              .map((c: any) => c.countyName)
              .filter(Boolean)
              .join(", ")
            introContent += ` comparing data from ${countyNames || "the selected counties"}`
          } else {
            introContent += " comparing data from selected counties"
          }
        } else {
          introContent += " comparing data from selected counties"
        }
      } else if (data?.type === "visualization") {
        introContent += " using multiple data sources to identify correlations and trends"
      }

      updatedSections[introIndex].content = introContent + "."
    }

    setSections(updatedSections)

    // Generate executive summary if not provided
    if (!executiveSummary) {
      setExecutiveSummary(generateExecutiveSummary())
    }

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      setPreviewOpen(true)

      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      })
    }, 1000)
  }

  // Generate Census observations
  const generateCensusObservations = (censusData: any[]) => {
    const observations = []

    try {
      // Check if we have data from multiple years to compare
      if (censusData.length > 1) {
        // Sort data by year
        const sortedData = [...censusData].sort((a, b) => {
          const yearA = Number.parseInt(a.year) || 0
          const yearB = Number.parseInt(b.year) || 0
          return yearA - yearB
        })

        const oldestYear = sortedData[0]
        const newestYear = sortedData[sortedData.length - 1]

        // Compare population if available
        const oldestPopVar = oldestYear.variables?.find(
          (v: any) => v.name?.includes("Population") || v.code === "B01003_001E",
        )

        const newestPopVar = newestYear.variables?.find(
          (v: any) => v.name?.includes("Population") || v.code === "B01003_001E",
        )

        if (oldestPopVar && newestPopVar) {
          const oldPop = Number.parseFloat(oldestPopVar.value) || 0
          const newPop = Number.parseFloat(newestPopVar.value) || 0

          if (oldPop > 0 && newPop > 0) {
            const change = ((newPop - oldPop) / oldPop) * 100
            const direction = change > 0 ? "increased" : "decreased"

            observations.push(
              `The population has ${direction} by approximately ${Math.abs(change).toFixed(1)}% from ${oldestYear.year} to ${newestYear.year}.`,
            )
          }
        }

        // Compare median income if available
        const oldestIncomeVar = oldestYear.variables?.find(
          (v: any) => v.name?.includes("Median Household Income") || v.code === "B19013_001E",
        )

        const newestIncomeVar = newestYear.variables?.find(
          (v: any) => v.name?.includes("Median Household Income") || v.code === "B19013_001E",
        )

        if (oldestIncomeVar && newestIncomeVar) {
          const oldIncome = Number.parseFloat(oldestIncomeVar.value) || 0
          const newIncome = Number.parseFloat(newestIncomeVar.value) || 0

          if (oldIncome > 0 && newIncome > 0) {
            const change = ((newIncome - oldIncome) / oldIncome) * 100
            const direction = change > 0 ? "increased" : "decreased"

            observations.push(
              `The median household income has ${direction} by approximately ${Math.abs(change).toFixed(1)}% from ${oldestYear.year} to ${newestYear.year}.`,
            )
          }
        }
      }

      // Add observations about the most recent data
      const latestData = censusData[censusData.length - 1]
      if (latestData && latestData.variables) {
        // Check population distribution
        const totalPop = latestData.variables.find(
          (v: any) => v.name?.includes("Total Population") || v.code === "B01003_001E",
        )
        const under18 = latestData.variables.find(
          (v: any) => v.name?.includes("Population Age 0-17") || v.code === "B09001_001E",
        )

        if (totalPop && under18) {
          const total = Number.parseFloat(totalPop.value) || 0
          const youth = Number.parseFloat(under18.value) || 0

          if (total > 0 && youth > 0) {
            const percentage = (youth / total) * 100
            observations.push(
              `Youth under 18 constitute approximately ${percentage.toFixed(1)}% of the total population in ${latestData.year}.`,
            )
          }
        }

        // Check housing occupancy
        const totalUnits = latestData.variables.find(
          (v: any) => v.name?.includes("Total Housing Units") || v.code === "B25001_001E",
        )
        const ownerOccupied = latestData.variables.find(
          (v: any) => v.name?.includes("Owner Occupied") || v.code === "B25003_002E",
        )

        if (totalUnits && ownerOccupied) {
          const total = Number.parseFloat(totalUnits.value) || 0
          const owned = Number.parseFloat(ownerOccupied.value) || 0

          if (total > 0 && owned > 0) {
            const percentage = (owned / total) * 100
            observations.push(
              `Approximately ${percentage.toFixed(1)}% of housing units are owner-occupied in ${latestData.year}.`,
            )
          }
        }
      }

      // Add a general observation if we don't have specific ones
      if (observations.length === 0) {
        observations.push(
          "The data shows demographic and economic patterns that require further analysis in the context of local conditions.",
        )
        observations.push(
          "Year-over-year comparison suggests changes in population and housing characteristics that may impact economic development strategies.",
        )
      }
    } catch (error) {
      console.error("Error generating Census observations:", error)
      observations.push(
        "The Census data contains demographic and housing information that can inform community planning decisions.",
      )
    }

    return observations
  }

  // Generate FRED observations
  const generateFredObservations = (fredData: any[]) => {
    const observations = []

    try {
      // Check if we have data from multiple years to compare
      if (fredData.length > 1) {
        // Sort data by year
        const sortedData = [...fredData].sort((a, b) => {
          const yearA = Number.parseInt(a.year) || 0
          const yearB = Number.parseInt(b.year) || 0
          return yearA - yearB
        })

        const oldestYear = sortedData[0]
        const newestYear = sortedData[sortedData.length - 1]

        // Compare GDP if available
        const oldestGDPVar = oldestYear.variables?.find(
          (v: any) => v.name?.includes("GDP") || v.code === "GDPC1" || v.code === "GDP",
        )

        const newestGDPVar = newestYear.variables?.find(
          (v: any) => v.name?.includes("GDP") || v.code === "GDPC1" || v.code === "GDP",
        )

        if (oldestGDPVar && newestGDPVar) {
          const oldGDP = Number.parseFloat(oldestGDPVar.value) || 0
          const newGDP = Number.parseFloat(newestGDPVar.value) || 0

          if (oldGDP > 0 && newGDP > 0) {
            const change = ((newGDP - oldGDP) / oldGDP) * 100
            const direction = change > 0 ? "increased" : "decreased"

            observations.push(
              `The GDP has ${direction} by approximately ${Math.abs(change).toFixed(1)}% from ${oldestYear.year} to ${newestYear.year}.`,
            )
          }
        }

        // Compare unemployment rate if available
        const oldestUnempVar = oldestYear.variables?.find(
          (v: any) => v.name?.includes("Unemployment Rate") || v.code === "UNRATE",
        )

        const newestUnempVar = newestYear.variables?.find(
          (v: any) => v.name?.includes("Unemployment Rate") || v.code === "UNRATE",
        )

        if (oldestUnempVar && newestUnempVar) {
          const oldRate = Number.parseFloat(oldestUnempVar.value) || 0
          const newRate = Number.parseFloat(newestUnempVar.value) || 0

          if (oldRate > 0 && newRate > 0) {
            const change = newRate - oldRate
            const direction = change > 0 ? "increased" : "decreased"

            observations.push(
              `The unemployment rate has ${direction} by ${Math.abs(change).toFixed(1)} percentage points from ${oldestYear.year} to ${newestYear.year}.`,
            )
          }
        }
      }

      // Add a general observation if we don't have specific ones
      if (observations.length === 0) {
        observations.push(
          "The FRED economic indicators reveal trends that should be considered in context of broader economic conditions.",
        )
        observations.push(
          "Year-over-year economic data suggests patterns that may impact local business conditions and household financial stability.",
        )
      }
    } catch (error) {
      console.error("Error generating FRED observations:", error)
      observations.push(
        "The FRED data contains valuable economic indicators that can inform monetary and fiscal policy decisions.",
      )
    }

    return observations
  }

  // Generate HUD observations
  const generateHudObservations = (hudData: any) => {
    const observations = []

    try {
      const variables = hudData.variables || []

      // Look for Fair Market Rents
      const fmrVariables = variables.filter((v: any) => v.name?.includes("FMR") || v.code?.includes("fmr"))

      if (fmrVariables.length > 0) {
        // Compare studio to 2BR
        const studioFMR = fmrVariables.find((v: any) => v.name?.includes("0 Bedroom") || v.code === "0br_fmr")
        const twoBRFMR = fmrVariables.find((v: any) => v.name?.includes("2 Bedroom") || v.code === "2br_fmr")

        if (studioFMR && twoBRFMR) {
          const studioValue = Number.parseFloat(studioFMR.value) || 0
          const twoBRValue = Number.parseFloat(twoBRFMR.value) || 0

          if (studioValue > 0 && twoBRValue > 0) {
            const difference = twoBRValue - studioValue
            const ratio = twoBRValue / studioValue

            observations.push(
              `The Fair Market Rent for a 2-bedroom unit is $${difference.toFixed(0)} (${(ratio * 100 - 100).toFixed(1)}%) higher than a studio apartment.`,
            )
          }
        }
      }

      // Add a general observation if we don't have specific ones
      if (observations.length === 0) {
        observations.push(
          "The HUD housing data provides insights into housing affordability and availability within the region.",
        )
        observations.push(
          "Fair Market Rents and income limits suggest housing cost burdens that may affect different household types.",
        )
      }
    } catch (error) {
      console.error("Error generating HUD observations:", error)
      observations.push(
        "The HUD data contains housing affordability metrics that can inform housing policy and assistance program design.",
      )
    }

    return observations
  }

  // Generate comparison observations
  const generateComparisonObservations = (counties: any[]) => {
    const observations = []

    try {
      if (counties.length < 2) return ["Insufficient data for comparison."]

      const county1 = counties[0]
      const county2 = counties[1]

      // Compare population if available
      const pop1 = county1.data?.variables.find(
        (v: any) => v.name?.includes("Total Population") || v.code === "B01003_001E",
      )
      const pop2 = county2.data?.variables.find(
        (v: any) => v.name?.includes("Total Population") || v.code === "B01003_001E",
      )

      if (pop1 && pop2) {
        const pop1Val = Number.parseFloat(pop1.value) || 0
        const pop2Val = Number.parseFloat(pop2.value) || 0

        if (pop1Val > 0 && pop2Val > 0) {
          const larger = pop1Val > pop2Val ? county1.countyName : county2.countyName
          const smaller = pop1Val <= pop2Val ? county1.countyName : county2.countyName
          const ratio = Math.max(pop1Val, pop2Val) / Math.min(pop1Val, pop2Val)

          observations.push(`${larger} has approximately ${ratio.toFixed(1)} times the population of ${smaller}.`)
        }
      }

      // Add a general observation if we don't have specific ones
      if (observations.length === 0) {
        observations.push(
          `The comparison between ${county1.countyName} and ${county2.countyName} reveals economic and demographic differences that may influence development strategies.`,
        )
      }
    } catch (error) {
      console.error("Error generating comparison observations:", error)
      observations.push("The county comparison data shows demographic and economic differences between regions.")
    }

    return observations
  }

  // Handle downloading the report
  const handleDownloadReport = async () => {
    if (!jsPdfLoaded) {
      toast({
        title: "Error",
        description: "PDF generation library is not loaded yet. Please try again in a moment.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Set colors based on selected color scheme
      const colors = {
        blue: { primary: "#1a56db", secondary: "#2563eb", text: "#333333" },
        green: { primary: "#059669", secondary: "#10b981", text: "#333333" },
        purple: { primary: "#7c3aed", secondary: "#8b5cf6", text: "#333333" },
        red: { primary: "#dc2626", secondary: "#ef4444", text: "#333333" },
        gray: { primary: "#4b5563", secondary: "#6b7280", text: "#333333" },
      }

      const colorScheme = colors[selectedColorScheme as keyof typeof colors] || colors.blue

      // Add cover page
      doc.setFontSize(24)
      doc.setTextColor(colorScheme.primary)
      doc.text(reportTitle, doc.internal.pageSize.getWidth() / 2, 40, { align: "center" })

      doc.setFontSize(16)
      doc.setTextColor(colorScheme.secondary)
      doc.text(reportSubtitle, doc.internal.pageSize.getWidth() / 2, 50, { align: "center" })

      if (includeDate) {
        doc.setFontSize(12)
        doc.setTextColor(100, 100, 100)
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, doc.internal.pageSize.getWidth() / 2, 60, {
          align: "center",
        })
      }

      if (authorName || authorTitle) {
        doc.setFontSize(12)
        doc.setTextColor(colorScheme.text)
        let yPos = 80

        if (authorName) {
          doc.text(`Prepared by: ${authorName}`, doc.internal.pageSize.getWidth() / 2, yPos, { align: "center" })
          yPos += 7
        }

        if (authorTitle) {
          doc.text(authorTitle, doc.internal.pageSize.getWidth() / 2, yPos, { align: "center" })
        }
      }

      // Add table of contents if enabled
      if (includeTableOfContents) {
        doc.addPage()
        doc.setFontSize(18)
        doc.setTextColor(colorScheme.primary)
        doc.text("Table of Contents", 20, 20)

        let yPos = 35
        let pageNum = 3 // Start with page 3 (cover, TOC, then content)

        if (includeExecutiveSummary) {
          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text("Executive Summary", 20, yPos)
          doc.text(pageNum.toString(), 180, yPos, { align: "right" })
          yPos += 10
          pageNum++
        }

        doc.text("Data Analysis", 20, yPos)
        doc.text(pageNum.toString(), 180, yPos, { align: "right" })
        yPos += 10
        pageNum++

        doc.text("Visualizations Overview", 20, yPos)
        doc.text(pageNum.toString(), 180, yPos, { align: "right" })
        yPos += 10
        pageNum++

        doc.text("Key Findings", 20, yPos)
        doc.text(pageNum.toString(), 180, yPos, { align: "right" })
        yPos += 10
        pageNum++

        if (includeMethodology) {
          doc.text("Methodology", 20, yPos)
          doc.text(pageNum.toString(), 180, yPos, { align: "right" })
          yPos += 10
          pageNum++
        }

        sections
          .filter((s) => s.include)
          .forEach((section) => {
            doc.text(section.title, 20, yPos)
            doc.text(pageNum.toString(), 180, yPos, { align: "right" })
            yPos += 10
            pageNum++
          })

        doc.text("Conclusion", 20, yPos)
        doc.text(pageNum.toString(), 180, yPos, { align: "right" })
      }

      // Add executive summary if enabled
      if (includeExecutiveSummary) {
        doc.addPage()
        doc.setFontSize(18)
        doc.setTextColor(colorScheme.primary)
        doc.text("Executive Summary", 20, 20)

        doc.setFontSize(12)
        doc.setTextColor(colorScheme.text)
        const summary = executiveSummary || generateExecutiveSummary()
        const splitSummary = doc.splitTextToSize(summary, 170)
        doc.text(splitSummary, 20, 35)
      }

      // Add data analysis
      doc.addPage()
      doc.setFontSize(18)
      doc.setTextColor(colorScheme.primary)
      doc.text("Data Analysis", 20, 20)

      doc.setFontSize(12)
      doc.setTextColor(colorScheme.text)
      doc.text(
        "The following analysis examines the economic data collected from various sources, identifying trends, patterns, and significant findings.",
        20,
        35,
      )

      let yPos = 50

      // Add source-specific analysis
      if (data?.type === "census" || data?.censusData) {
        const censusData = data?.type === "census" ? data?.data : data?.censusData
        if (censusData && Array.isArray(censusData)) {
          doc.setFontSize(16)
          doc.setTextColor(colorScheme.secondary)
          doc.text("Census Bureau Data Analysis", 20, yPos)
          yPos += 10

          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text(`Analysis based on ${censusData.length} years of Census Bureau data.`, 20, yPos)
          yPos += 15

          // Add census data table
          if (includeTables) {
            // Find common variables across all years
            const allVariables = new Set<string>()
            censusData.forEach((yearData: any) => {
              if (yearData.variables && Array.isArray(yearData.variables)) {
                yearData.variables.forEach((v: any) => {
                  if (v.name) allVariables.add(v.name)
                })
              }
            })

            // Prepare table data
            const tableData = Array.from(allVariables)
              .slice(0, 10)
              .map((variableName) => {
                const row = [variableName]

                // Add values for each year
                censusData.forEach((yearData: any) => {
                  const variable = yearData.variables?.find((v: any) => v.name === variableName)
                  const value = variable ? variable.value || variable.formattedValue || "N/A" : "N/A"
                  row.push(value)
                })

                return row
              })

            // Create table headers
            const tableHeaders = ["Variable"]
            censusData.forEach((yearData: any) => {
              tableHeaders.push(yearData.year)
            })

            // Add the table to the PDF
            autoTable(doc, {
              head: [tableHeaders],
              body: tableData,
              startY: yPos,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 },
              headStyles: { fillColor: [colorScheme.primary.replace("#", "")], textColor: [255, 255, 255] },
            })

            yPos = (doc as any).lastAutoTable.finalY + 10
          }

          // Add census observations
          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text("Key observations from Census data:", 20, yPos)
          yPos += 10

          const observations = generateCensusObservations(censusData)
          observations.forEach((obs, index) => {
            const splitObs = doc.splitTextToSize(`${index + 1}. ${obs}`, 170)
            doc.text(splitObs, 25, yPos)
            yPos += splitObs.length * 7
          })

          yPos += 10
        }
      }

      if (data?.type === "fred" || data?.fredData) {
        const fredData = data?.type === "fred" ? data?.data : data?.fredData
        if (fredData && Array.isArray(fredData)) {
          // Check if we need a new page
          if (yPos > 230) {
            doc.addPage()
            yPos = 20
          }

          doc.setFontSize(16)
          doc.setTextColor(colorScheme.secondary)
          doc.text("FRED Economic Data Analysis", 20, yPos)
          yPos += 10

          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text(`Analysis based on ${fredData.length} years of FRED economic indicators.`, 20, yPos)
          yPos += 15

          // Add FRED data table
          if (includeTables) {
            // Find common variables across all years
            const allVariables = new Set<string>()
            fredData.forEach((yearData: any) => {
              if (yearData.variables && Array.isArray(yearData.variables)) {
                yearData.variables.forEach((v: any) => {
                  if (v.name) allVariables.add(v.name)
                })
              }
            })

            // Prepare table data
            const tableData = Array.from(allVariables)
              .slice(0, 10)
              .map((variableName) => {
                const row = [variableName]

                // Add values for each year
                fredData.forEach((yearData: any) => {
                  const variable = yearData.variables?.find((v: any) => v.name === variableName)
                  const value = variable ? variable.value || variable.formattedValue || "N/A" : "N/A"
                  row.push(value)
                })

                return row
              })

            // Create table headers
            const tableHeaders = ["Indicator"]
            fredData.forEach((yearData: any) => {
              tableHeaders.push(yearData.year)
            })

            // Add the table to the PDF
            autoTable(doc, {
              head: [tableHeaders],
              body: tableData,
              startY: yPos,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 },
              headStyles: { fillColor: [colorScheme.primary.replace("#", "")], textColor: [255, 255, 255] },
            })

            yPos = (doc as any).lastAutoTable.finalY + 10
          }

          // Add FRED observations
          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text("Key observations from FRED economic data:", 20, yPos)
          yPos += 10

          const observations = generateFredObservations(fredData)
          observations.forEach((obs, index) => {
            const splitObs = doc.splitTextToSize(`${index + 1}. ${obs}`, 170)
            doc.text(splitObs, 25, yPos)
            yPos += splitObs.length * 7
          })

          yPos += 10
        }
      }

      if (data?.type === "hud" || data?.hudData) {
        const hudData = data?.type === "hud" ? data?.data : data?.hudData
        if (hudData && hudData.variables) {
          // Check if we need a new page
          if (yPos > 230) {
            doc.addPage()
            yPos = 20
          }

          doc.setFontSize(16)
          doc.setTextColor(colorScheme.secondary)
          doc.text("HUD Housing Data Analysis", 20, yPos)
          yPos += 10

          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text(`Analysis based on ${hudData.variables.length} housing indicators.`, 20, yPos)
          yPos += 15

          // Add HUD data table
          if (includeTables) {
            // Prepare table data
            const tableData = hudData.variables
              .slice(0, 10)
              .map((variable: any) => [
                variable.name || "Unknown",
                variable.formattedValue || variable.value || "N/A",
                variable.location || hudData.stateName || "N/A",
              ])

            // Add the table to the PDF
            autoTable(doc, {
              head: [["Housing Indicator", "Value", "Location"]],
              body: tableData,
              startY: yPos,
              theme: "grid",
              styles: { fontSize: 8, cellPadding: 2 },
              headStyles: { fillColor: [colorScheme.primary.replace("#", "")], textColor: [255, 255, 255] },
            })

            yPos = (doc as any).lastAutoTable.finalY + 10
          }

          // Add HUD observations
          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text("Key observations from HUD housing data:", 20, yPos)
          yPos += 10

          const observations = generateHudObservations(hudData)
          observations.forEach((obs, index) => {
            const splitObs = doc.splitTextToSize(`${index + 1}. ${obs}`, 170)
            doc.text(splitObs, 25, yPos)
            yPos += splitObs.length * 7
          })

          yPos += 10
        }
      }

      if (data?.type === "comparison" || data?.comparisonData) {
        const comparisonData = data?.type === "comparison" ? data?.data : data?.comparisonData
        if (comparisonData && comparisonData.counties) {
          // Check if we need a new page
          if (yPos > 230) {
            doc.addPage()
            yPos = 20
          }

          const counties = comparisonData.counties.filter((c: any) => c.data)

          doc.setFontSize(16)
          doc.setTextColor(colorScheme.secondary)
          doc.text("County Comparison Analysis", 20, yPos)
          yPos += 10

          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text(`Analysis comparing ${counties.length} counties.`, 20, yPos)
          yPos += 15

          if (counties.length >= 2) {
            // Add comparison table
            if (includeTables) {
              // Extract variables from the first county
              const firstCounty = counties[0]
              const variables = firstCounty.data?.variables || []

              // Prepare table data
              const tableData = variables.slice(0, 10).map((variable: any) => {
                const row = [variable.name || "Unknown"]

                // Add values for each county
                counties.forEach((county: any) => {
                  const countyVar = county.data?.variables.find((v: any) => v.code === variable.code)
                  const value = countyVar ? countyVar.formattedValue || countyVar.value || "N/A" : "N/A"
                  row.push(value)
                })

                return row
              })

              // Create table headers
              const tableHeaders = ["Variable"]
              counties.forEach((county: any) => {
                tableHeaders.push(county.countyName || "Unknown")
              })

              // Add the table to the PDF
              autoTable(doc, {
                head: [tableHeaders],
                body: tableData,
                startY: yPos,
                theme: "grid",
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [colorScheme.primary.replace("#", "")], textColor: [255, 255, 255] },
              })

              yPos = (doc as any).lastAutoTable.finalY + 10
            }

            // Add comparison observations
            doc.setFontSize(12)
            doc.setTextColor(colorScheme.text)
            doc.text("Key differences between counties:", 20, yPos)
            yPos += 10

            const observations = generateComparisonObservations(counties)
            observations.forEach((obs, index) => {
              const splitObs = doc.splitTextToSize(`${index + 1}. ${obs}`, 170)
              doc.text(splitObs, 25, yPos)
              yPos += splitObs.length * 7
            })
          } else {
            doc.text("At least two counties with data are required for comparison analysis.", 20, yPos)
          }
        }
      }

      // Add visualizations descriptions
      doc.addPage()
      doc.setFontSize(18)
      doc.setTextColor(colorScheme.primary)
      doc.text("Visualizations Overview", 20, 20)

      doc.setFontSize(12)
      doc.setTextColor(colorScheme.text)
      doc.text(
        "While this PDF cannot include interactive visualizations, the following charts and graphs would help illustrate key findings from the data:",
        20,
        35,
      )

      yPos = 50

      // Describe potential visualizations based on available data
      const visualizations = []

      if (data?.type === "census" || data?.censusData) {
        visualizations.push({
          title: "Population Trends Over Time",
          description: "A line chart showing population changes over time, highlighting growth or decline trends.",
          dataSource: "Census Bureau data",
        })

        visualizations.push({
          title: "Housing Occupancy Breakdown",
          description: "A pie chart displaying the proportion of owner-occupied vs. renter-occupied housing units.",
          dataSource: "Census Bureau data",
        })
      }

      if (data?.type === "fred" || data?.fredData) {
        visualizations.push({
          title: "Economic Indicators Dashboard",
          description:
            "A multi-panel dashboard with key economic indicators such as GDP growth, unemployment rate, and inflation metrics.",
          dataSource: "FRED Economic data",
        })

        visualizations.push({
          title: "Interest Rate Trends",
          description:
            "A line chart showing various interest rates over time, with annotations for major economic events.",
          dataSource: "FRED Economic data",
        })
      }

      if (data?.type === "hud" || data?.hudData) {
        visualizations.push({
          title: "Fair Market Rent Comparison",
          description: "A bar chart comparing Fair Market Rents for different unit sizes (0-4 bedrooms).",
          dataSource: "HUD Housing data",
        })

        visualizations.push({
          title: "Income Limits by Household Size",
          description:
            "A grouped bar chart showing income limits for different household sizes and income categories (very low, low, moderate).",
          dataSource: "HUD Housing data",
        })
      }

      if (data?.type === "comparison" || data?.comparisonData) {
        visualizations.push({
          title: "County Comparison Dashboard",
          description:
            "A side-by-side comparison of key metrics between counties, using both bar charts and radar charts to highlight differences.",
          dataSource: "County Comparison data",
        })

        visualizations.push({
          title: "Geographic Heat Map",
          description:
            "A map visualization showing selected indicators with color intensity representing values across counties.",
          dataSource: "County Comparison data",
        })
      }

      // Ensure we have at least some visualizations
      if (visualizations.length === 0) {
        visualizations.push({
          title: "Economic Data Dashboard",
          description: "An interactive dashboard with key economic indicators and trends.",
          dataSource: "Available data sources",
        })

        visualizations.push({
          title: "Data Comparison Charts",
          description: "Bar and line charts showing key metrics and their changes over time.",
          dataSource: "Available data sources",
        })
      }

      // Add visualization descriptions
      visualizations.forEach((viz, index) => {
        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(14)
        doc.setTextColor(colorScheme.secondary)
        doc.text(`${index + 1}. ${viz.title}`, 20, yPos)
        yPos += 10

        doc.setFontSize(12)
        doc.setTextColor(colorScheme.text)
        const splitDesc = doc.splitTextToSize(viz.description, 170)
        doc.text(splitDesc, 20, yPos)
        yPos += splitDesc.length * 7

        doc.setFontSize(10)
        doc.setTextColor(100, 100, 100)
        doc.text(`Source: ${viz.dataSource}`, 20, yPos)
        yPos += 10
      })

      // Add key findings
      doc.addPage()
      doc.setFontSize(18)
      doc.setTextColor(colorScheme.primary)
      doc.text("Key Findings and Comparisons", 20, 20)

      doc.setFontSize(12)
      doc.setTextColor(colorScheme.text)
      doc.text("Based on the analysis of the economic data, the following key findings emerge:", 20, 35)

      yPos = 50

      // Generate key findings based on available data
      const findings = []

      // Add findings based on census data
      if (data?.type === "census" || data?.censusData) {
        // Population findings
        findings.push({
          category: "Demographics",
          finding:
            "The demographic profile shows population trends and age distribution patterns that will influence future economic development priorities.",
          implications:
            "These demographic patterns may affect workforce availability, housing needs, and public service requirements.",
        })

        // Housing findings
        findings.push({
          category: "Housing",
          finding:
            "Housing occupancy and ownership patterns reveal homeownership rates and housing market conditions that impact community stability.",
          implications:
            "Housing affordability and availability are key factors affecting economic mobility and community stability.",
        })
      }

      // Add findings based on FRED data
      if (data?.type === "fred" || data?.fredData) {
        // Economic indicators findings
        findings.push({
          category: "Economic Growth",
          finding:
            "Economic indicators suggest overall economic conditions with growth trends that vary by sector and time period.",
          implications:
            "The economic climate impacts business formation, expansion opportunities, and household financial stability.",
        })

        // Labor market findings
        findings.push({
          category: "Labor Market",
          finding:
            "The labor market shows conditions that affect workforce dynamics and wage pressures across different industries.",
          implications:
            "Workforce development strategies should align with these labor market conditions to address skills gaps and employment opportunities.",
        })
      }

      // Add findings based on HUD data
      if (data?.type === "hud" || data?.hudData) {
        // Housing affordability findings
        findings.push({
          category: "Housing Affordability",
          finding:
            "Housing cost burden analysis indicates affordability challenges for various income households in the region.",
          implications:
            "Housing affordability impacts economic mobility, workforce attraction/retention, and community development.",
        })
      }

      // Add findings based on comparison data
      if (data?.type === "comparison" || data?.comparisonData) {
        // Regional comparison findings
        findings.push({
          category: "Regional Comparison",
          finding:
            "Comparative analysis reveals economic disparities between counties that suggest different development trajectories.",
          implications:
            "Regional economic development strategies should address these disparities while leveraging each area's unique strengths.",
        })
      }

      // Ensure we have at least some findings
      if (findings.length === 0) {
        findings.push({
          category: "Economic Conditions",
          finding:
            "The available data suggests economic conditions that warrant careful monitoring and targeted interventions.",
          implications:
            "Strategic economic development initiatives should focus on areas with the greatest potential impact.",
        })
      }

      // Add findings to the document
      findings.forEach((finding, index) => {
        // Check if we need a new page
        if (yPos > 230) {
          doc.addPage()
          yPos = 20
        }

        doc.setFontSize(14)
        doc.setTextColor(colorScheme.secondary)
        doc.text(`Finding ${index + 1}: ${finding.category}`, 20, yPos)
        yPos += 10

        doc.setFontSize(12)
        doc.setTextColor(colorScheme.text)

        const splitFinding = doc.splitTextToSize(`Observation: ${finding.finding}`, 170)
        doc.text(splitFinding, 20, yPos)
        yPos += splitFinding.length * 7 + 5

        const splitImplications = doc.splitTextToSize(`Implications: ${finding.implications}`, 170)
        doc.text(splitImplications, 20, yPos)
        yPos += splitImplications.length * 7 + 10
      })

      // Add methodology if included
      if (includeMethodology) {
        doc.addPage()
        doc.setFontSize(18)
        doc.setTextColor(colorScheme.primary)
        doc.text("Methodology", 20, 20)

        doc.setFontSize(12)
        doc.setTextColor(colorScheme.text)
        const splitMethodology = doc.splitTextToSize(methodology, 170)
        doc.text(splitMethodology, 20, 35)

        yPos = 35 + splitMethodology.length * 7 + 10

        // Add data source descriptions
        doc.setFontSize(14)
        doc.setTextColor(colorScheme.secondary)
        doc.text("Data Sources", 20, yPos)
        yPos += 10

        if (data?.type === "census" || data?.censusData) {
          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text("U.S. Census Bureau: American Community Survey (ACS) 5-Year Estimates", 20, yPos)
          yPos += 7
          doc.text(
            "The ACS provides comprehensive demographic, social, economic, and housing data for communities across the United States.",
            25,
            yPos,
          )
          yPos += 10
        }

        if (data?.type === "fred" || data?.fredData) {
          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text("Federal Reserve Economic Data (FRED)", 20, yPos)
          yPos += 7
          doc.text(
            "FRED provides a wide range of economic time series data from multiple authoritative sources, including indicators on GDP, employment, inflation, and interest rates.",
            25,
            yPos,
          )
          yPos += 10
        }

        if (data?.type === "hud" || data?.hudData) {
          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          doc.text("U.S. Department of Housing and Urban Development (HUD)", 20, yPos)
          yPos += 7
          doc.text(
            "HUD data includes Fair Market Rents, Income Limits, and information on assisted housing programs that are essential for understanding housing affordability.",
            25,
            yPos,
          )
          yPos += 10
        }
      }

      // Add custom sections
      sections
        .filter((s) => s.include)
        .forEach((section) => {
          doc.addPage()
          doc.setFontSize(18)
          doc.setTextColor(colorScheme.primary)
          doc.text(section.title, 20, 20)

          doc.setFontSize(12)
          doc.setTextColor(colorScheme.text)
          const splitContent = doc.splitTextToSize(section.content, 170)
          doc.text(splitContent, 20, 35)
        })

      // Add conclusion
      doc.addPage()
      doc.setFontSize(18)
      doc.setTextColor(colorScheme.primary)
      doc.text("Conclusion", 20, 20)

      doc.setFontSize(12)
      doc.setTextColor(colorScheme.text)

      let conclusionText =
        "This economic data analysis provides valuable insights for policy development, business strategy, and community planning. "

      // Add specific conclusion based on data types
      if (data?.type === "census" || data?.censusData) {
        conclusionText +=
          "The demographic and housing characteristics highlighted in the Census data suggest opportunities for targeted economic development initiatives. "
      }

      if (data?.type === "fred" || data?.fredData) {
        conclusionText +=
          "The economic indicators from FRED reveal patterns that can inform fiscal and monetary policy decisions. "
      }

      if (data?.type === "hud" || data?.hudData) {
        conclusionText +=
          "Housing affordability metrics from HUD data point to housing challenges and opportunities that affect economic mobility and community stability. "
      }

      if (data?.type === "comparison" || data?.comparisonData) {
        conclusionText +=
          "Regional comparisons illuminate economic disparities and complementary strengths across geographic areas. "
      }

      // Add general concluding statement
      conclusionText +=
        "By leveraging these insights, stakeholders can develop more effective strategies to enhance economic resilience, promote inclusive growth, and improve quality of life for residents and businesses."

      const splitConclusion = doc.splitTextToSize(conclusionText, 170)
      doc.text(splitConclusion, 20, 35)

      yPos = 35 + splitConclusion.length * 7 + 10

      // Add next steps recommendation
      doc.setFontSize(14)
      doc.setTextColor(colorScheme.secondary)
      doc.text("Recommended Next Steps", 20, yPos)
      yPos += 10

      const nextSteps = [
        "Conduct stakeholder sessions to review and interpret the findings in the context of local knowledge",
        "Identify specific action items based on the economic insights presented in this report",
        "Develop targeted strategies to address challenges and leverage opportunities identified in the analysis",
        "Establish metrics to track progress and measure the impact of economic development initiatives",
        "Consider additional research to address gaps and expand upon initial findings",
      ]

      doc.setFontSize(12)
      doc.setTextColor(colorScheme.text)

      nextSteps.forEach((step, index) => {
        const bulletPoint = `• ${step}`
        const splitStep = doc.splitTextToSize(bulletPoint, 165)
        doc.text(splitStep, 20, yPos)
        yPos += splitStep.length * 7
      })

      // Add footer
      yPos = doc.internal.pageSize.getHeight() - 10
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Report generated on ${new Date().toLocaleDateString()} using the Farmer Dashboard Economic Analysis Tool`,
        doc.internal.pageSize.getWidth() / 2,
        yPos,
        { align: "center" },
      )

      // Add page numbers if enabled
      if (includePageNumbers) {
        const pageCount = doc.internal.getNumberOfPages()

        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i)
          doc.setFontSize(10)
          doc.setTextColor(100, 100, 100)
          doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() - 20,
            doc.internal.pageSize.getHeight() - 10,
          )
        }
      }

      // Save the PDF
      const pdfName = `${reportTitle.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(pdfName)

      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded as a PDF with actual data analysis.",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Download Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Get chart data from the provided data
  const getChartData = () => {
    // Extract real data if available
    if (data?.type === "census" || data?.censusData) {
      const censusData = data?.type === "census" ? data?.data : data?.censusData
      if (censusData && Array.isArray(censusData) && censusData.length > 0) {
        // Find population data across years
        const populationData = censusData
          .map((yearData) => {
            const popVar = yearData.variables?.find(
              (v: any) => v.name?.includes("Population") || v.code === "B01003_001E",
            )
            return {
              name: yearData.year,
              value: popVar ? popVar.rawValue || Number.parseInt(popVar.value) || 0 : 0,
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name))

        if (populationData.length > 0) {
          return populationData
        }
      }
    } else if (data?.type === "fred" || data?.fredData) {
      const fredData = data?.type === "fred" ? data?.data : data?.fredData
      if (fredData && Array.isArray(fredData) && fredData.length > 0) {
        // Find GDP or unemployment data
        const economicData = fredData
          .map((yearData) => {
            const gdpVar = yearData.variables?.find(
              (v: any) => v.name?.includes("GDP") || v.code === "GDPC1" || v.code === "GDP",
            )
            return {
              name: yearData.year,
              value: gdpVar ? gdpVar.rawValue || Number.parseInt(gdpVar.value) || 0 : 0,
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name))

        if (economicData.length > 0) {
          return economicData
        }
      }
    }

    // Return placeholder data if no real data is available
    return [
      { name: "2017", value: 400 },
      { name: "2018", value: 300 },
      { name: "2019", value: 600 },
      { name: "2020", value: 200 },
      { name: "2021", value: 500 },
      { name: "2022", value: 450 },
      { name: "2023", value: 650 },
    ]
  }

  // Get table data from the provided data
  const getTableData = () => {
    // This would extract and format table data from the provided data
    // For now, we'll return placeholder data
    return {
      headers: ["Category", "Value", "Change"],
      rows: [
        ["Category A", "$400", "+5%"],
        ["Category B", "$300", "-2%"],
        ["Category C", "$600", "+12%"],
        ["Category D", "$200", "-8%"],
      ],
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Generate Detailed Report
            </DialogTitle>
            <DialogDescription>
              Create a comprehensive report with visualizations and analysis of your data.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="report-title">Report Title</Label>
                    <Input
                      id="report-title"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="report-subtitle">Subtitle</Label>
                    <Input
                      id="report-subtitle"
                      value={reportSubtitle}
                      onChange={(e) => setReportSubtitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="report-description">Description</Label>
                  <Textarea
                    id="report-description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    className="mt-1 h-[104px]"
                    placeholder="Brief description of the report's purpose and scope"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="author-name">Author Name</Label>
                    <Input
                      id="author-name"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="mt-1"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="author-title">Author Title</Label>
                    <Input
                      id="author-title"
                      value={authorTitle}
                      onChange={(e) => setAuthorTitle(e.target.value)}
                      className="mt-1"
                      placeholder="Your title or organization"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-date">Include Date</Label>
                    <Switch id="include-date" checked={includeDate} onCheckedChange={setIncludeDate} />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-page-numbers">Include Page Numbers</Label>
                    <Switch
                      id="include-page-numbers"
                      checked={includePageNumbers}
                      onCheckedChange={setIncludePageNumbers}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-toc">Include Table of Contents</Label>
                    <Switch
                      id="include-toc"
                      checked={includeTableOfContents}
                      onCheckedChange={setIncludeTableOfContents}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="include-executive-summary">Include Executive Summary</Label>
                  <Switch
                    id="include-executive-summary"
                    checked={includeExecutiveSummary}
                    onCheckedChange={setIncludeExecutiveSummary}
                  />
                </div>

                {includeExecutiveSummary && (
                  <Textarea
                    value={executiveSummary}
                    onChange={(e) => setExecutiveSummary(e.target.value)}
                    className="w-full h-24"
                    placeholder="Provide a brief summary of the key findings and conclusions"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="include-methodology">Include Methodology</Label>
                  <Switch
                    id="include-methodology"
                    checked={includeMethodology}
                    onCheckedChange={setIncludeMethodology}
                  />
                </div>

                {includeMethodology && (
                  <Textarea
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                    className="w-full h-24"
                    placeholder="Describe the data sources and methodology used"
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Report Sections</h3>
                  <Button variant="outline" size="sm" onClick={addSection} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Section
                  </Button>
                </div>

                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <Card key={index} className="border border-gray-200 dark:border-gray-800">
                      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`section-${index}-include`}
                            checked={section.include}
                            onCheckedChange={(checked) => updateSection(index, "include", !!checked)}
                          />
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(index, "title", e.target.value)}
                            className="font-medium border-0 p-0 h-auto focus-visible:ring-0"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(index)}
                          className="h-8 w-8 p-0 text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateSection(index, "content", e.target.value)}
                          className="w-full h-24 mt-2"
                          placeholder="Enter section content"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template">Report Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger id="template" className="mt-1">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color-scheme">Color Scheme</Label>
                  <Select value={selectedColorScheme} onValueChange={setSelectedColorScheme}>
                    <SelectTrigger id="color-scheme" className="mt-1">
                      <SelectValue placeholder="Select a color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Template Preview</h3>
                <div className="grid grid-cols-3 gap-4">
                  {["professional", "academic", "modern", "minimal", "executive"].map((template) => (
                    <div
                      key={template}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedTemplate === template
                          ? "ring-2 ring-blue-500 dark:ring-blue-400"
                          : "hover:border-blue-200 dark:hover:border-blue-800"
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 relative">
                        <div
                          className={`absolute inset-0 ${
                            template === "professional"
                              ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
                              : template === "academic"
                                ? "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
                                : template === "modern"
                                  ? "bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20"
                                  : template === "minimal"
                                    ? "bg-white dark:bg-gray-900"
                                    : "bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20"
                          }`}
                        >
                          {/* Template preview content */}
                          <div className="p-2">
                            <div
                              className={`h-4 w-3/4 mb-2 ${
                                template === "professional"
                                  ? "bg-blue-200 dark:bg-blue-800"
                                  : template === "academic"
                                    ? "bg-gray-200 dark:bg-gray-800"
                                    : template === "modern"
                                      ? "bg-purple-200 dark:bg-purple-800"
                                      : template === "minimal"
                                        ? "bg-gray-200 dark:bg-gray-800"
                                        : "bg-blue-200 dark:bg-blue-800"
                              }`}
                            ></div>
                            <div
                              className={`h-2 w-1/2 mb-4 ${
                                template === "professional"
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : template === "academic"
                                    ? "bg-gray-100 dark:bg-gray-900"
                                    : template === "modern"
                                      ? "bg-purple-100 dark:bg-purple-900"
                                      : template === "minimal"
                                        ? "bg-gray-100 dark:bg-gray-900"
                                        : "bg-blue-100 dark:bg-blue-900"
                              }`}
                            ></div>

                            <div className="space-y-1">
                              {[1, 2, 3, 4].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1 ${
                                    template === "professional"
                                      ? "bg-blue-100 dark:bg-blue-900"
                                      : template === "academic"
                                        ? "bg-gray-100 dark:bg-gray-900"
                                        : template === "modern"
                                          ? "bg-purple-100 dark:bg-purple-900"
                                          : template === "minimal"
                                            ? "bg-gray-100 dark:bg-gray-900"
                                            : "bg-blue-100 dark:bg-blue-900"
                                  } ${i % 3 === 0 ? "w-full" : "w-3/4"}`}
                                ></div>
                              ))}
                            </div>

                            <div
                              className={`mt-3 h-8 ${
                                template === "professional"
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : template === "academic"
                                    ? "bg-gray-100 dark:bg-gray-900"
                                    : template === "modern"
                                      ? "bg-purple-100 dark:bg-purple-900"
                                      : template === "minimal"
                                        ? "bg-gray-100 dark:bg-gray-900"
                                        : "bg-blue-100 dark:bg-blue-900"
                              }`}
                            ></div>
                          </div>
                        </div>

                        {selectedTemplate === template && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-center text-sm capitalize">{template}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Color Scheme Preview</h3>
                <div className="grid grid-cols-5 gap-4">
                  {["blue", "green", "purple", "red", "gray"].map((color) => (
                    <div
                      key={color}
                      className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                        selectedColorScheme === color
                          ? "ring-2 ring-blue-500 dark:ring-blue-400"
                          : "hover:border-blue-200 dark:hover:border-blue-800"
                      }`}
                      onClick={() => setSelectedColorScheme(color)}
                    >
                      <div
                        className={`h-12 ${
                          color === "blue"
                            ? "bg-blue-500 dark:bg-blue-600"
                            : color === "green"
                              ? "bg-green-500 dark:bg-green-600"
                              : color === "purple"
                                ? "bg-purple-500 dark:bg-purple-600"
                                : color === "red"
                                  ? "bg-red-500 dark:bg-red-600"
                                  : color === "gray"
                                    ? "bg-gray-500 dark:bg-gray-600"
                                    : "bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600"
                        }`}
                      >
                        {selectedColorScheme === color && (
                          <div className="flex justify-end p-1">
                            <div className="bg-white text-blue-500 rounded-full p-0.5">
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-center text-xs capitalize">{color}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visualizations" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-charts">Include Charts</Label>
                    <Switch id="include-charts" checked={includeCharts} onCheckedChange={setIncludeCharts} />
                  </div>

                  {includeCharts && (
                    <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="chart-bar" defaultChecked />
                        <Label htmlFor="chart-bar" className="flex items-center gap-1">
                          <BarChart4 className="h-4 w-4 text-blue-500" />
                          Bar Charts
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox id="chart-line" defaultChecked />
                        <Label htmlFor="chart-line" className="flex items-center gap-1">
                          <LineChart className="h-4 w-4 text-green-500" />
                          Line Charts
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox id="chart-pie" defaultChecked />
                        <Label htmlFor="chart-pie" className="flex items-center gap-1">
                          <PieChart className="h-4 w-4 text-purple-500" />
                          Pie Charts
                        </Label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-tables">Include Tables</Label>
                    <Switch id="include-tables" checked={includeTables} onCheckedChange={setIncludeTables} />
                  </div>

                  {includeTables && (
                    <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="table-summary" defaultChecked />
                        <Label htmlFor="table-summary" className="flex items-center gap-1">
                          <Table2 className="h-4 w-4 text-blue-500" />
                          Summary Tables
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox id="table-detailed" defaultChecked />
                        <Label htmlFor="table-detailed" className="flex items-center gap-1">
                          <Table2 className="h-4 w-4 text-green-500" />
                          Detailed Tables
                        </Label>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-raw-data">Include Raw Data</Label>
                    <Switch id="include-raw-data" checked={includeRawData} onCheckedChange={setIncludeRawData} />
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                  <h3 className="text-sm font-medium mb-2">Visualization Preview</h3>
                  <div className="aspect-video bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Visualizations will be generated from your data
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Charts and tables will be automatically generated based on your data and selections.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Data Selection</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Choose which data to include in your report visualizations.
                </p>

                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox id="data-census" defaultChecked={data?.type === "census" || !!data?.censusData} />
                    <Label htmlFor="data-census" className="flex items-center gap-1">
                      Census Bureau Data
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="data-fred" defaultChecked={data?.type === "fred" || !!data?.fredData} />
                    <Label htmlFor="data-fred" className="flex items-center gap-1">
                      FRED Economic Data
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox id="data-hud" defaultChecked={data?.type === "hud" || !!data?.hudData} />
                    <Label htmlFor="data-hud" className="flex items-center gap-1">
                      HUD Housing Data
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="data-comparison"
                      defaultChecked={data?.type === "comparison" || !!data?.comparisonData}
                    />
                    <Label htmlFor="data-comparison" className="flex items-center gap-1">
                      County Comparison Data
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(true)} className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Preview
              </Button>
              <Button onClick={handleDownloadReport} disabled={isGenerating} className="flex items-center gap-1">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download Report
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>Preview how your report will look when generated</DialogDescription>
          </DialogHeader>

          <div ref={reportPreviewRef} className="mt-4">
            <div
              className={`p-8 border rounded-lg ${
                selectedTemplate === "professional"
                  ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
                  : selectedTemplate === "academic"
                    ? "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20"
                    : selectedTemplate === "modern"
                      ? "bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20"
                      : selectedTemplate === "minimal"
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20"
              }`}
            >
              {/* Report Cover */}
              <div className="mb-8 text-center">
                <h1
                  className={`text-3xl font-bold mb-2 ${
                    selectedColorScheme === "blue"
                      ? "text-blue-700 dark:text-blue-400"
                      : selectedColorScheme === "green"
                        ? "text-green-700 dark:text-green-400"
                        : selectedColorScheme === "purple"
                          ? "text-purple-700 dark:text-purple-400"
                          : selectedColorScheme === "red"
                            ? "text-red-700 dark:text-red-400"
                            : selectedColorScheme === "gray"
                              ? "text-gray-700 dark:text-gray-400"
                              : "text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {reportTitle}
                </h1>
                <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">{reportSubtitle}</h2>
                {includeDate && (
                  <p className="text-gray-500 dark:text-gray-500 mb-2">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {(authorName || authorTitle) && (
                  <div className="mt-6">
                    {authorName && <p className="font-medium">{authorName}</p>}
                    {authorTitle && <p className="text-gray-600 dark:text-gray-400">{authorTitle}</p>}
                  </div>
                )}
              </div>

              {/* Table of Contents */}
              {includeTableOfContents && (
                <div className="mb-8">
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      selectedColorScheme === "blue"
                        ? "text-blue-700 dark:text-blue-400"
                        : selectedColorScheme === "green"
                          ? "text-green-700 dark:text-green-400"
                          : selectedColorScheme === "purple"
                            ? "text-purple-700 dark:text-purple-400"
                            : selectedColorScheme === "red"
                              ? "text-red-700 dark:text-red-400"
                              : selectedColorScheme === "gray"
                                ? "text-gray-700 dark:text-gray-400"
                                : "text-blue-700 dark:text-blue-400"
                    }`}
                  >
                    Table of Contents
                  </h2>
                  <div className="space-y-2">
                    {includeExecutiveSummary && (
                      <div className="flex items-center">
                        <div className="font-medium">Executive Summary</div>
                        <div className="flex-1 border-b border-dotted border-gray-300 dark:border-gray-700 mr-2"></div>
                        <div>1</div>
                      </div>
                    )}
                    {sections
                      .filter((s) => s.include)
                      .map((section, index) => (
                        <div key={index} className="flex items-center">
                          <div className="font-medium">{section.title}</div>
                          <div className="flex-1 border-b border-dotted border-gray-300 dark:border-gray-700 mx-2"></div>
                          <div>{includeExecutiveSummary ? index + 2 : index + 1}</div>
                        </div>
                      ))}
                    {includeMethodology && (
                      <div className="flex items-center">
                        <div className="font-medium">Methodology</div>
                        <div className="flex-1 border-b border-dotted border-gray-300 dark:border-gray-700 mx-2"></div>
                        <div>
                          {includeExecutiveSummary
                            ? sections.filter((s) => s.include).length + 2
                            : sections.filter((s) => s.include).length + 1}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Executive Summary */}
              {includeExecutiveSummary && (
                <div className="mb-8">
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      selectedColorScheme === "blue"
                        ? "text-blue-700 dark:text-blue-400"
                        : selectedColorScheme === "green"
                          ? "text-green-700 dark:text-green-400"
                          : selectedColorScheme === "purple"
                            ? "text-purple-700 dark:text-purple-400"
                            : selectedColorScheme === "red"
                              ? "text-red-700 dark:text-red-400"
                              : selectedColorScheme === "gray"
                                ? "text-gray-700 dark:text-gray-400"
                                : "text-blue-700 dark:text-blue-400"
                    }`}
                  >
                    Executive Summary
                  </h2>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {executiveSummary || generateExecutiveSummary()}
                  </p>
                </div>
              )}

              {/* Data Analysis Section */}
              <div className="mb-8">
                <h2
                  className={`text-xl font-bold mb-4 ${
                    selectedColorScheme === "blue"
                      ? "text-blue-700 dark:text-blue-400"
                      : selectedColorScheme === "green"
                        ? "text-green-700 dark:text-green-400"
                        : selectedColorScheme === "purple"
                          ? "text-purple-700 dark:text-purple-400"
                          : selectedColorScheme === "red"
                            ? "text-red-700 dark:text-red-400"
                            : selectedColorScheme === "gray"
                              ? "text-gray-700 dark:text-gray-400"
                              : "text-blue-700 dark:text-blue-400"
                  }`}
                >
                  Data Analysis
                </h2>

                {data?.type === "census" || data?.censusData ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Census Data Analysis</h3>
                    <p className="mb-4">
                      {data?.type === "census" && data?.data && Array.isArray(data.data) && data.data.length > 0
                        ? `Analysis based on ${data.data.length} years of Census Bureau data.`
                        : data?.censusData && Array.isArray(data.censusData) && data.censusData.length > 0
                          ? `Analysis based on ${data.censusData.length} years of Census Bureau data.`
                          : "Census data is available for analysis."}
                    </p>

                    {includeTables && (
                      <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <h3 className="text-lg font-medium mb-2">Census Data Table</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Variable
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Value
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Year
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {(() => {
                                const censusData = data?.type === "census" ? data?.data : data?.censusData
                                if (censusData && Array.isArray(censusData) && censusData.length > 0) {
                                  const latestData = censusData[censusData.length - 1]
                                  if (latestData && latestData.variables && Array.isArray(latestData.variables)) {
                                    return latestData.variables.slice(0, 5).map((variable, idx) => (
                                      <tr key={idx}>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          {variable.name || variable.code || "Unknown"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          {variable.formattedValue || variable.value || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">{latestData.year || "N/A"}</td>
                                      </tr>
                                    ))
                                  }
                                }
                                return (
                                  <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center">
                                      No data available
                                    </td>
                                  </tr>
                                )
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {includeCharts && (
                      <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <h3 className="text-lg font-medium mb-2">Census Data Visualization</h3>
                        <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center p-4">
                          {/* Simple chart preview */}
                          <div className="w-full h-full flex flex-col">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Chart Preview</div>
                            <div className="flex-1 flex items-end space-x-2">
                              {[40, 65, 45, 80, 55, 30, 70].map((height, i) => (
                                <div
                                  key={i}
                                  className="bg-blue-500 dark:bg-blue-600 rounded-t w-full"
                                  style={{ height: `${height}%` }}
                                  aria-label={`Bar ${i + 1}: ${height}%`}
                                ></div>
                              ))}
                            </div>
                            <div className="h-6 border-t border-gray-300 dark:border-gray-600 mt-2 pt-1 flex justify-between">
                              <span className="text-xs">2017</span>
                              <span className="text-xs">2018</span>
                              <span className="text-xs">2019</span>
                              <span className="text-xs">2020</span>
                              <span className="text-xs">2021</span>
                              <span className="text-xs">2022</span>
                              <span className="text-xs">2023</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                          Population and housing data visualization
                        </p>
                      </div>
                    )}
                  </div>
                ) : data?.type === "fred" || data?.fredData ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">FRED Economic Data Analysis</h3>
                    <p className="mb-4">
                      {data?.type === "fred" && data?.data && Array.isArray(data.data) && data.data.length > 0
                        ? `Analysis based on ${data.data.length} years of FRED economic indicators.`
                        : data?.fredData && Array.isArray(data.fredData) && data.fredData.length > 0
                          ? `Analysis based on ${data.fredData.length} years of FRED economic indicators.`
                          : "FRED economic data is available for analysis."}
                    </p>

                    {includeTables && (
                      <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <h3 className="text-lg font-medium mb-2">Economic Indicators</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Indicator
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Value
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Year
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {(() => {
                                const fredData = data?.type === "fred" ? data?.data : data?.fredData
                                if (fredData && Array.isArray(fredData) && fredData.length > 0) {
                                  const latestData = fredData[fredData.length - 1]
                                  if (latestData && latestData.variables && Array.isArray(latestData.variables)) {
                                    return latestData.variables.slice(0, 5).map((variable, idx) => (
                                      <tr key={idx}>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          {variable.name || variable.code || "Unknown"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          {variable.formattedValue || variable.value || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">{latestData.year || "N/A"}</td>
                                      </tr>
                                    ))
                                  }
                                }
                                return (
                                  <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center">
                                      No data available
                                    </td>
                                  </tr>
                                )
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {includeCharts && (
                      <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <h3 className="text-lg font-medium mb-2">Economic Trends</h3>
                        <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center p-4">
                          {/* Simple line chart preview */}
                          <div className="w-full h-full flex flex-col">
                            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Chart Preview</div>
                            <div className="flex-1 relative">
                              <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <polyline
                                  points="0,35 15,30 30,32 45,25 60,15 75,20 100,10"
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="2"
                                  vectorEffect="non-scaling-stroke"
                                />
                                <polyline
                                  points="0,40 15,42 30,38 45,40 60,35 75,30 100,25"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>
                              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300 dark:bg-gray-600"></div>
                              <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-300 dark:bg-gray-600"></div>
                            </div>
                            <div className="h-6 border-t border-gray-300 dark:border-gray-600 mt-2 pt-1 flex justify-between">
                              <span className="text-xs">2017</span>
                              <span className="text-xs">2018</span>
                              <span className="text-xs">2019</span>
                              <span className="text-xs">2020</span>
                              <span className="text-xs">2021</span>
                              <span className="text-xs">2022</span>
                              <span className="text-xs">2023</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center mt-2 space-x-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                            <span className="text-xs">GDP</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 mr-1"></div>
                            <span className="text-xs">Unemployment</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : data?.type === "hud" || data?.hudData ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">HUD Housing Data Analysis</h3>
                    <p className="mb-4">
                      {data?.type === "hud" && data?.data && data.data.variables
                        ? `Analysis based on ${data.data.variables.length} housing indicators.`
                        : data?.hudData && data.hudData.variables
                          ? `Analysis based on ${data.hudData.variables.length} housing indicators.`
                          : "HUD housing data is available for analysis."}
                    </p>

                    {includeTables && (
                      <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <h3 className="text-lg font-medium mb-2">Housing Indicators</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Housing Indicator
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Value
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Location
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {(() => {
                                const hudData = data?.type === "hud" ? data?.data : data?.hudData
                                if (hudData && hudData.variables && Array.isArray(hudData.variables)) {
                                  return hudData.variables.slice(0, 5).map((variable, idx) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        {variable.name || variable.code || "Unknown"}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        {variable.formattedValue || variable.value || "N/A"}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap">
                                        {variable.location || hudData.stateName || "N/A"}
                                      </td>
                                    </tr>
                                  ))
                                }
                                return (
                                  <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center">
                                      No data available
                                    </td>
                                  </tr>
                                )
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : data?.type === "comparison" || data?.comparisonData ? (
                  <div>
                    <h3 className="text-lg font-medium mb-2">County Comparison Analysis</h3>
                    <p className="mb-4">
                      {data?.type === "comparison" && data?.data && data.data.counties
                        ? `Analysis comparing ${data.data.counties.length} counties.`
                        : data?.comparisonData && data.comparisonData.counties
                          ? `Analysis comparing ${data.comparisonData.counties.length} counties.`
                          : "County comparison data is available for analysis."}
                    </p>

                    {includeTables && (
                      <div className="mt-4 p-4 border rounded-lg bg-white dark:bg-gray-800">
                        <h3 className="text-lg font-medium mb-2">Comparison Table</h3>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  Variable
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  County 1
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                  County 2
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {(() => {
                                const comparisonData = data?.type === "comparison" ? data?.data : data?.comparisonData
                                if (comparisonData && comparisonData.counties && comparisonData.counties.length >= 2) {
                                  const county1 = comparisonData.counties[0]
                                  const county2 = comparisonData.counties[1]
                                  if (
                                    county1.data &&
                                    county1.data.variables &&
                                    county2.data &&
                                    county2.data.variables
                                  ) {
                                    return county1.data.variables.slice(0, 5).map((variable, idx) => (
                                      <tr key={idx}>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          {variable.name || variable.code || "Unknown"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          {county1.data.variables.find((v) => v.code === variable.code)
                                            ?.formattedValue ||
                                            county1.data.variables.find((v) => v.code === variable.code)?.value ||
                                            "N/A"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                          {county2.data.variables.find((v) => v.code === variable.code)
                                            ?.formattedValue ||
                                            county2.data.variables.find((v) => v.code === variable.code)?.value ||
                                            "N/A"}
                                        </td>
                                      </tr>
                                    ))
                                  }
                                }
                                return (
                                  <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center">
                                      Insufficient data for comparison
                                    </td>
                                  </tr>
                                )
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>No data available for analysis.</p>
                )}
              </div>

              {/* Methodology Section */}
              {includeMethodology && (
                <div className="mb-8">
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      selectedColorScheme === "blue"
                        ? "text-blue-700 dark:text-blue-400"
                        : selectedColorScheme === "green"
                          ? "text-green-700 dark:text-green-400"
                          : selectedColorScheme === "purple"
                            ? "text-purple-700 dark:text-purple-400"
                            : selectedColorScheme === "red"
                              ? "text-red-700 dark:text-red-400"
                              : selectedColorScheme === "gray"
                                ? "text-gray-700 dark:text-gray-400"
                                : "text-blue-700 dark:text-blue-400"
                    }`}
                  >
                    Methodology
                  </h2>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{methodology}</p>
                </div>
              )}

              {/* Custom Sections */}
              {sections
                .filter((s) => s.include)
                .map((section, index) => (
                  <div key={index} className="mb-8">
                    <h2
                      className={`text-xl font-bold mb-4 ${
                        selectedColorScheme === "blue"
                          ? "text-blue-700 dark:text-blue-400"
                          : selectedColorScheme === "green"
                            ? "text-green-700 dark:text-green-400"
                            : selectedColorScheme === "purple"
                              ? "text-purple-700 dark:text-purple-400"
                              : selectedColorScheme === "red"
                                ? "text-red-700 dark:text-red-400"
                                : selectedColorScheme === "gray"
                                  ? "text-gray-700 dark:text-gray-400"
                                  : "text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {section.title}
                    </h2>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

