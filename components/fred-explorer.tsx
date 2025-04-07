"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Download, Search, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Constants
const YEARS = [
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2014",
  "2013",
  "2012",
  "2011",
  "2010",
]

// FRED data categories
const VARIABLES = {
  "Economic Indicators": {
    "Real GDP": "GDPC1",
    "Nominal GDP": "GDP",
    "Personal Consumption Expenditures": "PCE",
    "Gross Private Domestic Investment": "GPDI",
    "Industrial Production Index": "INDPRO",
    "Capacity Utilization": "TCU",
    "Real Personal Income": "RPI",
    "Personal Saving Rate": "PSAVERT",
  },
  "Labor Market": {
    "Unemployment Rate": "UNRATE",
    "Civilian Labor Force Participation Rate": "CIVPART",
    "Total Nonfarm Payrolls": "PAYEMS",
    "Initial Jobless Claims": "ICSA",
    "Employment-Population Ratio": "EMRATIO",
    "Average Hourly Earnings": "CES0500000003",
    "Job Openings": "JTSJOL",
  },
  "Inflation & Prices": {
    "Consumer Price Index (CPI)": "CPIAUCSL",
    "Core CPI (excluding Food and Energy)": "CPILFESL",
    "Producer Price Index (PPI)": "PPIACO",
    "Personal Consumption Expenditures Price Index": "PCEPI",
    "Core PCE Price Index": "PCEPILFE",
    "Consumer Price Index - Shelter": "CUSR0000SAH1",
    "Consumer Price Index - Food": "CPIUFDSL",
  },
  Housing: {
    "Housing Starts": "HOUST",
    "Building Permits": "PERMIT",
    "New Home Sales": "HSN1F",
    "Existing Home Sales": "EXHOSLUSM495S",
    "S&P/Case-Shiller Home Price Index": "CSUSHPINSA",
    "Mortgage Rates (30-Year Fixed)": "MORTGAGE30US",
    "Housing Affordability Index": "FIXHAI",
  },
  "Interest Rates": {
    "Federal Funds Rate": "FEDFUNDS",
    "3-Month Treasury Bill Rate": "TB3MS",
    "10-Year Treasury Constant Maturity Rate": "GS10",
    "30-Year Fixed Mortgage Rate": "MORTGAGE30US",
    "BAA Corporate Bond Yield": "BAA",
    "AAA Corporate Bond Yield": "AAA",
  },
  "Money & Banking": {
    "M1 Money Stock": "M1SL",
    "M2 Money Stock": "M2SL",
    "Consumer Loans": "CONSUMER",
    "Commercial and Industrial Loans": "BUSLOANS",
    "Bank Credit": "TOTBKCR",
    "Total Reserves of Depository Institutions": "TOTRESNS",
  },
  International: {
    "Trade Balance": "NETEXP",
    "US Dollar Index": "DTWEXB",
    "Imports of Goods and Services": "IMPGS",
    "Exports of Goods and Services": "EXPGS",
    "Current Account Balance": "BOPBCA",
    "US / Euro Foreign Exchange Rate": "EXUSEU",
  },
  "Regional Data": {
    "State Unemployment Rate": "STATEUNR",
    "State Coincident Indexes": "STATEFIPS",
    "State Leading Indexes": "STLFSI",
    "State Personal Income": "STATEINC",
    "State Housing Price Index": "STATEHPI",
  },
}

// Known good combinations for testing
const RELIABLE_COMBINATIONS = [
  {
    variable: "GDPC1", // Real GDP
    year: "2022",
  },
  {
    variable: "UNRATE", // Unemployment Rate
    year: "2023",
  },
]

interface FredExplorerProps {
  apiKey: string
  onDataFetched?: (data: any) => void
}

export default function FredExplorer({ apiKey, onDataFetched }: FredExplorerProps) {
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set(["2022", "2023"]))
  const [selectedVariables, setSelectedVariables] = useState<Set<string>>(new Set(["GDPC1"]))
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [apiStatus, setApiStatus] = useState<{ status: string; message: string }>({
    status: "Checking...",
    message: "Verifying API connection",
  })
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("All")
  const [activeTab, setActiveTab] = useState<string>("table")

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    })
  }

  // Check if a variable matches the search term
  const matchesSearch = (variableName: string) => {
    if (!searchTerm) return true
    return variableName.toLowerCase().includes(searchTerm.toLowerCase())
  }

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`/api/fred?series_id=GDPC1&api_key=${apiKey}&file_type=json`)
        const data = await response.json()

        if (data && data.seriess && data.seriess.length > 0) {
          setApiStatus({
            status: "Connected",
            message: "API connection successful",
          })
        } else {
          setApiStatus({
            status: "Disconnected",
            message: "Please check your API key or try again later",
          })
        }
      } catch (error) {
        setApiStatus({
          status: "Disconnected",
          message: "Please check your internet connection",
        })
      }
    }

    checkApiHealth()
  }, [apiKey])

  // Handle checkbox toggle for years
  const handleYearToggle = (year: string) => {
    const newYears = new Set(selectedYears)
    if (newYears.has(year)) {
      newYears.delete(year)
    } else {
      newYears.add(year)
    }
    setSelectedYears(newYears)
  }

  // Handle checkbox toggle for variables
  const handleVariableToggle = (code: string) => {
    const newVariables = new Set(selectedVariables)
    if (newVariables.has(code)) {
      newVariables.delete(code)
    } else {
      newVariables.add(code)
    }
    setSelectedVariables(newVariables)
  }

  // Select all variables in a category
  const selectAllInCategory = (category: string) => {
    const newVariables = new Set(selectedVariables)
    Object.values(VARIABLES[category as keyof typeof VARIABLES]).forEach((code) => {
      newVariables.add(code)
    })
    setSelectedVariables(newVariables)
  }

  // Deselect all variables in a category
  const deselectAllInCategory = (category: string) => {
    const newVariables = new Set(selectedVariables)
    Object.values(VARIABLES[category as keyof typeof VARIABLES]).forEach((code) => {
      newVariables.delete(code)
    })
    setSelectedVariables(newVariables)
  }

  // Handler for using a reliable preset combination
  const applyReliablePreset = (preset: (typeof RELIABLE_COMBINATIONS)[0]) => {
    setSelectedYears(new Set([preset.year]))
    setSelectedVariables(new Set([preset.variable]))
  }

  // Test the FRED API directly
  const testFredApi = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`/api/fred?series_id=GDPC1&api_key=${apiKey}&file_type=json`)
      const data = await response.json()

      if (data && data.seriess && data.seriess.length > 0) {
        alert("FRED API test successful! The API is working.")
      } else {
        setError("FRED API test failed. Check your API key or try again later.")
      }
    } catch (error) {
      console.error("Test FRED API Error:", error)
      setError(`FRED API test failed. Please check your internet connection.`)
    } finally {
      setLoading(false)
    }
  }

  // Calculate if a category has any selected variables
  const categoryHasSelected = (category: string) => {
    return Object.values(VARIABLES[category as keyof typeof VARIABLES]).some((code) => selectedVariables.has(code))
  }

  // Count selected variables in a category
  const countSelectedInCategory = (category: string) => {
    return Object.values(VARIABLES[category as keyof typeof VARIABLES]).filter((code) => selectedVariables.has(code))
      .length
  }

  // Filter categories based on selected tab
  const getFilteredCategories = () => {
    if (selectedCategoryTab === "All") {
      return Object.keys(VARIABLES)
    } else if (selectedCategoryTab === "Selected") {
      return Object.keys(VARIABLES).filter((category) => categoryHasSelected(category))
    }
    return [selectedCategoryTab]
  }

  // Export data to Excel
  const exportToExcel = () => {
    if (!results || results.length === 0) {
      alert("No data to export. Please fetch data first.")
      return
    }

    alert("Export to Excel functionality would be implemented here in a production app.")
  }

  // Fetch FRED data
  const fetchFredData = async (year: string, variables: string[]) => {
    const results = []

    for (const seriesId of variables) {
      try {
        // Calculate date range for the year
        const startDate = `${year}-01-01`
        const endDate = `${year}-12-31`

        // Fetch the series data
        const observationsResponse = await fetch(
          `/api/fred?endpoint=series/observations&series_id=${seriesId}&api_key=${apiKey}&file_type=json&observation_start=${startDate}&observation_end=${endDate}&frequency=a&sort_order=desc&limit=1`,
        )

        const data = await observationsResponse.json()

        // Get the series info to get the title
        const seriesInfoResponse = await fetch(
          `/api/fred?endpoint=series&series_id=${seriesId}&api_key=${apiKey}&file_type=json`,
        )

        const seriesInfoData = await seriesInfoResponse.json()
        const seriesInfo = seriesInfoData.seriess[0]
        let value = "N/A"

        // Get the most recent value in the requested year
        if (data.observations && data.observations.length > 0) {
          const observation = data.observations[0]
          value = Number.parseFloat(observation.value)

          // Format based on the variable
          if (
            seriesId.startsWith("GDP") ||
            seriesInfo.title.includes("Income") ||
            seriesInfo.title.includes("Expenditure") ||
            seriesInfo.title.includes("Spending")
          ) {
            value = `$${value.toLocaleString()}`
          } else {
            value = value.toLocaleString()
          }
        }

        // Find the category for this series
        let category = "Other"
        let name = seriesInfo.title

        for (const [cat, vars] of Object.entries(VARIABLES)) {
          for (const [varName, varCode] of Object.entries(vars)) {
            if (varCode === seriesId) {
              category = cat
              name = varName
              break
            }
          }
        }

        results.push({
          code: seriesId,
          name: name,
          category: category,
          value: value,
          rawValue: typeof value === "string" ? Number.parseFloat(value.replace(/[$,]/g, "")) : value,
        })
      } catch (error) {
        console.error(`Error fetching FRED data for ${seriesId}:`, error)
        results.push({
          code: seriesId,
          name: seriesId,
          category: "Error",
          value: "Error fetching data",
          rawValue: 0,
        })
      }
    }

    return results
  }

  // Fetch data from the API
  const handleFetchData = async () => {
    setLoading(true)
    setError("")
    setResults(null)

    try {
      // Validate inputs
      if (selectedYears.size === 0) throw new Error("Please select at least one year")
      if (selectedVariables.size === 0) throw new Error("Please select at least one variable")

      // Check if too many variables are selected
      if (selectedVariables.size > 20) {
        throw new Error("Too many variables selected. Please select 20 or fewer variables to avoid API limitations.")
      }

      const processedResults = []

      // Process each selected year
      for (const year of selectedYears) {
        try {
          console.log(`Fetching FRED data for ${year}...`)

          // Fetch FRED data for each selected variable
          const fredVariables = await fetchFredData(year, Array.from(selectedVariables))

          // Sort by category and name
          fredVariables.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))

          // Add to processed results
          processedResults.push({
            year,
            location: "United States", // FRED data is typically national
            variables: fredVariables,
          })
        } catch (yearError: any) {
          console.error(`Error fetching ${year} data:`, yearError)
          setError((prev) => {
            const newError = `Error for ${year}: ${yearError.message}`
            return prev ? `${prev}\n${newError}` : newError
          })
        }
      }

      // Set the results if we have any
      if (processedResults.length > 0) {
        setResults(processedResults)
        // Call the callback if provided
        if (onDataFetched) {
          onDataFetched(processedResults)
        }
      } else {
        throw new Error(
          "No data could be retrieved. Please try a different selection or use one of the reliable presets below.",
        )
      }
    } catch (err: any) {
      console.error("Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (!results || results.length === 0) return []

    // Get all unique variable codes across all years
    const allVariableCodes = new Set<string>()
    results.forEach((yearResult) => {
      yearResult.variables.forEach((variable) => {
        allVariableCodes.add(variable.code)
      })
    })

    // Create a map of variable code to name
    const variableNames: Record<string, string> = {}
    results.forEach((yearResult) => {
      yearResult.variables.forEach((variable) => {
        variableNames[variable.code] = variable.name
      })
    })

    // Create chart data with year as x-axis
    const chartData = results
      .sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))
      .map((yearResult) => {
        const dataPoint: Record<string, any> = { year: yearResult.year }

        // Add each variable's value to the data point
        yearResult.variables.forEach((variable) => {
          dataPoint[variable.code] = variable.rawValue
        })

        return dataPoint
      })

    return {
      chartData,
      variableNames,
      variableCodes: Array.from(allVariableCodes),
    }
  }

  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">FRED Economic Data Explorer</h2>

        {apiStatus.status !== "Connected" && (
          <Alert className="mb-4 bg-red-100 text-red-800 border border-red-200">
            <AlertDescription>
              API Status: {apiStatus.status} - {apiStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Years</label>
            <div className="grid grid-cols-7 gap-2">
              {YEARS.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`fred-year-${year}`}
                    checked={selectedYears.has(year)}
                    onCheckedChange={() => handleYearToggle(year)}
                  />
                  <label htmlFor={`fred-year-${year}`} className="text-sm">
                    {year}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Variable Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Economic Indicators{" "}
              <span className="text-xs text-muted-foreground">({selectedVariables.size} selected)</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              {searchTerm && (
                <button className="absolute right-2 top-2.5" onClick={() => setSearchTerm("")}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                className={selectedCategoryTab === "All" ? "bg-muted" : ""}
                onClick={() => setSelectedCategoryTab("All")}
              >
                All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={selectedCategoryTab === "Selected" ? "bg-muted" : ""}
                onClick={() => setSelectedCategoryTab("Selected")}
              >
                Selected ({selectedVariables.size})
              </Button>
              {Object.keys(VARIABLES).map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={selectedCategoryTab === category ? "bg-muted" : ""}
                  onClick={() => setSelectedCategoryTab(category)}
                >
                  {category} ({countSelectedInCategory(category)})
                </Button>
              ))}
            </div>

            <div className="border rounded-md">
              {getFilteredCategories().map((category) => {
                const isExpanded = expandedCategories[category] !== false
                const totalInCategory = Object.keys(VARIABLES[category as keyof typeof VARIABLES]).length
                const selectedInCategory = countSelectedInCategory(category)

                return (
                  <Collapsible
                    key={category}
                    open={isExpanded}
                    onOpenChange={() => toggleCategory(category)}
                    className="border-b last:border-b-0"
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50">
                      <div className="flex items-center">
                        <ChevronDown
                          className="h-4 w-4 mr-2 transition-transform duration-200"
                          style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
                        />
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {selectedInCategory}/{totalInCategory}
                        </span>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 pt-0 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3">
                        {Object.entries(VARIABLES[category as keyof typeof VARIABLES])
                          .filter(([name]) => matchesSearch(name))
                          .map(([name, code]) => (
                            <div key={code} className="flex items-center space-x-2">
                              <Checkbox
                                id={`fred-${code}`}
                                checked={selectedVariables.has(code)}
                                onCheckedChange={() => handleVariableToggle(code)}
                              />
                              <label htmlFor={`fred-${code}`} className="text-sm">
                                {name}
                              </label>
                            </div>
                          ))}
                      </div>
                      <div className="flex justify-between mt-3">
                        <Button variant="outline" size="sm" onClick={() => selectAllInCategory(category)}>
                          Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => deselectAllInCategory(category)}>
                          Deselect All
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </div>
          </div>

          {/* Reliable Presets */}
          <div>
            <h3 className="font-medium mb-2">Reliable Presets</h3>
            <p className="text-sm text-muted-foreground mb-2">
              If you're having trouble getting data, try one of these known-good combinations:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {RELIABLE_COMBINATIONS.map((preset, index) => {
                // Find the variable name
                let variableName = preset.variable
                for (const category of Object.values(VARIABLES)) {
                  for (const [name, code] of Object.entries(category)) {
                    if (code === preset.variable) {
                      variableName = name
                      break
                    }
                  }
                }

                return (
                  <Button key={index} variant="outline" size="sm" onClick={() => applyReliablePreset(preset)}>
                    {variableName} ({preset.year})
                  </Button>
                )
              })}
            </div>
          </div>

          {/* API Test and Fetch Buttons */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={testFredApi} disabled={loading}>
              Test FRED API Connection
            </Button>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                onClick={handleFetchData}
                disabled={loading || selectedVariables.size === 0 || selectedYears.size === 0}
              >
                {loading ? "Fetching..." : "Fetch Data"}
              </Button>
              <Button
                variant="secondary"
                className="flex items-center gap-1"
                disabled={!results}
                onClick={() => {
                  if (results && onDataFetched) {
                    // This will trigger the report generator in the parent component
                    onDataFetched({
                      type: "fred",
                      data: results,
                      action: "report",
                    })
                  }
                }}
              >
                <FileText className="h-4 w-4" />
                Report
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="bg-red-100 text-red-800 border border-red-200">
              <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

      {/* Results Display */}
      {results && (
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Economic Data for {results[0]?.location || "United States"}</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={exportToExcel}>
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="chart">Chart View</TabsTrigger>
              </TabsList>

              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Category</th>
                        <th className="border p-2 text-left">Indicator</th>
                        {results
                          .sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))
                          .map((yearData) => (
                            <th key={yearData.year} className="border p-2 text-left">
                              {yearData.year}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Group all variables by category
                        const categorizedVariables: Record<string, any[]> = {}
                        const allVariables: Record<
                          string,
                          {
                            name: string
                            category: string
                            values: Record<string, string>
                          }
                        > = {}

                        // First pass: gather all unique variables across all years
                        results.forEach((yearResult) => {
                          yearResult.variables.forEach((variable) => {
                            if (!allVariables[variable.code]) {
                              allVariables[variable.code] = {
                                name: variable.name,
                                category: variable.category,
                                values: {},
                              }
                            }
                            allVariables[variable.code].values[yearResult.year] = variable.value
                          })
                        })

                        // Group by category
                        Object.values(allVariables).forEach((variable) => {
                          if (!categorizedVariables[variable.category]) {
                            categorizedVariables[variable.category] = []
                          }
                          categorizedVariables[variable.category].push(variable)
                        })

                        // Sort variables within each category
                        Object.keys(categorizedVariables).forEach((category) => {
                          categorizedVariables[category].sort((a, b) => a.name.localeCompare(b.name))
                        })

                        // Generate table rows
                        const sortedYears = results
                          .sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))
                          .map((r) => r.year)
                        const tableRows = []

                        // For each category
                        Object.entries(categorizedVariables)
                          .sort(([catA], [catB]) => catA.localeCompare(catB))
                          .forEach(([category, variables]) => {
                            // Add category header row
                            tableRows.push(
                              <tr key={`cat-${category}`} className="bg-muted/50">
                                <td colSpan={2 + sortedYears.length} className="border p-2 font-medium">
                                  {category.toUpperCase()}
                                </td>
                              </tr>,
                            )

                            // Add each variable row
                            variables.forEach((variable, idx) => {
                              tableRows.push(
                                <tr key={`var-${variable.name}-${idx}`}>
                                  <td className="border p-2"></td> {/* Indent under category */}
                                  <td className="border p-2">{variable.name}</td>
                                  {sortedYears.map((year) => (
                                    <td key={`val-${year}`} className="border p-2">
                                      {variable.values[year] || "N/A"}
                                    </td>
                                  ))}
                                </tr>,
                              )
                            })
                          })

                        return tableRows
                      })()}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="chart">
                {(() => {
                  const { chartData, variableNames, variableCodes } = prepareChartData()

                  if (chartData.length === 0) {
                    return <p>No data available for chart visualization.</p>
                  }

                  // Only show first 5 variables to avoid overcrowding
                  const displayedVariables = variableCodes.slice(0, 5)

                  return (
                    <ChartContainer
                      config={displayedVariables.reduce(
                        (acc, code, index) => {
                          acc[code] = {
                            label: variableNames[code],
                            color: `hsl(var(--chart-${(index % 5) + 1}))`,
                          }
                          return acc
                        },
                        {} as Record<string, any>,
                      )}
                      className="h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          {displayedVariables.map((code, index) => (
                            <Line
                              key={code}
                              type="monotone"
                              dataKey={code}
                              name={variableNames[code]}
                              stroke={`var(--color-${code})`}
                              activeDot={{ r: 8 }}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )
                })()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </Card>
  )
}

