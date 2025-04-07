import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint") || "series"
  const params = Object.fromEntries(searchParams.entries())

  // Remove our custom endpoint parameter
  delete params.endpoint

  // Construct the FRED API URL
  const apiUrl = new URL(`https://api.stlouisfed.org/fred/${endpoint}`)

  // Add all parameters to the URL
  Object.entries(params).forEach(([key, value]) => {
    apiUrl.searchParams.append(key, value)
  })

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: `FRED API returned status ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying FRED API request:", error)
    return NextResponse.json({ error: "Failed to fetch data from FRED API" }, { status: 500 })
  }
}

