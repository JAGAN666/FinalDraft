"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
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
import {
  AlertCircle,
  Plus,
  Trash2,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  AreaChartIcon,
  ArrowUpDown,
  Download,
  FileText,
} from "lucide-react"

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

  Housing: {
    "Total Housing Units": "B25001_001E",
    "Occupied Housing Units": "B25002_002E",
    "Owner Occupied Housing Units": "B25003_002E",
    "Renter Occupied Housing Units": "B25003_003E",
    "Vacant - For Rent": "B25004_002E",
    "Vacant - For Sale": "B25004_004E",
    "Median Home Value": "B25077_001E",
  },

  Income: {
    "Median Household Income": "B19013_001E",
    "Mean Household Income": "B19025_001E",
    "Gini Index of Income": "B19083_001E",
    "Households in Poverty": "B17001_002E",
    "Household w/ Income Below 50% of Poverty Level": "B17026_002E",
    "Household w/ Income Below 200% of Poverty Level": "B17026_006E",
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
    "Bachelor Degree and Higher (Age 18-24)": "B15001_007E",
    "Less than 9th Grade (Age 25+)": "B15003_002E",
    "9th to 12th Grade, No Diploma (Age 25+)": "B15003_003E",
    "Bachelor Degree and Higher (25+)": "B15003_022E",
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

// Chart colors
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]

// Create flat list of variables for easier selection
const FLAT_VARIABLES = Object.entries(VARIABLES).flatMap(([category, variables]) =>
  Object.entries(variables).map(([name, code]) => ({
    category,
    name,
    code,
  })),
)

interface CountyComparisonProps {
  apiKey: string
  onDataFetched?: (data: any) => void
}

export default function CountyComparison({ apiKey, onDataFetched }: CountyComparisonProps) {
  // State for comparison selections
  const [comparisonCounties, setComparisonCounties] = useState([
    {
      stateCode: "CA",
      stateName: "California",
      countyFips: "",
      countyName: "",
      data: null as any,
      loading: false,
      error: "",
    },
    {
      stateCode: "NY",
      stateName: "New York",
      countyFips: "",
      countyName: "",
      data: null as any,
      loading: false,
      error: "",
    },
  ])

  // Comparison settings
  const [selectedYear, setSelectedYear] = useState("2019")
  const [selectedVariables, setSelectedVariables] = useState([
    "B01003_001E", // Total Population
    "B19013_001E", // Median Household Income
    "B25077_001E", // Median Home Value
  ])
  const [selectedChartType, setSelectedChartType] = useState("bar")
  const [showGapAnalysis, setShowGapAnalysis] = useState(false)
  const [countyLists, setCountyLists] = useState<Record<string, Array<{ name: string; fips: string }>>>({})
  const [activeTab, setActiveTab] = useState("selection")
  const [normalizeData, setNormalizeData] = useState(false)

  // Function to fetch counties for a state
  const fetchCounties = async (stateCode: string) => {
    if (!stateCode) return []

    // If we already have counties for this state, return them
    if (countyLists[stateCode]) {
      console.log(`Using cached counties for ${stateCode}:`, countyLists[stateCode].length)
      return countyLists[stateCode]
    }

    const stateFips = ALL_STATES[stateCode as keyof typeof ALL_STATES]?.fips
    if (!stateFips) {
      console.error("Invalid state code:", stateCode)
      return []
    }

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

          // Store in state
          setCountyLists((prev) => ({
            ...prev,
            [stateCode]: fetchedCounties,
          }))

          console.log(`Stored ${fetchedCounties.length} counties for ${stateCode}`)
          return fetchedCounties
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
      if (FALLBACK_COUNTIES[stateCode as keyof typeof FALLBACK_COUNTIES]) {
        console.log(`Using fallback counties for ${stateCode}`)
        const fallbackCounties = FALLBACK_COUNTIES[stateCode as keyof typeof FALLBACK_COUNTIES]

        setCountyLists((prev) => ({
          ...prev,
          [stateCode]: fallbackCounties,
        }))

        return fallbackCounties
      }

      // If we get here, we couldn't get counties from API or fallback
      console.error("No counties available for", stateCode)
      return []
    }
  }

  // Handle state selection change
  const handleStateChange = async (index: number, stateCode: string) => {
    const newComparisonCounties = [...comparisonCounties]
    const state = ALL_STATES[stateCode as keyof typeof ALL_STATES]

    if (!state) return

    newComparisonCounties[index] = {
      ...newComparisonCounties[index],
      stateCode,
      stateName: state.name,
      countyFips: "",
      countyName: "",
      data: null,
      error: "",
    }

    setComparisonCounties(newComparisonCounties)

    // Fetch counties for this state if we don't have them yet
    console.log("Fetching counties for state change:", stateCode)
    const counties = await fetchCounties(stateCode)

    // If we got counties and the state is still the same (user didn't change it again)
    if (counties.length > 0 && comparisonCounties[index].stateCode === stateCode) {
      console.log(`Auto-selecting first county for ${stateCode}:`, counties[0].name)

      // Auto-select the first county
      const updatedComparisonCounties = [...comparisonCounties]
      updatedComparisonCounties[index] = {
        ...updatedComparisonCounties[index],
        countyFips: counties[0].fips,
        countyName: counties[0].name,
      }

      setComparisonCounties(updatedComparisonCounties)
    }
  }

  // Handle county selection change
  const handleCountyChange = (index: number, countyFips: string) => {
    const counties = countyLists[comparisonCounties[index].stateCode]
    if (!counties) return

    const county = counties.find((c) => c.fips === countyFips)
    if (!county) return

    const newComparisonCounties = [...comparisonCounties]
    newComparisonCounties[index] = {
      ...newComparisonCounties[index],
      countyFips,
      countyName: county.name,
      data: null,
      error: "",
    }

    setComparisonCounties(newComparisonCounties)
  }

  // Add another county for comparison
  const addCountyComparison = () => {
    if (comparisonCounties.length >= 5) {
      alert("Maximum of 5 counties for comparison")
      return
    }

    setComparisonCounties([
      ...comparisonCounties,
      {
        stateCode: "CA",
        stateName: "California",
        countyFips: "",
        countyName: "",
        data: null,
        loading: false,
        error: "",
      },
    ])
  }

  // Remove a county from comparison
  const removeCountyComparison = (index: number) => {
    if (comparisonCounties.length <= 2) {
      alert("Minimum of 2 counties required for comparison")
      return
    }

    const newComparisonCounties = [...comparisonCounties]
    newComparisonCounties.splice(index, 1)
    setComparisonCounties(newComparisonCounties)
  }

  // Fetch data for all selected counties
  const fetchComparisonData = async () => {
    // Validate
    for (const county of comparisonCounties) {
      if (!county.stateCode || !county.countyFips) {
        alert("Please select state and county for all comparison slots")
        return
      }
    }

    if (selectedVariables.length === 0) {
      alert("Please select at least one variable to compare")
      return
    }

    // Fetch data for each county
    const newComparisonCounties = [...comparisonCounties]

    for (let i = 0; i < newComparisonCounties.length; i++) {
      const county = newComparisonCounties[i]

      // Skip if we already have data
      if (county.data && !county.loading) continue

      county.loading = true
      county.error = ""
      setComparisonCounties([...newComparisonCounties])

      try {
        const stateFips = ALL_STATES[county.stateCode as keyof typeof ALL_STATES]?.fips

        // Fetch data from Census API
        const url = `https://api.census.gov/data/${selectedYear}/acs/acs5?get=NAME,${selectedVariables.join(",")}&for=county:${county.countyFips}&in=state:${stateFips}&key=${apiKey}`

        console.log(`Fetching data for ${county.stateName}, ${county.countyName}...`)
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

        console.log(`Received data for ${county.stateName}, ${county.countyName}:`, censusData)

        // Format the results for display
        const formattedVariables = selectedVariables.map((code) => {
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
          let numericValue = null

          if (value && !isNaN(Number(value))) {
            numericValue = Number.parseInt(value)
            formattedValue =
              name.toLowerCase().includes("income") || name.toLowerCase().includes("value")
                ? `$${numericValue.toLocaleString()}`
                : numericValue.toLocaleString()
          }

          return {
            code,
            name,
            category,
            value: numericValue,
            formattedValue,
          }
        })

        // Update the county data
        newComparisonCounties[i] = {
          ...county,
          data: {
            name: censusData["NAME"],
            variables: formattedVariables,
          },
          loading: false,
        }
      } catch (error: any) {
        console.error(`Error fetching data for ${county.stateName}, ${county.countyName}:`, error)
        newComparisonCounties[i] = {
          ...county,
          error: error.message || "Error fetching data",
          loading: false,
        }
      }

      setComparisonCounties([...newComparisonCounties])
    }

    // Switch to visualization tab if we have data
    if (newComparisonCounties.some((county) => county.data)) {
      setActiveTab("visualization")
    }
  }

  // Prepare data for chart visualization
  const prepareChartData = () => {
    if (!comparisonCounties.some((county) => county.data)) {
      return []
    }

    // Group data for side by side comparison
    if (selectedChartType === "bar" || selectedChartType === "line" || selectedChartType === "area") {
      return selectedVariables
        .filter((code) => {
          // Only include variables that have data for at least one county
          return comparisonCounties.some((county) => {
            if (!county.data) return false
            const varData = county.data.variables.find((v: any) => v.code === code)
            return varData && varData.value !== null
          })
        })
        .map((code) => {
          // Get variable name
          let varName = code
          for (const category of Object.values(VARIABLES)) {
            for (const [name, varCode] of Object.entries(category)) {
              if (varCode === code) {
                varName = name
                break
              }
            }
          }

          // Create data point with values for each county
          const dataPoint: Record<string, any> = { name: varName }

          comparisonCounties.forEach((county) => {
            if (!county.data) return

            const varData = county.data.variables.find((v: any) => v.code === code)
            if (varData && varData.value !== null) {
              let value = varData.value

              // Apply normalization if needed
              if (normalizeData) {
                // Find the max value for this variable across all counties
                const maxValue = Math.max(
                  ...comparisonCounties
                    .filter((c) => c.data)
                    .map((c) => {
                      const v = c.data.variables.find((v: any) => v.code === code)
                      return v && v.value !== null ? v.value : 0
                    }),
                )

                if (maxValue > 0) {
                  value = (value / maxValue) * 100 // Normalize to percentage of max
                }
              }

              dataPoint[county.countyName] = value
            } else {
              dataPoint[county.countyName] = 0
            }
          })

          return dataPoint
        })
    }

    // Pie chart data (one variable across all counties)
    if (selectedChartType === "pie") {
      const variableCode = selectedVariables[0] // Use first selected variable
      if (!variableCode) return []

      // Find variable name
      let varName = variableCode
      for (const category of Object.values(VARIABLES)) {
        for (const [name, code] of Object.entries(category)) {
          if (code === variableCode) {
            varName = name
            break
          }
        }
      }

      // Create pie data
      return comparisonCounties
        .filter(
          (county) =>
            county.data && county.data.variables.some((v: any) => v.code === variableCode && v.value !== null),
        )
        .map((county) => {
          const varData = county.data.variables.find((v: any) => v.code === variableCode)
          return {
            name: county.countyName,
            value: varData ? varData.value : 0,
          }
        })
    }

    // Radar chart data
    if (selectedChartType === "radar") {
      // For radar chart, we need to normalize the data
      const radarData = selectedVariables.map((code) => {
        // Find variable name
        let varName = code
        for (const category of Object.values(VARIABLES)) {
          for (const [name, varCode] of Object.entries(category)) {
            if (varCode === code) {
              varName = name
              break
            }
          }
        }

        // Find the max value for this variable across all counties
        const maxValue = Math.max(
          ...comparisonCounties
            .filter((county) => county.data)
            .map((county) => {
              if (!county.data) return 0
              const varData = county.data.variables.find((v: any) => v.code === code)
              return varData && varData.value !== null ? varData.value : 0
            }),
        )

        // Create data point
        const dataPoint: Record<string, any> = {
          variable: varName,
          fullMark: 100,
        }

        // Add normalized values for each county
        comparisonCounties.forEach((county) => {
          if (!county.data) return

          const varData = county.data.variables.find((v: any) => v.code === code)
          if (varData && varData.value !== null && maxValue > 0) {
            dataPoint[county.countyName] = (varData.value / maxValue) * 100
          } else {
            dataPoint[county.countyName] = 0
          }
        })

        return dataPoint
      })

      return radarData
    }

    return []
  }

  // Calculate gap analysis data
  const calculateGapAnalysis = () => {
    if (comparisonCounties.length < 2 || !comparisonCounties[0].data || !comparisonCounties[1].data) {
      return []
    }

    // Get data for the first two counties (primary comparison)
    const county1 = comparisonCounties[0]
    const county2 = comparisonCounties[1]

    return selectedVariables
      .filter((code) => {
        // Only include variables where both counties have data
        const var1 = county1.data.variables.find((v: any) => v.code === code)
        const var2 = county2.data.variables.find((v: any) => v.code === code)
        return var1 && var2 && var1.value !== null && var2.value !== null
      })
      .map((code) => {
        // Get variable details
        let varName = code
        let category = "Other"

        for (const [cat, variables] of Object.entries(VARIABLES)) {
          for (const [name, varCode] of Object.entries(variables)) {
            if (varCode === code) {
              varName = name
              category = cat
              break
            }
          }
        }

        // Get values for both counties
        const var1 = county1.data.variables.find((v: any) => v.code === code)
        const var2 = county2.data.variables.find((v: any) => v.code === code)

        // Calculate the gap and percentage difference
        const value1 = var1.value
        const value2 = var2.value
        const absoluteGap = value2 - value1
        const percentageGap = value1 !== 0 ? ((value2 - value1) / value1) * 100 : 0

        // Format values for display
        const isMonetary = varName.toLowerCase().includes("income") || varName.toLowerCase().includes("value")

        const formattedValue1 = isMonetary ? `$${value1.toLocaleString()}` : value1.toLocaleString()
        const formattedValue2 = isMonetary ? `$${value2.toLocaleString()}` : value2.toLocaleString()

        const formattedGap = isMonetary
          ? `$${Math.abs(absoluteGap).toLocaleString()}`
          : Math.abs(absoluteGap).toLocaleString()

        // Determine which county has the higher value
        const higherCounty = value2 > value1 ? county2.countyName : county1.countyName

        return {
          code,
          name: varName,
          category,
          value1,
          value2,
          formattedValue1,
          formattedValue2,
          absoluteGap,
          percentageGap,
          formattedGap,
          higherCounty,
          direction: value2 > value1 ? "higher" : "lower",
        }
      })
      .sort((a, b) => Math.abs(b.percentageGap) - Math.abs(a.percentageGap)) // Sort by percentage gap magnitude
  }

  // Export chart data to CSV
  const exportChartData = () => {
    if (!comparisonCounties.some((county) => county.data)) {
      alert("No data to export")
      return
    }

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add header row
    csvContent += "Variable,Category"

    // Add county names to header
    comparisonCounties.forEach((county) => {
      if (county.data) {
        csvContent += `,${county.countyName}`
      }
    })
    csvContent += "\r\n"

    // Add data rows
    selectedVariables.forEach((code) => {
      // Find variable details
      let varName = code
      let category = "Other"

      for (const [cat, variables] of Object.entries(VARIABLES)) {
        for (const [name, varCode] of Object.entries(variables)) {
          if (varCode === code) {
            varName = name
            category = cat
            break
          }
        }
      }

      // Start row with variable name and category
      csvContent += `"${varName}","${category}"`

      // Add values for each county
      comparisonCounties.forEach((county) => {
        if (!county.data) return

        const varData = county.data.variables.find((v: any) => v.code === code)
        if (varData && varData.value !== null) {
          csvContent += `,${varData.value}`
        } else {
          csvContent += `,`
        }
      })

      csvContent += "\r\n"
    })

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `county_comparison_${selectedYear}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Render chart based on selected type
  const renderChart = () => {
    const chartData = prepareChartData()

    if (chartData.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No data available for chart. Please fetch data for selected counties first.
          </AlertDescription>
        </Alert>
      )
    }

    if (selectedChartType === "bar") {
      return (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={150} interval={0} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const variable = chartData.find((d) => d[name] === value)?.name || ""
                  // Check if this might be a monetary value
                  if (variable.toLowerCase().includes("income") || variable.toLowerCase().includes("value")) {
                    return [`$${value.toLocaleString()}`, name]
                  }
                  return [value.toLocaleString(), name]
                }}
              />
              <Legend />
              {comparisonCounties.map(
                (county, index) =>
                  county.data && (
                    <Bar key={county.countyName} dataKey={county.countyName} fill={COLORS[index % COLORS.length]} />
                  ),
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (selectedChartType === "line") {
      return (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={150} interval={0} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const variable = chartData.find((d) => d[name] === value)?.name || ""
                  // Check if this might be a monetary value
                  if (variable.toLowerCase().includes("income") || variable.toLowerCase().includes("value")) {
                    return [`$${value.toLocaleString()}`, name]
                  }
                  return [value.toLocaleString(), name]
                }}
              />
              <Legend />
              {comparisonCounties.map(
                (county, index) =>
                  county.data && (
                    <Line
                      key={county.countyName}
                      type="monotone"
                      dataKey={county.countyName}
                      stroke={COLORS[index % COLORS.length]}
                      activeDot={{ r: 8 }}
                    />
                  ),
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (selectedChartType === "area") {
      return (
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={150} interval={0} />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const variable = chartData.find((d) => d[name] === value)?.name || ""
                  // Check if this might be a monetary value
                  if (variable.toLowerCase().includes("income") || variable.toLowerCase().includes("value")) {
                    return [`$${value.toLocaleString()}`, name]
                  }
                  return [value.toLocaleString(), name]
                }}
              />
              <Legend />
              {comparisonCounties.map(
                (county, index) =>
                  county.data && (
                    <Area
                      key={county.countyName}
                      type="monotone"
                      dataKey={county.countyName}
                      fill={COLORS[index % COLORS.length]}
                      stroke={COLORS[index % COLORS.length]}
                      fillOpacity={0.3}
                    />
                  ),
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (selectedChartType === "pie") {
      // For pie chart, we only use the first selected variable
      // Find the variable name
      const varCode = selectedVariables[0]
      let varName = varCode

      for (const category of Object.values(VARIABLES)) {
        for (const [name, code] of Object.entries(category)) {
          if (code === varCode) {
            varName = name
            break
          }
        }
      }

      return (
        <div className="h-[500px]">
          <h3 className="text-center mb-2">{varName} Comparison</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const varCode = selectedVariables[0]
                  // Check if this might be a monetary value
                  for (const category of Object.values(VARIABLES)) {
                    for (const [varName, code] of Object.entries(category)) {
                      if (code === varCode) {
                        if (varName.toLowerCase().includes("income") || varName.toLowerCase().includes("value")) {
                          return [`$${value.toLocaleString()}`, name]
                        }
                        break
                      }
                    }
                  }
                  return [value.toLocaleString(), name]
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )
    }

    if (selectedChartType === "radar") {
      return (
        <div className="h-[500px]">
          <h3 className="text-center mb-2">Normalized Comparison (% of Maximum)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="variable" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {comparisonCounties.map(
                (county, index) =>
                  county.data && (
                    <Radar
                      key={county.countyName}
                      name={county.countyName}
                      dataKey={county.countyName}
                      stroke={COLORS[index % COLORS.length]}
                      fill={COLORS[index % COLORS.length]}
                      fillOpacity={0.3}
                    />
                  ),
              )}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    return <div>Chart type not supported</div>
  }

  // Load counties for the initial states
  useEffect(() => {
    const loadInitialCounties = async () => {
      for (const county of comparisonCounties) {
        if (county.stateCode) {
          await fetchCounties(county.stateCode)
        }
      }
    }

    loadInitialCounties()
  }, [])

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>County Comparison</CardTitle>
        <CardDescription>Compare census data across multiple counties with interactive visualizations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger value="selection">Selection</TabsTrigger>
            <TabsTrigger value="visualization" disabled={!comparisonCounties.some((county) => county.data)}>
              Visualization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Chart Type</label>
                <Select value={selectedChartType} onValueChange={setSelectedChartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Bar Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="line">
                      <div className="flex items-center">
                        <LineChartIcon className="h-4 w-4 mr-2" />
                        Line Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="area">
                      <div className="flex items-center">
                        <AreaChartIcon className="h-4 w-4 mr-2" />
                        Area Chart
                      </div>
                    </SelectItem>
                    <SelectItem value="pie">
                      <div className="flex items-center">
                        <PieChartIcon className="h-4 w-4 mr-2" />
                        Pie Chart (first variable only)
                      </div>
                    </SelectItem>
                    <SelectItem value="radar">
                      <div className="flex items-center">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Radar Chart
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gap-analysis"
                  checked={showGapAnalysis}
                  onCheckedChange={(checked) => setShowGapAnalysis(checked === true)}
                />
                <Label htmlFor="gap-analysis">Show Gap Analysis</Label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Variables to Compare</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
                {FLAT_VARIABLES.map((variable) => (
                  <div key={variable.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={`var-${variable.code}`}
                      checked={selectedVariables.includes(variable.code)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedVariables([...selectedVariables, variable.code])
                        } else {
                          setSelectedVariables(selectedVariables.filter((v) => v !== variable.code))
                        }
                      }}
                    />
                    <Label htmlFor={`var-${variable.code}`} className="text-sm">
                      {variable.name}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {variable.category}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Counties to Compare</h3>
                {comparisonCounties.length < 5 && (
                  <Button variant="outline" size="sm" onClick={addCountyComparison} className="flex items-center">
                    <Plus className="h-4 w-4 mr-1" />
                    Add County
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisonCounties.map((county, index) => (
                  <Card key={index} className="relative">
                    {index >= 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeCountyComparison(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">County {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <Select value={county.stateCode} onValueChange={(value) => handleStateChange(index, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
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

                      <div>
                        <label className="block text-sm font-medium mb-1">County</label>
                        <Select
                          value={county.countyFips}
                          onValueChange={(value) => handleCountyChange(index, value)}
                          disabled={!county.stateCode || !countyLists[county.stateCode]}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !county.stateCode
                                  ? "Select a state first"
                                  : !countyLists[county.stateCode]
                                    ? "Loading counties..."
                                    : "Select a county"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {county.stateCode &&
                              countyLists[county.stateCode] &&
                              countyLists[county.stateCode].map((c) => (
                                <SelectItem key={c.fips} value={c.fips}>
                                  {c.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {county.loading && <div className="text-sm text-muted-foreground">Loading data...</div>}

                      {county.error && (
                        <Alert variant="destructive">
                          <AlertDescription>{county.error}</AlertDescription>
                        </Alert>
                      )}

                      {county.data && <div className="text-sm text-green-600">Data loaded for {county.data.name}</div>}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={fetchComparisonData}
                  disabled={
                    comparisonCounties.some((county) => !county.stateCode || !county.countyFips) ||
                    selectedVariables.length === 0
                  }
                >
                  Fetch Comparison Data
                </Button>
                <Button
                  variant="secondary"
                  className="flex items-center gap-1"
                  disabled={!comparisonCounties.some((county) => county.data)}
                  onClick={() => {
                    if (comparisonCounties.some((county) => county.data) && onDataFetched) {
                      // This will trigger the report generator in the parent component
                      onDataFetched({
                        type: "comparison",
                        data: {
                          counties: comparisonCounties,
                          variables: selectedVariables,
                          year: selectedYear,
                        },
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
          </TabsContent>

          <TabsContent value="visualization" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Comparison Visualization</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="normalize"
                    checked={normalizeData}
                    onCheckedChange={(checked) => setNormalizeData(checked === true)}
                  />
                  <Label htmlFor="normalize">Normalize Data</Label>
                </div>
                <Button variant="outline" size="sm" className="flex items-center" onClick={exportChartData}>
                  <Download className="h-4 w-4 mr-1" />
                  Export Data
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">{renderChart()}</div>

            {showGapAnalysis &&
              comparisonCounties.length >= 2 &&
              comparisonCounties[0].data &&
              comparisonCounties[1].data && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Gap Analysis: {comparisonCounties[0].countyName} vs {comparisonCounties[1].countyName}
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border p-2 text-left">Variable</th>
                          <th className="border p-2 text-left">{comparisonCounties[0].countyName}</th>
                          <th className="border p-2 text-left">{comparisonCounties[1].countyName}</th>
                          <th className="border p-2 text-left">Gap</th>
                          <th className="border p-2 text-left">% Difference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculateGapAnalysis().map((gap) => (
                          <tr key={gap.code}>
                            <td className="border p-2">{gap.name}</td>
                            <td className="border p-2">{gap.formattedValue1}</td>
                            <td className="border p-2">{gap.formattedValue2}</td>
                            <td
                              className={`border p-2 ${gap.direction === "higher" ? "text-green-600" : "text-red-600"}`}
                            >
                              {gap.formattedGap} {gap.direction === "higher" ? "higher" : "lower"}
                            </td>
                            <td
                              className={`border p-2 ${gap.direction === "higher" ? "text-green-600" : "text-red-600"}`}
                            >
                              {Math.abs(gap.percentageGap).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

