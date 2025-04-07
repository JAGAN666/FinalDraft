import { NextResponse } from "next/server"

// This is a helper API route to provide sample chart data if needed
export async function GET() {
  // Sample data for charts
  const sampleData = {
    lineChart: [
      { name: "Jan", value: 400 },
      { name: "Feb", value: 300 },
      { name: "Mar", value: 600 },
      { name: "Apr", value: 800 },
      { name: "May", value: 500 },
      { name: "Jun", value: 900 },
    ],
    barChart: [
      { name: "Category A", value: 400 },
      { name: "Category B", value: 300 },
      { name: "Category C", value: 600 },
      { name: "Category D", value: 800 },
      { name: "Category E", value: 500 },
    ],
    pieChart: [
      { name: "Group A", value: 400 },
      { name: "Group B", value: 300 },
      { name: "Group C", value: 300 },
      { name: "Group D", value: 200 },
    ],
  }

  return NextResponse.json(sampleData)
}

