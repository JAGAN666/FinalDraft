"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  AlertCircle,
  Download,
  BarChart3,
  LineChartIcon,
  PieChartIcon,
  ScatterChartIcon,
  AreaChartIcon,
  RadarIcon,
  GitCompare,
  Layers,
  RefreshCw,
  FileText,
} from "lucide-react"

interface DataVisualizationsProps {
  censusData: any
  fredData: any
  hudData: any
  combinedData: any
  onDataFetched?: (data: any) => void
}

export default function DataVisualizations({
  censusData,
  fredData,
  hudData,
  combinedData,
  onDataFetched,
}: DataVisualizationsProps) {
  const [activeTab, setActiveTab] = useState("census")
  const [selectedVisualization, setSelectedVisualization] = useState("time-series")
  const [selectedCensusVariables, setSelectedCensusVariables] = useState<string[]>([])
  const [selectedFredVariables, setSelectedFredVariables] = useState<string[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [availableCensusVariables, setAvailableCensusVariables] = useState<
    { code: string; name: string; category: string }[]
  >([])
  const [availableFredVariables, setAvailableFredVariables] = useState<
    { code: string; name: string; category: string }[]
  >([])
  const [normalizeData, setNormalizeData] = useState(false)
  const [showPercentageChange, setShowPercentageChange] = useState(false)
  const [animateChart, setAnimateChart] = useState(true)
  const [chartHeight, setChartHeight] = useState(500)
  const [correlationData, setCorrelationData] = useState<any[]>([])
  const [secondaryVariable, setSecondaryVariable] = useState<string>("")
  const [comparisonMode, setComparisonMode] = useState<"overlay" | "side-by-side">("overlay")
  const [comparisonYear, setComparisonYear] = useState<string>("")
  const [availableYears, setAvailableYears] = useState<string[]>([])

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  // Extract available variables from census data
  useEffect(() => {
    if (censusData) {
      const variables: { code: string; name: string; category: string }[] = []
      const seen = new Set<string>()
      const years = new Set<string>()

      censusData.forEach((yearData: any) => {
        years.add(yearData.year)
        yearData.variables.forEach((variable: any) => {
          if (!seen.has(variable.code)) {
            variables.push({
              code: variable.code,
              name: variable.name,
              category: variable.category,
            })
            seen.add(variable.code)
          }
        })
      })

      setAvailableCensusVariables(variables)
      setAvailableYears(Array.from(years).sort())

      // Auto-select first variable if none selected
      if (variables.length > 0 && selectedCensusVariables.length === 0) {
        setSelectedCensusVariables([variables[0].code])
      }

      // Auto-select comparison year if available
      if (years.size > 0 && !comparisonYear) {
        setComparisonYear(Array.from(years).sort()[0])
      }
    }
  }, [censusData])

  // Extract available variables from FRED data
  useEffect(() => {
    if (fredData) {
      const variables: { code: string; name: string; category: string }[] = []
      const seen = new Set<string>()
      const years = new Set<string>()

      fredData.forEach((yearData: any) => {
        years.add(yearData.year)
        yearData.variables.forEach((variable: any) => {
          if (!seen.has(variable.code)) {
            variables.push({
              code: variable.code,
              name: variable.name,
              category: variable.category,
            })
            seen.add(variable.code)
          }
        })
      })

      setAvailableFredVariables(variables)

      // Update available years
      const allYears = new Set([...availableYears, ...Array.from(years)])
      setAvailableYears(Array.from(allYears).sort())

      // Auto-select first variable if none selected
      if (variables.length > 0 && selectedFredVariables.length === 0) {
        setSelectedFredVariables([variables[0].code])
      }
    }
  }, [fredData])

  // Prepare chart data based on selected variables and data source
  useEffect(() => {
    if (activeTab === "census" && censusData && selectedCensusVariables.length > 0) {
      prepareChartData(censusData, selectedCensusVariables)
    } else if (activeTab === "fred" && fredData && selectedFredVariables.length > 0) {
      prepareChartData(fredData, selectedFredVariables)
    } else if (activeTab === "combined" && combinedData) {
      // Handle combined data visualization
      prepareCombinedChartData()
    }
  }, [
    activeTab,
    selectedCensusVariables,
    selectedFredVariables,
    censusData,
    fredData,
    combinedData,
    normalizeData,
    showPercentageChange,
  ])

  // Calculate correlation data when both census and fred data are available
  useEffect(() => {
    if (censusData && fredData && selectedCensusVariables.length > 0 && selectedFredVariables.length > 0) {
      calculateCorrelations()
    }
  }, [censusData, fredData, selectedCensusVariables, selectedFredVariables])

  // Calculate correlations between census and fred variables
  const calculateCorrelations = () => {
    if (!censusData || !fredData) return

    const censusCode = selectedCensusVariables[0]
    const fredCode = selectedFredVariables[0]

    // Find common years between datasets
    const censusYears = new Set(censusData.map((d: any) => d.year))
    const fredYears = new Set(fredData.map((d: any) => d.year))
    const commonYears = [...censusYears].filter((year) => fredYears.has(year))

    if (commonYears.length < 2) {
      setCorrelationData([])
      return
    }

    // Create correlation data points
    const correlationPoints = commonYears.map((year) => {
      const censusYearData = censusData.find((d: any) => d.year === year)
      const fredYearData = fredData.find((d: any) => d.year === year)

      let censusValue = 0
      let fredValue = 0

      if (censusYearData) {
        const variable = censusYearData.variables.find((v: any) => v.code === censusCode)
        if (variable) {
          censusValue =
            variable.rawValue ||
            (typeof variable.value === "string"
              ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
              : variable.value)
        }
      }

      if (fredYearData) {
        const variable = fredYearData.variables.find((v: any) => v.code === fredCode)
        if (variable) {
          fredValue =
            variable.rawValue ||
            (typeof variable.value === "string"
              ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
              : variable.value)
        }
      }

      return {
        year,
        [censusCode]: censusValue,
        [fredCode]: fredValue,
        censusName: getVariableName(censusCode, false),
        fredName: getVariableName(fredCode, true),
      }
    })

    setCorrelationData(correlationPoints)
  }

  // Prepare chart data for single data source
  const prepareChartData = (data: any[], selectedVariables: string[]) => {
    if (!data || data.length === 0) return

    // Create a map of variable code to name
    const variableNames: Record<string, string> = {}
    data.forEach((yearResult) => {
      yearResult.variables.forEach((variable: any) => {
        if (selectedVariables.includes(variable.code)) {
          variableNames[variable.code] = variable.name
        }
      })
    })

    // Sort data by year
    const sortedData = [...data].sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))

    // Calculate base values for percentage change if needed
    const baseValues: Record<string, number> = {}
    if (showPercentageChange && sortedData.length > 0) {
      const firstYear = sortedData[0]
      firstYear.variables.forEach((variable: any) => {
        if (selectedVariables.includes(variable.code)) {
          baseValues[variable.code] =
            variable.rawValue ||
            (typeof variable.value === "string"
              ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
              : variable.value)
        }
      })
    }

    // Create chart data with year as x-axis
    const formattedData = sortedData.map((yearResult) => {
      const dataPoint: Record<string, any> = {
        year: yearResult.year,
        name: yearResult.year, // For PieChart
      }

      // Add each selected variable's value to the data point
      yearResult.variables.forEach((variable: any) => {
        if (selectedVariables.includes(variable.code)) {
          let value =
            variable.rawValue ||
            (typeof variable.value === "string"
              ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
              : variable.value)

          // Apply normalization if needed
          if (normalizeData) {
            // Find the max value for this variable across all years
            const maxValue = Math.max(
              ...data.map((yearData: any) => {
                const yearVar = yearData.variables.find((v: any) => v.code === variable.code)
                return yearVar ? yearVar.rawValue || 0 : 0
              }),
            )

            if (maxValue > 0) {
              value = (value / maxValue) * 100 // Normalize to percentage of max
            }
          }

          // Apply percentage change if needed
          if (showPercentageChange && baseValues[variable.code]) {
            value = ((value - baseValues[variable.code]) / baseValues[variable.code]) * 100
          }

          dataPoint[variable.code] = value
        }
      })

      return dataPoint
    })

    setChartData(formattedData)
  }

  // Prepare combined chart data
  const prepareCombinedChartData = () => {
    if (!combinedData || !combinedData.census || !combinedData.fred) return

    // Find common years between datasets
    const censusYears = new Set(combinedData.census.map((d: any) => d.year))
    const fredYears = new Set(combinedData.fred.map((d: any) => d.year))
    const commonYears = [...censusYears].filter((year) => fredYears.has(year))

    if (commonYears.length === 0) {
      setChartData([])
      return
    }

    // Sort years
    commonYears.sort()

    // Calculate base values for percentage change if needed
    const baseValues: Record<string, number> = {}
    if (showPercentageChange && commonYears.length > 0) {
      const firstYear = commonYears[0]
      const censusYearData = combinedData.census.find((d: any) => d.year === firstYear)
      const fredYearData = combinedData.fred.find((d: any) => d.year === firstYear)

      // Census base values
      if (censusYearData && selectedCensusVariables.length > 0) {
        censusYearData.variables.forEach((variable: any) => {
          if (selectedCensusVariables.includes(variable.code)) {
            baseValues[`census_${variable.code}`] =
              variable.rawValue ||
              (typeof variable.value === "string"
                ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
                : variable.value)
          }
        })
      }

      // FRED base values
      if (fredYearData && selectedFredVariables.length > 0) {
        fredYearData.variables.forEach((variable: any) => {
          if (selectedFredVariables.includes(variable.code)) {
            baseValues[`fred_${variable.code}`] =
              variable.rawValue ||
              (typeof variable.value === "string"
                ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
                : variable.value)
          }
        })
      }
    }

    // Create combined data for common years
    const combined = commonYears.map((year) => {
      const censusYearData = combinedData.census.find((d: any) => d.year === year)
      const fredYearData = combinedData.fred.find((d: any) => d.year === year)

      const dataPoint: Record<string, any> = {
        year,
        name: year, // For PieChart
      }

      // Add census variables
      if (censusYearData && selectedCensusVariables.length > 0) {
        censusYearData.variables.forEach((variable: any) => {
          if (selectedCensusVariables.includes(variable.code)) {
            let value =
              variable.rawValue ||
              (typeof variable.value === "string"
                ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
                : variable.value)

            // Apply normalization if needed
            if (normalizeData) {
              // Find the max value for this variable across all years
              const maxValue = Math.max(
                ...combinedData.census.map((yearData: any) => {
                  const yearVar = yearData.variables.find((v: any) => v.code === variable.code)
                  return yearVar ? yearVar.rawValue || 0 : 0
                }),
              )

              if (maxValue > 0) {
                value = (value / maxValue) * 100 // Normalize to percentage of max
              }
            }

            // Apply percentage change if needed
            if (showPercentageChange && baseValues[`census_${variable.code}`]) {
              value = ((value - baseValues[`census_${variable.code}`]) / baseValues[`census_${variable.code}`]) * 100
            }

            dataPoint[`census_${variable.code}`] = value
          }
        })
      }

      // Add fred variables
      if (fredYearData && selectedFredVariables.length > 0) {
        fredYearData.variables.forEach((variable: any) => {
          if (selectedFredVariables.includes(variable.code)) {
            let value =
              variable.rawValue ||
              (typeof variable.value === "string"
                ? Number.parseFloat(variable.value.replace(/[$,]/g, ""))
                : variable.value)

            // Apply normalization if needed
            if (normalizeData) {
              // Find the max value for this variable across all years
              const maxValue = Math.max(
                ...combinedData.fred.map((yearData: any) => {
                  const yearVar = yearData.variables.find((v: any) => v.code === variable.code)
                  return yearVar ? yearVar.rawValue || 0 : 0
                }),
              )

              if (maxValue > 0) {
                value = (value / maxValue) * 100 // Normalize to percentage of max
              }
            }

            // Apply percentage change if needed
            if (showPercentageChange && baseValues[`fred_${variable.code}`]) {
              value = ((value - baseValues[`fred_${variable.code}`]) / baseValues[`fred_${variable.code}`]) * 100
            }

            dataPoint[`fred_${variable.code}`] = value
          }
        })
      }

      return dataPoint
    })

    setChartData(combined)
  }

  // Get variable name by code
  const getVariableName = (code: string, isFreq = false) => {
    if (isFreq) {
      const variable = availableFredVariables.find((v) => v.code === code)
      return variable ? variable.name : code
    } else {
      const variable = availableCensusVariables.find((v) => v.code === code)
      return variable ? variable.name : code
    }
  }

  // Add a secondary variable for comparison
  const handleAddSecondaryVariable = () => {
    if (activeTab === "census") {
      if (secondaryVariable && !selectedCensusVariables.includes(secondaryVariable)) {
        setSelectedCensusVariables([...selectedCensusVariables, secondaryVariable])
      }
    } else if (activeTab === "fred") {
      if (secondaryVariable && !selectedFredVariables.includes(secondaryVariable)) {
        setSelectedFredVariables([...selectedFredVariables, secondaryVariable])
      }
    }
  }

  // Export chart data to CSV
  const exportChartData = () => {
    if (!chartData || chartData.length === 0) return

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add header row
    const headers = Object.keys(chartData[0])
    csvContent += headers.join(",") + "\r\n"

    // Add data rows
    chartData.forEach((row) => {
      const rowData = headers.map((header) => row[header])
      csvContent += rowData.join(",") + "\r\n"
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${activeTab}_data_export.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get year-over-year comparison data
  const getYearComparisonData = () => {
    if (!chartData || chartData.length === 0 || !comparisonYear) return null

    // Find the selected year data
    const selectedYearData = chartData.find((d) => d.year === comparisonYear)
    if (!selectedYearData) return null

    // Get the most recent year data
    const sortedData = [...chartData].sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
    const mostRecentYearData = sortedData[0]

    // Get variables to compare
    const variables =
      activeTab === "census"
        ? selectedCensusVariables
        : activeTab === "fred"
          ? selectedFredVariables
          : [...selectedCensusVariables.map((v) => `census_${v}`), ...selectedFredVariables.map((v) => `fred_${v}`)]

    // Create comparison data
    const comparisonData = variables.map((code) => {
      const displayCode = code.startsWith("census_")
        ? code.substring(7)
        : code.startsWith("fred_")
          ? code.substring(5)
          : code
      const isFreq = activeTab === "fred" || (activeTab === "combined" && code.startsWith("fred_"))

      const oldValue = selectedYearData[code] || 0
      const newValue = mostRecentYearData[code] || 0
      const percentChange = oldValue !== 0 ? ((newValue - oldValue) / oldValue) * 100 : 0

      return {
        name: getVariableName(displayCode, isFreq),
        oldValue,
        newValue,
        percentChange,
        code,
      }
    })

    return {
      oldYear: comparisonYear,
      newYear: mostRecentYearData.year,
      data: comparisonData,
    }
  }

  // Render the appropriate chart based on selected visualization type
  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No data available for the selected variables. Please select different variables or fetch more data.
          </AlertDescription>
        </Alert>
      )
    }

    // Get variables to display based on active tab
    const variables =
      activeTab === "census"
        ? selectedCensusVariables
        : activeTab === "fred"
          ? selectedFredVariables
          : [...selectedCensusVariables.map((v) => `census_${v}`), ...selectedFredVariables.map((v) => `fred_${v}`)]

    // Create chart config for ChartContainer
    const chartConfig = variables.reduce(
      (acc, code, index) => {
        const isFreq = activeTab === "fred" || (activeTab === "combined" && code.startsWith("fred_"))
        const displayCode = code.startsWith("census_")
          ? code.substring(7)
          : code.startsWith("fred_")
            ? code.substring(5)
            : code

        acc[code] = {
          label: getVariableName(displayCode, isFreq),
          color: COLORS[index % COLORS.length],
        }
        return acc
      },
      {} as Record<string, any>,
    )

    // Get year comparison data if needed
    const yearComparisonData = getYearComparisonData()

    switch (selectedVisualization) {
      case "time-series":
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {variables.map((code, index) => (
                  <Line
                    key={code}
                    type="monotone"
                    dataKey={code}
                    name={chartConfig[code].label}
                    stroke={chartConfig[code].color}
                    activeDot={{ r: 8 }}
                    isAnimationActive={animateChart}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "bar-chart":
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {variables.map((code, index) => (
                  <Bar
                    key={code}
                    dataKey={code}
                    name={chartConfig[code].label}
                    fill={chartConfig[code].color}
                    isAnimationActive={animateChart}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "area-chart":
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {variables.map((code, index) => (
                  <Area
                    key={code}
                    type="monotone"
                    dataKey={code}
                    name={chartConfig[code].label}
                    fill={chartConfig[code].color}
                    stroke={chartConfig[code].color}
                    fillOpacity={0.3}
                    isAnimationActive={animateChart}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "pie-chart":
        // For pie chart, we'll use the most recent year's data
        const latestYear = Math.max(...chartData.map((d) => Number.parseInt(d.year)))
        const pieData = chartData.find((d) => d.year == latestYear)

        if (!pieData) return <p>No data available for pie chart</p>

        const pieChartData = variables.map((code) => ({
          name: chartConfig[code].label,
          value: pieData[code] || 0,
          code,
        }))

        return (
          <div className={`h-[${chartHeight}px]`}>
            <p className="text-center mb-2">Data for Year {latestYear}</p>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={animateChart}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )

      case "scatter-plot":
        // For scatter plot, we need at least two variables
        if (variables.length < 2) {
          return (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Scatter plot requires at least two variables. Please select more variables.
              </AlertDescription>
            </Alert>
          )
        }

        // Use the first two selected variables
        const xAxis = variables[0]
        const yAxis = variables[1]

        return (
          <div className={`h-[${chartHeight}px]`}>
            <p className="text-center mb-2">
              {chartConfig[xAxis].label} vs {chartConfig[yAxis].label}
            </p>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart>
                <CartesianGrid />
                <XAxis type="number" dataKey={xAxis} name={chartConfig[xAxis].label} />
                <YAxis type="number" dataKey={yAxis} name={chartConfig[yAxis].label} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Legend />
                <Scatter
                  name={`${chartConfig[xAxis].label} vs ${chartConfig[yAxis].label}`}
                  data={chartData}
                  fill={COLORS[0]}
                  isAnimationActive={animateChart}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )

      case "radar-chart":
        // For radar chart, we'll use the most recent year's data
        const radarLatestYear = Math.max(...chartData.map((d) => Number.parseInt(d.year)))
        const radarData = chartData.find((d) => d.year == radarLatestYear)

        if (!radarData) return <p>No data available for radar chart</p>

        // Normalize data for radar chart
        const radarChartData = variables.map((code) => {
          // Find the max value for this variable across all years
          const maxValue = Math.max(...chartData.map((d) => d[code] || 0))

          return {
            subject: chartConfig[code].label,
            A: maxValue > 0 ? (radarData[code] / maxValue) * 100 : 0,
            fullMark: 100,
          }
        })

        return (
          <div className={`h-[${chartHeight}px]`}>
            <p className="text-center mb-2">Normalized Data for Year {radarLatestYear}</p>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name={`Year ${radarLatestYear}`}
                  dataKey="A"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.6}
                  isAnimationActive={animateChart}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )

      case "composed-chart":
        return (
          <ChartContainer config={chartConfig} className={`h-[${chartHeight}px]`}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {variables.map((code, index) => {
                  // Alternate between line and bar for better visualization
                  return index % 2 === 0 ? (
                    <Bar
                      key={code}
                      dataKey={code}
                      name={chartConfig[code].label}
                      fill={chartConfig[code].color}
                      isAnimationActive={animateChart}
                    />
                  ) : (
                    <Line
                      key={code}
                      type="monotone"
                      dataKey={code}
                      name={chartConfig[code].label}
                      stroke={chartConfig[code].color}
                      isAnimationActive={animateChart}
                    />
                  )
                })}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "year-comparison":
        if (!yearComparisonData) {
          return (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No comparison data available. Please select a valid comparison year.</AlertDescription>
            </Alert>
          )
        }

        return (
          <div className={`h-[${chartHeight}px]`}>
            <p className="text-center mb-2">
              Comparing {yearComparisonData.oldYear} vs {yearComparisonData.newYear}
            </p>
            <ResponsiveContainer width="100%" height="90%">
              {comparisonMode === "overlay" ? (
                <BarChart data={yearComparisonData.data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="oldValue"
                    name={`${yearComparisonData.oldYear} Value`}
                    fill={COLORS[0]}
                    isAnimationActive={animateChart}
                  />
                  <Bar
                    dataKey="newValue"
                    name={`${yearComparisonData.newYear} Value`}
                    fill={COLORS[1]}
                    isAnimationActive={animateChart}
                  />
                </BarChart>
              ) : (
                <BarChart data={yearComparisonData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentChange" name="% Change" fill={COLORS[2]} isAnimationActive={animateChart}>
                    {yearComparisonData.data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.percentChange >= 0 ? COLORS[1] : COLORS[0]} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        )

      case "correlation":
        if (activeTab !== "combined" || correlationData.length === 0) {
          return (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Correlation analysis requires both Census and FRED data with overlapping years.
              </AlertDescription>
            </Alert>
          )
        }

        const censusCode = selectedCensusVariables[0]
        const fredCode = selectedFredVariables[0]

        return (
          <div className={`h-[${chartHeight}px]`}>
            <p className="text-center mb-2">
              Correlation: {getVariableName(censusCode)} vs {getVariableName(fredCode, true)}
            </p>
            <ResponsiveContainer width="100%" height="90%">
              <ScatterChart>
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey={censusCode}
                  name={getVariableName(censusCode)}
                  label={{ value: getVariableName(censusCode), position: "insideBottom", offset: -5 }}
                />
                <CartesianGrid />
                <XAxis
                  type="number"
                  dataKey={censusCode}
                  name={getVariableName(censusCode)}
                  label={{ value: getVariableName(censusCode), position: "insideBottom", offset: -5 }}
                />
                <YAxis
                  type="number"
                  dataKey={fredCode}
                  name={getVariableName(fredCode, true)}
                  label={{ value: getVariableName(fredCode, true), angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(label) => `Year: ${correlationData[label].year}`}
                />
                <Legend />
                <Scatter name="Correlation" data={correlationData} fill={COLORS[0]} isAnimationActive={animateChart} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )

      default:
        return <p>Select a visualization type</p>
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Advanced Data Visualizations</CardTitle>
        <CardDescription>Explore and visualize Census and FRED economic data with interactive charts</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="census" disabled={!censusData}>
              Census Data
            </TabsTrigger>
            <TabsTrigger value="fred" disabled={!fredData}>
              FRED Data
            </TabsTrigger>
            <TabsTrigger value="hud" disabled={!hudData}>
              HUD Data
            </TabsTrigger>
            <TabsTrigger value="combined" disabled={!combinedData}>
              Combined Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="census">{/* Render Census data visualizations here */}</TabsContent>

          <TabsContent value="fred">{/* Render FRED data visualizations here */}</TabsContent>

          <TabsContent value="hud">
            {!hudData ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please fetch HUD data first to enable visualizations.</AlertDescription>
              </Alert>
            ) : (
              // Render HUD data visualizations here
              // Similar to how Census and FRED data are visualized
              <p>HUD Data Visualizations Coming Soon!</p>
            )}
          </TabsContent>

          <TabsContent value="combined">{/* Render combined data visualizations here */}</TabsContent>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Visualization Type</label>
              <Select value={selectedVisualization} onValueChange={setSelectedVisualization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visualization type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time-series">
                    <div className="flex items-center">
                      <LineChartIcon className="h-4 w-4 mr-2" />
                      Time Series
                    </div>
                  </SelectItem>
                  <SelectItem value="bar-chart">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="area-chart">
                    <div className="flex items-center">
                      <AreaChartIcon className="h-4 w-4 mr-2" />
                      Area Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="pie-chart">
                    <div className="flex items-center">
                      <PieChartIcon className="h-4 w-4 mr-2" />
                      Pie Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="scatter-plot">
                    <div className="flex items-center">
                      <ScatterChartIcon className="h-4 w-4 mr-2" />
                      Scatter Plot
                    </div>
                  </SelectItem>
                  <SelectItem value="radar-chart">
                    <div className="flex items-center">
                      <RadarIcon className="h-4 w-4 mr-2" />
                      Radar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="composed-chart">
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-2" />
                      Composed Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="year-comparison">
                    <div className="flex items-center">
                      <GitCompare className="h-4 w-4 mr-2" />
                      Year Comparison
                    </div>
                  </SelectItem>
                  {activeTab === "combined" && (
                    <SelectItem value="correlation">
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Correlation Analysis
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Primary Variable</label>
              <Select
                value={activeTab === "census" ? selectedCensusVariables[0] : selectedFredVariables[0]}
                onValueChange={(value) => {
                  if (activeTab === "census") {
                    setSelectedCensusVariables([value])
                  } else {
                    setSelectedFredVariables([value])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select variable" />
                </SelectTrigger>
                <SelectContent>
                  {activeTab === "census"
                    ? availableCensusVariables.map((variable) => (
                        <SelectItem key={variable.code} value={variable.code}>
                          {variable.name}
                        </SelectItem>
                      ))
                    : availableFredVariables.map((variable) => (
                        <SelectItem key={variable.code} value={variable.code}>
                          {variable.name}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Add Comparison Variable</label>
              <div className="flex space-x-2">
                <Select value={secondaryVariable} onValueChange={setSecondaryVariable}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select variable" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTab === "census"
                      ? availableCensusVariables
                          .filter((v) => !selectedCensusVariables.includes(v.code))
                          .map((variable) => (
                            <SelectItem key={variable.code} value={variable.code}>
                              {variable.name}
                            </SelectItem>
                          ))
                      : availableFredVariables
                          .filter((v) => !selectedFredVariables.includes(v.code))
                          .map((variable) => (
                            <SelectItem key={variable.code} value={variable.code}>
                              {variable.name}
                            </SelectItem>
                          ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddSecondaryVariable} disabled={!secondaryVariable}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          {selectedVisualization === "year-comparison" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Comparison Year</label>
                <Select value={comparisonYear} onValueChange={setComparisonYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comparison Mode</label>
                <Select
                  value={comparisonMode}
                  onValueChange={(value) => setComparisonMode(value as "overlay" | "side-by-side")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overlay">Side-by-Side Values</SelectItem>
                    <SelectItem value="side-by-side">Percentage Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Switch id="normalize" checked={normalizeData} onCheckedChange={setNormalizeData} />
              <Label htmlFor="normalize">Normalize Data</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="percentage" checked={showPercentageChange} onCheckedChange={setShowPercentageChange} />
              <Label htmlFor="percentage">Show % Change</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="animate" checked={animateChart} onCheckedChange={setAnimateChart} />
              <Label htmlFor="animate">Animate Chart</Label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Chart Height: {chartHeight}px</label>
            <Slider
              value={[chartHeight]}
              min={300}
              max={800}
              step={50}
              onValueChange={(value) => setChartHeight(value[0])}
              className="w-full"
            />
          </div>

          <div className="flex justify-end mb-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={exportChartData}
              disabled={!chartData || chartData.length === 0}
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1"
              disabled={!chartData || chartData.length === 0}
              onClick={() => {
                if (chartData && chartData.length > 0 && onDataFetched) {
                  // This will trigger the report generator in the parent component
                  onDataFetched({
                    type: "visualization",
                    data: {
                      chartData,
                      activeTab,
                      selectedVisualization,
                      selectedCensusVariables,
                      selectedFredVariables,
                    },
                    action: "report",
                  })
                }
              }}
            >
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>

          <div className="border rounded-lg p-4">{renderChart()}</div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

