"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CensusResultsProps {
  data: any
  location: {
    state: string
    county: string
  }
  years: string[]
}

export default function CensusResults({ data, location, years }: CensusResultsProps) {
  const [activeTab, setActiveTab] = useState("table")

  // This would be populated with actual data in a real implementation
  const sampleData = [
    { year: "2019", population: 10039107, households: 3316795 },
    { year: "2020", population: 9981958, households: 3332621 },
    { year: "2021", population: 9829544, households: 3347456 },
    { year: "2022", population: 9721234, households: 3356789 },
  ]

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>
          Census Data Results: {location.county}, {location.state}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Variable</th>
                    {years.map((year) => (
                      <th key={year} className="border p-2 text-left">
                        {year}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-medium">Total Population</td>
                    {sampleData.map((item) => (
                      <td key={item.year} className="border p-2">
                        {item.population.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border p-2 font-medium">Total Households</td>
                    {sampleData.map((item) => (
                      <td key={item.year} className="border p-2">
                        {item.households.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <ChartContainer
              config={{
                population: {
                  label: "Population",
                  color: "hsl(var(--chart-1))",
                },
                households: {
                  label: "Households",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="population" fill="var(--color-population)" name="Population" />
                  <Bar dataKey="households" fill="var(--color-households)" name="Households" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

