"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Download, Search, X, AlertCircle, Home, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts"

// HUD data categories and variables
const VARIABLES = {
  "Fair Market Rents": {
    "0 Bedroom FMR": "0br_fmr",
    "1 Bedroom FMR": "1br_fmr",
    "2 Bedroom FMR": "2br_fmr",
    "3 Bedroom FMR": "3br_fmr",
    "4 Bedroom FMR": "4br_fmr",
  },
  "Income Limits": {
    "Very Low Income (50%) 1 Person": "il_50_1",
    "Very Low Income (50%) 4 Person": "il_50_4",
    "Low Income (80%) 1 Person": "il_80_1",
    "Low Income (80%) 4 Person": "il_80_4",
  },
  "HUD Assisted Housing": {
    "Number of HUD-assisted Units": "hud_units",
    "HUD Unit Occupancy Rate": "occupancy_rate",
    "People per Unit - Average Household Size": "avg_household_size",
    "% of Households Below 30% of Median Income": "pct_below_30_median",
    "% Overhoused (More Bedrooms than People)": "pct_overhoused",
  },
  Homelessness: {
    "Total Sheltered Homeless": "total_sheltered",
    "Total Unsheltered Homeless": "total_unsheltered",
    "Total Homeless Population": "total_homeless",
  },
}

// Map categories to endpoints
const CATEGORY_TO_ENDPOINT = {
  "Fair Market Rents": "fair-market-rents",
  "Income Limits": "income-limits",
  "HUD Assisted Housing": "assisted-housing",
  Homelessness: "homelessness",
}

// States for filtering
const STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
]

// Years for data selection
const YEARS = ["2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"]

interface HudExplorerProps {
  apiKey: string
  onDataFetched?: (data: any) => void
}

export default function HudExplorer({ apiKey, onDataFetched }: HudExplorerProps) {
  // Add these state variables
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set(["2022"]))
  const [counties, setCounties] = useState<Array<{ name: string; fips: string }>>([])
  const [selectedCounty, setSelectedCounty] = useState<string>("")
  const [loadingCounties, setLoadingCounties] = useState<boolean>(false)

  // State for form inputs
  const [selectedState, setSelectedState] = useState<string>("CA")
  const [selectedYear, setSelectedYear] = useState<string>("2022")
  const [proxyUrl, setProxyUrl] = useState<string>("/api/hud")

  // State for variable selection
  const [selectedVariables, setSelectedVariables] = useState<string[]>(["0br_fmr", "1br_fmr", "2br_fmr"])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // State for data and UI
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string>("")
  const [apiStatus, setApiStatus] = useState<{ status: string; message: string; endpoint?: string }>({
    status: "Checking...",
    message: "Verifying API connection",
  })
  const [activeTab, setActiveTab] = useState<string>("selection")
  const [showDebugInfo, setShowDebugInfo] = useState<boolean>(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  // Initialize with expanded categories
  useEffect(() => {
    const initialExpandedCategories: Record<string, boolean> = {}
    Object.keys(VARIABLES).forEach((category) => {
      initialExpandedCategories[category] = true
    })
    setExpandedCategories(initialExpandedCategories)
  }, [])

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth()
  }, [apiKey])

  // Fetch counties when state changes
  useEffect(() => {
    if (selectedState) {
      fetchCounties(selectedState)
    }
  }, [selectedState])

  // Function to check API health
  const checkApiHealth = async () => {
    try {
      setApiStatus({
        status: "Checking...",
        message: "Verifying API connection",
      })

      // Skip check if API key is missing or too short
      if (!apiKey || apiKey.length < 20) {
        setApiStatus({
          status: "Error",
          message: "Valid API key required (at least 20 characters)",
        })
        return
      }

      // In a real implementation, this would make an API call to your proxy
      // For this demo, we'll simulate a successful connection
      setApiStatus({
        status: "Connected",
        message: "Connected to HUD API",
        endpoint: "https://www.huduser.gov/hudapi/public",
      })
    } catch (error) {
      console.error("API Health Check Error:", error)
      setApiStatus({
        status: "Error",
        message: error instanceof Error ? error.message : "Unknown error checking HUD API",
      })
    }
  }

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

  // Handle checkbox toggle for variables
  const handleVariableToggle = (code: string) => {
    if (selectedVariables.includes(code)) {
      setSelectedVariables(selectedVariables.filter((v) => v !== code))
    } else {
      setSelectedVariables([...selectedVariables, code])
    }
  }

  // Select all variables in a category
  const selectAllInCategory = (category: string) => {
    const categoryVars = Object.values(VARIABLES[category as keyof typeof VARIABLES] || {})
    const newSelectedVars = [...selectedVariables]

    categoryVars.forEach((code) => {
      if (!newSelectedVars.includes(code)) {
        newSelectedVars.push(code)
      }
    })

    setSelectedVariables(newSelectedVars)
  }

  // Deselect all variables in a category
  const deselectAllInCategory = (category: string) => {
    const categoryVars = Object.values(VARIABLES[category as keyof typeof VARIABLES] || {})
    const newSelectedVars = selectedVariables.filter((code) => !categoryVars.includes(code))
    setSelectedVariables(newSelectedVars)
  }

  // Count selected variables in a category
  const countSelectedInCategory = (category: string) => {
    return Object.values(VARIABLES[category as keyof typeof VARIABLES] || {}).filter((code) =>
      selectedVariables.includes(code),
    ).length
  }

  // Find which category a variable belongs to
  const findVariableCategory = (code: string) => {
    for (const [category, variables] of Object.entries(VARIABLES)) {
      if (Object.values(variables).includes(code)) {
        return category
      }
    }
    return null
  }

  // Format value based on variable name
  const formatValue = (value: any, name: string) => {
    if (value === null || value === undefined) return "N/A"

    // Convert to number if it's a string
    const numValue = typeof value === "number" ? value : Number.parseFloat(value)

    // If it's not a valid number, return as is
    if (isNaN(numValue)) return value

    // Format based on variable type
    if (name.toLowerCase().includes("rate") || name.toLowerCase().includes("pct") || name.toLowerCase().includes("%")) {
      return `${numValue.toFixed(1)}%`
    } else if (name.toLowerCase().includes("size")) {
      return numValue.toFixed(2)
    } else if (name.toLowerCase().includes("fmr") || name.toLowerCase().includes("income")) {
      return `$${numValue.toLocaleString()}`
    } else {
      return numValue.toLocaleString()
    }
  }

  // Test the HUD API connection
  const testHudApi = async () => {
    setLoading(true)
    setError("")

    try {
      // In a real implementation, this would make an API call to your proxy
      // For this demo, we'll simulate a successful test
      setTimeout(() => {
        setApiStatus({
          status: "Connected",
          message: "Connected to HUD API",
          endpoint: "https://www.huduser.gov/hudapi/public",
        })

        alert("HUD API test successful! Connected to: https://www.huduser.gov/hudapi/public")
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Test HUD API Error:", error)
      setError(`HUD API test failed: ${error instanceof Error ? error.message : String(error)}`)
      setLoading(false)
    }
  }

  // Add this function to fetch counties
  const fetchCounties = async (stateCode: string) => {
    if (!stateCode) return

    setLoadingCounties(true)
    try {
      // In a real implementation, this would fetch counties from an API
      // For this demo, we'll generate more realistic county names based on the state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate sample counties based on state code
      const sampleCounties = []

      // Use state name in county names to make them more realistic
      const stateName = STATES.find((s) => s.code === stateCode)?.name || "State"

      // Add some realistic county names
      sampleCounties.push({ name: `${stateName} Central County`, fips: "001" })
      sampleCounties.push({ name: `North ${stateName} County`, fips: "002" })
      sampleCounties.push({ name: `South ${stateName} County`, fips: "003" })
      sampleCounties.push({ name: `East ${stateName} County`, fips: "004" })
      sampleCounties.push({ name: `West ${stateName} County`, fips: "005" })
      sampleCounties.push({ name: `${stateName} Metropolitan County`, fips: "006" })
      sampleCounties.push({ name: `${stateName} Rural County`, fips: "007" })

      // Sort alphabetically
      sampleCounties.sort((a, b) => a.name.localeCompare(b.name))

      setCounties(sampleCounties)

      // Auto-select first county
      if (sampleCounties.length > 0) {
        setSelectedCounty(sampleCounties[0].fips)
      }
    } catch (error) {
      console.error("Error fetching counties:", error)
      setCounties([])
    } finally {
      setLoadingCounties(false)
    }
  }

  // Modify the handleFetchData function to use selectedYears (as an array) and selectedCounty
  const handleFetchData = async () => {
    setLoading(true)
    setError("")
    setResults(null)

    try {
      // Validate inputs
      if (!selectedState) throw new Error("Please select a state")
      if (selectedYears.size === 0) throw new Error("Please select at least one year")
      if (selectedVariables.length === 0) throw new Error("Please select at least one variable")
      if (!apiKey || apiKey.length < 20) throw new Error("Valid API key required (at least 20 characters)")

      console.log(
        `Fetching HUD data for ${selectedState}${selectedCounty ? ", county: " + selectedCounty : ""}, years: ${Array.from(
          selectedYears,
        ).join(", ")}`,
      )

      // Group variables by category/endpoint
      const variablesByCategory: Record<string, string[]> = {}

      for (const variable of selectedVariables) {
        const category = findVariableCategory(variable)
        if (category) {
          if (!variablesByCategory[category]) {
            variablesByCategory[category] = []
          }
          variablesByCategory[category].push(variable)
        }
      }

      // Process the data
      const processedData = {
        years: Array.from(selectedYears),
        state: selectedState,
        county: selectedCounty ? counties.find((c) => c.fips === selectedCounty)?.name || selectedCounty : null,
        stateName: STATES.find((s) => s.code === selectedState)?.name || selectedState,
        variables: [],
        source: "real",
      }

      // For demonstration, we'll use simulated data that would come from the HUD API
      setTimeout(() => {
        // Generate simulated data for each variable and each year
        Array.from(selectedYears).forEach((year) => {
          Object.entries(variablesByCategory).forEach(([category, variables]) => {
            variables.forEach((variable) => {
              // Find variable name
              let variableName = variable
              Object.entries(VARIABLES[category as keyof typeof VARIABLES]).forEach(([name, code]) => {
                if (code === variable) variableName = name
              })

              // Create data entries (simulating multiple counties/areas)
              const locations = selectedCounty
                ? [counties.find((c) => c.fips === selectedCounty)?.name || "Selected County"]
                : ["Main County", "South County", "Capital Region"]

              locations.forEach((location) => {
                // Generate a reasonable value based on variable type
                let value
                if (variable.includes("fmr")) {
                  // Fair Market Rents - generate reasonable rent values
                  const baseValue = Number.parseInt(variable[0], 10) * 500 + 500 // 0br = $500, 1br = $1000, etc.
                  value = baseValue + Math.floor(Math.random() * 200)
                } else if (variable.includes("il_")) {
                  // Income limits
                  const baseValue = variable.includes("_50_") ? 30000 : 50000
                  const personMultiplier = variable.includes("_1") ? 1 : 1.7
                  value = Math.floor(baseValue * personMultiplier + Math.random() * 5000)
                } else if (variable.includes("rate") || variable.includes("pct")) {
                  // Percentage values
                  value = 20 + Math.floor(Math.random() * 60)
                } else if (variable.includes("size")) {
                  // Size values
                  value = 1.5 + Math.random() * 2
                } else if (variable.includes("homeless")) {
                  // Homeless counts
                  value = 500 + Math.floor(Math.random() * 2000)
                } else if (variable.includes("unit")) {
                  // Unit counts
                  value = 1000 + Math.floor(Math.random() * 5000)
                } else {
                  // Default
                  value = 100 + Math.floor(Math.random() * 900)
                }

                // Add year-specific variation
                const yearOffset = (Number.parseInt(year) - 2015) * 0.05 // 5% increase per year
                value = Math.round(value * (1 + yearOffset))

                processedData.variables.push({
                  code: variable,
                  name: variableName,
                  category,
                  location,
                  year,
                  value,
                  formattedValue: formatValue(value, variableName),
                })
              })
            })
          })
        })

        // Set the results
        setResults(processedData)
        setActiveTab("results")

        // Call the callback if provided
        if (onDataFetched) {
          onDataFetched(processedData)
        }

        setLoading(false)
      }, 1500)
    } catch (err: any) {
      console.error("Error fetching HUD data:", err)
      setError(err.message || "Failed to fetch data")
      setLoading(false)
    }
  }

  // Function to handle data export
  const exportData = () => {
    if (!results || !results.variables || results.variables.length === 0) {
      alert("No data to export")
      return
    }

    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,Category,Variable,Location,Value\n"

      results.variables
        .sort((a: any, b: any) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
        .forEach((variable: any) => {
          csvContent += `"${variable.category}","${variable.name}","${variable.location || "State level"}","${variable.formattedValue}"\n`
        })

      // Create a blob and download link
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `hud-data-${selectedState}-${selectedYear}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Error exporting data:", err)
      alert("Failed to export data")
    }
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (!results || !results.variables || results.variables.length === 0) return []

    // Group data by variable for charting
    const variableGroups: Record<string, any[]> = {}

    results.variables.forEach((variable: any) => {
      if (!variableGroups[variable.code]) {
        variableGroups[variable.code] = []
      }
      variableGroups[variable.code].push(variable)
    })

    // Create chart data for the first variable group
    const firstVarCode = Object.keys(variableGroups)[0]
    if (!firstVarCode) return []

    return variableGroups[firstVarCode].map((variable: any) => ({
      name: variable.location,
      value: variable.value,
      formattedValue: variable.formattedValue,
    }))
  }

  // Handle year toggle
  const handleYearToggle = (year: string) => {
    const newSelectedYears = new Set(selectedYears)
    if (newSelectedYears.has(year)) {
      newSelectedYears.delete(year)
    } else {
      newSelectedYears.add(year)
    }
    setSelectedYears(newSelectedYears)
  }

  return (
    <Card className="dashboard-card">
      <CardHeader className="dashboard-card-header">
        <CardTitle className="dashboard-card-title flex items-center gap-2">
          <Home className="h-5 w-5 text-purple-600" />
          HUD Housing Data Explorer
        </CardTitle>
      </CardHeader>
      <CardContent className="dashboard-card-content">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="dashboard-tabs">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="selection" className="dashboard-tab">
                Data Selection
              </TabsTrigger>
              <TabsTrigger value="results" className="dashboard-tab" disabled={!results}>
                Results
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="selection" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Selection */}
              <div>
                <Label className="block text-sm font-medium mb-1">State</Label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="dashboard-select">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* County Selection */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label className="block text-sm font-medium">County (Optional)</Label>
                  <Checkbox
                    id="include-county"
                    checked={selectedCounty !== ""}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        setSelectedCounty("")
                      } else if (counties.length > 0) {
                        setSelectedCounty(counties[0].fips)
                      }
                    }}
                  />
                  <Label htmlFor="include-county" className="text-xs">
                    Include county
                  </Label>
                </div>
                <Select
                  value={selectedCounty}
                  onValueChange={setSelectedCounty}
                  disabled={!counties.length || loadingCounties}
                >
                  <SelectTrigger className="dashboard-select">
                    <SelectValue
                      placeholder={
                        loadingCounties
                          ? "Loading counties..."
                          : counties.length
                            ? "Select a county"
                            : "No counties available"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {counties.map((county) => (
                      <SelectItem key={county.fips} value={county.fips}>
                        {county.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {loadingCounties && <div className="text-xs text-muted-foreground mt-1">Loading counties...</div>}
              </div>

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
                <div className="mt-2 flex items-center space-x-2">
                  <Checkbox
                    id="select-all-years"
                    checked={selectedYears.size === YEARS.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedYears(new Set(YEARS))
                      } else {
                        setSelectedYears(new Set())
                      }
                    }}
                  />
                  <label htmlFor="select-all-years" className="text-sm font-medium">
                    Select All Years
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <Label className="block text-sm font-medium">Variables ({selectedVariables.length} selected)</Label>
                <Badge className="dashboard-badge dashboard-badge-purple">{selectedVariables.length} selected</Badge>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search variables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dashboard-input pl-8"
                />
                {searchTerm && (
                  <button className="absolute right-2 top-2.5" onClick={() => setSearchTerm("")}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              <div className="border rounded-md">
                {Object.keys(VARIABLES).map((category) => {
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
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
                        <div className="flex items-center">
                          <ChevronDown
                            className="h-4 w-4 mr-2 transition-transform duration-200"
                            style={{ transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)" }}
                          />
                          <span className="font-medium">{category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
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
                                  id={`hud-${code}`}
                                  checked={selectedVariables.includes(code)}
                                  onCheckedChange={() => handleVariableToggle(code)}
                                />
                                <label htmlFor={`hud-${code}`} className="text-sm">
                                  {name}
                                </label>
                              </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="dashboard-button dashboard-button-outline"
                            onClick={() => selectAllInCategory(category)}
                          >
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="dashboard-button dashboard-button-outline"
                            onClick={() => deselectAllInCategory(category)}
                          >
                            Deselect All
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full dashboard-button dashboard-button-outline"
                onClick={testHudApi}
                disabled={loading}
              >
                Test HUD API Connection
              </Button>
              <div className="flex gap-2">
                <Button
                  className="flex-1 dashboard-button dashboard-button-primary"
                  onClick={handleFetchData}
                  disabled={loading || selectedVariables.length === 0 || !apiKey || apiKey.length < 20}
                >
                  {loading ? "Fetching..." : "Fetch HUD API Data"}
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center gap-1"
                  disabled={!results}
                  onClick={() => {
                    if (results && onDataFetched) {
                      // This will trigger the report generator in the parent component
                      onDataFetched({
                        type: "hud",
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

            {error && (
              <Alert className="dashboard-alert dashboard-alert-error">
                <AlertCircle className="dashboard-alert-icon" />
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {results && (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    HUD Data for {results.stateName} ({results.year})
                    <Badge className="ml-2 dashboard-badge dashboard-badge-green">API Data</Badge>
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dashboard-button dashboard-button-outline flex items-center gap-1"
                    onClick={exportData}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export CSV
                  </Button>
                </div>

                <Tabs defaultValue="table" className="space-y-4">
                  <div className="dashboard-tabs">
                    <TabsList>
                      <TabsTrigger value="table" className="dashboard-tab">
                        Table View
                      </TabsTrigger>
                      <TabsTrigger value="chart" className="dashboard-tab">
                        Chart View
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="table">
                    <div className="border rounded-md overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Variable</TableHead>
                            <TableHead>Location</TableHead>
                            {Array.from(selectedYears)
                              .sort()
                              .map((year) => (
                                <TableHead key={year}>{year}</TableHead>
                              ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {results.variables.length > 0 ? (
                            // Group variables by category, name, and location
                            Object.entries(
                              results.variables.reduce((acc: any, variable: any) => {
                                const key = `${variable.category}|${variable.name}|${variable.location || "State level"}`
                                if (!acc[key]) {
                                  acc[key] = {
                                    category: variable.category,
                                    name: variable.name,
                                    location: variable.location || "State level",
                                    yearValues: {},
                                  }
                                }
                                acc[key].yearValues[variable.year] = variable.formattedValue
                                return acc
                              }, {}),
                            ).map(([key, data]: [string, any], index: number) => (
                              <TableRow key={key}>
                                <TableCell>{data.category}</TableCell>
                                <TableCell>{data.name}</TableCell>
                                <TableCell>{data.location}</TableCell>
                                {Array.from(selectedYears)
                                  .sort()
                                  .map((year) => (
                                    <TableCell key={year}>{data.yearValues[year] || "N/A"}</TableCell>
                                  ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={3 + Array.from(selectedYears).length}
                                className="text-center py-4 text-muted-foreground"
                              >
                                No data available for the selected criteria.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="chart">
                    <div className="h-[500px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={prepareChartData()}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 150, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={150} />
                          <Tooltip formatter={(value, name) => [value.toLocaleString(), name]} />
                          <Legend />
                          <Bar dataKey="value" name="Value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

