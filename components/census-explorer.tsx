"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Download, Search, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Constants - Using the comprehensive variables list
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

// Comprehensive variables list
const VARIABLES = {
  Population: {
    "Total Population": "B01003_001E",
    "Population Age 0-17": "B09001_001E",
    "Population Age 18-24": "B01001_007E",
    "Population Age 25+": "B15003_001E",
    "Working Age Adult Fraction (20-64)": "B23001_001E",
  },

  Households: {
    "Total Households": "B11001_001E",
    "Total Families": "B11001_002E",
    "Single-Parent Households (Male)": "B11003_010E",
    "Single-Parent Households (Female)": "B11003_016E",
    "Transit Dependent Population": "B08141_001E",
  },

  "Race & Ethnicity": {
    "Hispanic/Latino Population": "B03003_003E",
    "Non-Hispanic/Latino Population": "B03003_002E",
    "White Population (non-Hispanic)": "B03002_003E",
    "African American Population (non-Hispanic)": "B03002_004E",
    "American Indian Population (non-Hispanic)": "B03002_005E",
    "Asian Population (non-Hispanic)": "B03002_006E",
    "Pacific Islander Population (non-Hispanic)": "B03002_007E",
    "Some Other Race Population": "B03002_008E",
    "Two or More Races Population": "B03002_009E",
  },

  "Vital Statistics": {
    Births: "B13016_001E",
    Deaths: "B01001_001E", // Note: This is a placeholder as actual death data may require different sources
  },

  Housing: {
    "Total Housing Units": "B25001_001E",
    "Occupied Housing Units": "B25002_002E",
    "Owner Occupied Housing Units": "B25003_002E",
    "Renter Occupied Housing Units": "B25003_003E",
    "Vacant - For Rent": "B25004_002E",
    "Vacant - Rented Not Yet Occupied": "B25004_003E",
    "Vacant - For Sale": "B25004_004E",
    "Vacant - Sold Not Yet Occupied": "B25004_005E",
    "Vacant - Seasonal Occupant": "B25004_006E",
    "Median Home Value": "B25077_001E",
    "African American Owner-Occupied Housing": "B25003B_002E",
    "American Indian Owner-Occupied Housing": "B25003C_002E",
    "Asian Owner-Occupied Housing": "B25003D_002E",
    "Hispanic Owner-Occupied Housing": "B25003I_002E",
  },

  "Housing Costs": {
    "Gross Rent As % Income - 30-34%": "B25070_007E",
    "Gross Rent As % Income - 35%+": "B25070_008E",
    "Housing Cost as % Income - Mortgage - 30-34%": "B25091_008E",
    "Housing Cost as % Income - Mortgage - 35%+": "B25091_009E",
  },

  Income: {
    "Median Household Income": "B19013_001E",
    "Mean Household Income": "B19025_001E",
    "Gini Index of Income": "B19083_001E",
    "Households in Poverty": "B17001_002E",
    "Household w/ Income Below 50% of Poverty Level": "B17026_002E",
    "Household w/ Income Below 125% of Poverty Level": "B17026_003E",
    "Household w/ Income Below 150% of Poverty Level": "B17026_004E",
    "Household w/ Income Below 185% of Poverty Level": "B17026_005E",
    "Household w/ Income Below 200% of Poverty Level": "B17026_006E",
    "Household w/ Income Below 300% of Poverty Level": "B17026_007E",
    "Household w/ Income Below 400% of Poverty Level": "B17026_008E",
    "Household w/ Income Below 500% of Poverty Level": "B17026_009E",
  },

  Employment: {
    "Unemployment Count": "B23025_005E",
    "Population in Labor Force": "B23025_002E",
    "Working Age Adults in Labor Force (20-64)": "B23001_006E",
    "Workers with Full-Time Year-Round Positions (16+)": "B23022_001E",
  },

  Education: {
    "No HS Degree (Age 18-24)": "B15001_004E",
    "HS Degree Population (Age 18-24)": "B15001_005E",
    "Some College + Associate (Age 18-24)": "B15001_006E",
    "Bachelor Degree and Higher (Age 18-24)": "B15001_007E",
    "Less than 9th Grade (Age 25+)": "B15003_002E",
    "9th to 12th Grade, No Diploma (Age 25+)": "B15003_003E",
    "Bachelor Degree and Higher (25+)": "B15003_022E",
    "Employed Workers with Less than HS Degree (25+)": "B23006_003E",
    "Employed Workers with HS Degree (25+)": "B23006_004E",
    "Employed Workers with Assoc Degree or Some College (25+)": "B23006_005E",
    "Employed Workers with Bachelors Degree or Higher (25+)": "B23006_006E",
    "Total High School Enrollment": "B14001_003E",
    "Total College Enrollment": "B14001_008E",
  },
}

// All U.S. States and Territories with FIPS codes
const ALL_STATES = {
  AL: { name: "Alabama", fips: "01" },
  AK: { name: "Alaska", fips: "02" },
  AZ: { name: "Arizona", fips: "04" },
  AR: { name: "Arkansas", fips: "05" },
  CA: { name: "California", fips: "06" },
  CO: { name: "Colorado", fips: "08" },
  CT: { name: "Connecticut", fips: "09" },
  DE: { name: "Delaware", fips: "10" },
  DC: { name: "District of Columbia", fips: "11" },
  FL: { name: "Florida", fips: "12" },
  GA: { name: "Georgia", fips: "13" },
  HI: { name: "Hawaii", fips: "15" },
  ID: { name: "Idaho", fips: "16" },
  IL: { name: "Illinois", fips: "17" },
  IN: { name: "Indiana", fips: "18" },
  IA: { name: "Iowa", fips: "19" },
  KS: { name: "Kansas", fips: "20" },
  KY: { name: "Kentucky", fips: "21" },
  LA: { name: "Louisiana", fips: "22" },
  ME: { name: "Maine", fips: "23" },
  MD: { name: "Maryland", fips: "24" },
  MA: { name: "Massachusetts", fips: "25" },
  MI: { name: "Michigan", fips: "26" },
  MN: { name: "Minnesota", fips: "27" },
  MS: { name: "Mississippi", fips: "28" },
  MO: { name: "Missouri", fips: "29" },
  MT: { name: "Montana", fips: "30" },
  NE: { name: "Nebraska", fips: "31" },
  NV: { name: "Nevada", fips: "32" },
  NH: { name: "New Hampshire", fips: "33" },
  NJ: { name: "New Jersey", fips: "34" },
  NM: { name: "New Mexico", fips: "35" },
  NY: { name: "New York", fips: "36" },
  NC: { name: "North Carolina", fips: "37" },
  ND: { name: "North Dakota", fips: "38" },
  OH: { name: "Ohio", fips: "39" },
  OK: { name: "Oklahoma", fips: "40" },
  OR: { name: "Oregon", fips: "41" },
  PA: { name: "Pennsylvania", fips: "42" },
  RI: { name: "Rhode Island", fips: "44" },
  SC: { name: "South Carolina", fips: "45" },
  SD: { name: "South Dakota", fips: "46" },
  TN: { name: "Tennessee", fips: "47" },
  TX: { name: "Texas", fips: "48" },
  UT: { name: "Utah", fips: "49" },
  VT: { name: "Vermont", fips: "50" },
  VA: { name: "Virginia", fips: "51" },
  WA: { name: "Washington", fips: "53" },
  WV: { name: "West Virginia", fips: "54" },
  WI: { name: "Wisconsin", fips: "55" },
  WY: { name: "Wyoming", fips: "56" },
  PR: { name: "Puerto Rico", fips: "72" },
}

// Fallback counties for reliable states if API county fetch fails
const FALLBACK_COUNTIES = {
  CA: [
    { name: "Los Angeles County", fips: "037" },
    { name: "San Diego County", fips: "073" },
    { name: "Orange County", fips: "059" },
    { name: "Alameda County", fips: "001" },
    { name: "Santa Clara County", fips: "085" },
  ],
  TX: [
    { name: "Harris County", fips: "201" },
    { name: "Dallas County", fips: "113" },
    { name: "Travis County", fips: "453" },
    { name: "Bexar County", fips: "029" },
    { name: "Tarrant County", fips: "439" },
  ],
  NY: [
    { name: "New York County", fips: "061" },
    { name: "Kings County", fips: "047" },
    { name: "Queens County", fips: "081" },
    { name: "Bronx County", fips: "005" },
    { name: "Richmond County", fips: "085" },
  ],
  FL: [
    { name: "Miami-Dade County", fips: "086" },
    { name: "Broward County", fips: "011" },
    { name: "Palm Beach County", fips: "099" },
    { name: "Hillsborough County", fips: "057" },
    { name: "Orange County", fips: "095" },
  ],
}

// Known good combinations for testing
const RELIABLE_COMBINATIONS = [
  {
    state: "CA",
    county: "037", // Los Angeles
    year: "2019",
    variable: "B01003_001E", // Total Population
  },
  {
    state: "NY",
    county: "061", // Manhattan
    year: "2018",
    variable: "B19013_001E", // Median Household Income
  },
]

interface CensusExplorerProps {
  apiKey: string
  onDataFetched?: (data: any) => void
}

export default function CensusExplorer({ apiKey, onDataFetched }: CensusExplorerProps) {
  const [selectedState, setSelectedState] = useState<string>("CA") // Default to California
  const [selectedCounty, setSelectedCounty] = useState<string>("")
  const [selectedYears, setSelectedYears] = useState<Set<string>>(new Set(["2019"])) // Default to 2019
  const [selectedVariables, setSelectedVariables] = useState<Set<string>>(new Set(["B01003_001E"])) // Default to Total Population
  const [counties, setCounties] = useState<Array<{ name: string; fips: string }>>([])
  const [loadingCounties, setLoadingCounties] = useState<boolean>(false)
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
        const response = await fetch(`https://api.census.gov/data/2020/acs/acs5?get=NAME&for=state:*&key=${apiKey}`)

        if (response.ok) {
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

  // Function to fetch counties for a state
  const fetchCounties = async (stateFips: string) => {
    setLoadingCounties(true)
    setError("") // Clear any previous errors
    try {
      // Try to get counties from Census API
      const url = `https://api.census.gov/data/2019/acs/acs5?get=NAME&for=county:*&in=state:${stateFips}&key=${apiKey}`
      console.log("Fetching counties from:", url)

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()

        // Process API response
        if (Array.isArray(data) && data.length > 1) {
          const [headers, ...countyData] = data
          console.log("Received county data:", data.length, "rows")

          // Create array of county objects
          const fetchedCounties = countyData.map((county) => {
            // NAME format is usually "County Name, State Name"
            const countyName = county[0].split(",")[0]
            const countyFips = county[headers.indexOf("county")]

            return {
              name: countyName,
              fips: countyFips,
            }
          })

          // Sort counties alphabetically
          fetchedCounties.sort((a, b) => a.name.localeCompare(b.name))
          setCounties(fetchedCounties)
          console.log("Processed counties:", fetchedCounties.length)

          // Auto-select first county if available
          if (fetchedCounties.length > 0) {
            setSelectedCounty(fetchedCounties[0].fips)
            console.log("Auto-selected county:", fetchedCounties[0].name, fetchedCounties[0].fips)
          } else {
            console.log("No counties found in response")
            setError("No counties found for the selected state")
          }
        } else {
          console.error("Invalid response format from Census API:", data)
          throw new Error("Invalid response format from Census API")
        }
      } else {
        console.error("Failed to fetch counties, status:", response.status)
        throw new Error(`Failed to fetch counties: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("Error fetching counties:", error)

      // Fall back to hardcoded counties if available
      const stateCode = Object.keys(ALL_STATES).find((code) => ALL_STATES[code].fips === stateFips)

      if (stateCode && FALLBACK_COUNTIES[stateCode as keyof typeof FALLBACK_COUNTIES]) {
        console.log(`Using fallback counties for ${stateCode}`)
        const fallbackCounties = FALLBACK_COUNTIES[stateCode as keyof typeof FALLBACK_COUNTIES]
        setCounties(fallbackCounties)
        setSelectedCounty(fallbackCounties[0].fips)
        console.log("Using fallback county:", fallbackCounties[0].name, fallbackCounties[0].fips)
      } else {
        // If no fallback counties, show error
        setError(`Could not load counties for the selected state. Please try a different state.`)
        setCounties([])
        setSelectedCounty("")
      }
    } finally {
      setLoadingCounties(false)
    }
  }

  // Update counties when state changes
  useEffect(() => {
    if (selectedState) {
      const stateFips = ALL_STATES[selectedState as keyof typeof ALL_STATES]?.fips
      if (stateFips) {
        fetchCounties(stateFips)
      }
    } else {
      setCounties([])
      setSelectedCounty("")
    }
  }, [selectedState])

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
    setSelectedState(preset.state)
    setTimeout(() => {
      setSelectedCounty(preset.county)
      setSelectedYears(new Set([preset.year]))
      setSelectedVariables(new Set([preset.variable]))
    }, 100) // Small timeout to allow the county list to update
  }

  // Test the Census API directly
  const testCensusApi = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`https://api.census.gov/data/2019/acs/acs5?get=NAME&for=state:*&key=${apiKey}`)

      if (response.ok) {
        alert("Census API test successful! The API is working.")
      } else {
        setError("Census API test failed. Check your API key or try again later.")
      }
    } catch (error) {
      console.error("Test Census API Error:", error)
      setError(`Census API test failed. Please check your internet connection.`)
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

  // Fetch data from the API
  const handleFetchData = async () => {
    setLoading(true)
    setError("")
    setResults(null)

    try {
      // Validate inputs
      if (!selectedState) throw new Error("Please select a state")
      if (!selectedCounty) throw new Error("Please select a county")
      if (selectedYears.size === 0) throw new Error("Please select at least one year")
      if (selectedVariables.size === 0) throw new Error("Please select at least one variable")

      // Check if too many variables are selected
      if (selectedVariables.size > 50) {
        throw new Error("Too many variables selected. Please select 50 or fewer variables to avoid API limitations.")
      }

      const processedResults = []

      // Process each selected year
      for (const year of selectedYears) {
        try {
          // Prepare variables string
          const variablesArray = Array.from(selectedVariables)

          // Fetch data from Census API
          const stateFips = ALL_STATES[selectedState as keyof typeof ALL_STATES].fips
          const url = `https://api.census.gov/data/${year}/acs/acs5?get=NAME,${variablesArray.join(",")}&for=county:${selectedCounty}&in=state:${stateFips}&key=${apiKey}`

          console.log(`Fetching data for ${year}...`)
          console.log("Request URL:", url)

          const response = await fetch(url)

          if (!response.ok) {
            throw new Error(`API returned status ${response.status}`)
          }

          const data = await response.json()

          if (!Array.isArray(data) || data.length < 2) {
            throw new Error("Invalid response format from Census API")
          }

          // Process the response
          const [headers, values] = data

          // Create an object with the data
          const censusData: Record<string, any> = {}
          headers.forEach((header: string, index: number) => {
            censusData[header] = values[index]
          })

          console.log(`Received data for ${year}:`, censusData)

          // Format the results for display
          const formattedVariables = variablesArray.map((code) => {
            // Find the category and name for this variable
            let category = "Other"
            let name = code

            for (const [cat, vars] of Object.entries(VARIABLES)) {
              for (const [varName, varCode] of Object.entries(vars)) {
                if (varCode === code) {
                  category = cat
                  name = varName
                  break
                }
              }
            }

            // Get the value from the API response
            const value = censusData[code]

            // Format the value for display
            let formattedValue = "N/A"
            if (value && !isNaN(Number(value))) {
              formattedValue = name.toLowerCase().includes("income")
                ? `$${Number.parseInt(value).toLocaleString()}`
                : Number.parseInt(value).toLocaleString()
            }

            return {
              code,
              name,
              category,
              value: formattedValue,
              rawValue: Number.parseInt(value) || 0,
            }
          })

          // Add this year's results to the processed results
          processedResults.push({
            year,
            location: censusData["NAME"],
            variables: formattedVariables.sort(
              (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name),
            ),
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Census Data Explorer</h2>

        {apiStatus.status !== "Connected" && (
          <Alert className="mb-4 bg-red-100 text-red-800 border border-red-200">
            <AlertDescription>
              API Status: {apiStatus.status} - {apiStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* State Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <Select
              value={selectedState}
              onValueChange={(value) => {
                setSelectedState(value)
                setSelectedCounty("")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ALL_STATES)
                  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                  .map(([code, state]) => (
                    <SelectItem key={code} value={code}>
                      {state.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* County Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">County</label>
            <Select
              value={selectedCounty}
              onValueChange={setSelectedCounty}
              disabled={!selectedState || loadingCounties}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingCounties ? "Loading counties..." : "Select a county"} />
              </SelectTrigger>
              <SelectContent>
                {counties.map((county) => (
                  <SelectItem key={county.fips} value={county.fips}>
                    {county.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {loadingCounties && <div className="text-sm text-muted-foreground mt-1">Loading counties...</div>}
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Years (2019 and earlier are most reliable)</label>
            <div className="grid grid-cols-7 gap-2">
              {YEARS.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={selectedYears.has(year)}
                    onCheckedChange={() => handleYearToggle(year)}
                  />
                  <label htmlFor={`year-${year}`} className="text-sm">
                    {year}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Variable Selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Variables <span className="text-xs text-muted-foreground">({selectedVariables.size} selected)</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search variables..."
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
                                id={code}
                                checked={selectedVariables.has(code)}
                                onCheckedChange={() => handleVariableToggle(code)}
                              />
                              <label htmlFor={code} className="text-sm">
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
                const stateName = ALL_STATES[preset.state as keyof typeof ALL_STATES].name
                const countyName =
                  FALLBACK_COUNTIES[preset.state as keyof typeof FALLBACK_COUNTIES]?.find(
                    (c) => c.fips === preset.county,
                  )?.name || preset.county

                return (
                  <Button key={index} variant="outline" size="sm" onClick={() => applyReliablePreset(preset)}>
                    {stateName} - {countyName} ({preset.year})
                  </Button>
                )
              })}
            </div>
          </div>

          {/* API Test and Fetch Buttons */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={testCensusApi} disabled={loading}>
              Test Census API Connection
            </Button>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                onClick={handleFetchData}
                disabled={
                  loading ||
                  !selectedState ||
                  !selectedCounty ||
                  selectedVariables.size === 0 ||
                  selectedYears.size === 0
                }
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
                      type: "census",
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
              <h2 className="text-xl font-semibold">Results for {results[0]?.location || "Selected Location"}</h2>
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
                        <th className="border p-2 text-left">Variable</th>
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
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          {displayedVariables.map((code, index) => (
                            <Bar key={code} dataKey={code} name={variableNames[code]} fill={`var(--color-${code})`} />
                          ))}
                        </BarChart>
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

