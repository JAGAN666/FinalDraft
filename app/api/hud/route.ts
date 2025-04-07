import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint") || "fair-market-rents"
  const apiKey = searchParams.get("api_key") || ""
  const state = searchParams.get("state") || "CA"
  const year = searchParams.get("year") || "2022"

  console.log(`HUD API Request: endpoint=${endpoint}, state=${state}, year=${year}`)

  // Validate API key
  if (!apiKey || apiKey.length < 20) {
    return NextResponse.json(
      {
        error: "Valid API key is required",
        details: "Please provide a valid HUD API key with at least 20 characters",
      },
      { status: 400 },
    )
  }

  try {
    // Determine the appropriate URL based on the endpoint
    let url
    if (endpoint === "fair-market-rents") {
      url = `https://www.huduser.gov/hudapi/public/fmr?year=${year}&stateCode=${state}`
    } else if (endpoint === "income-limits") {
      url = `https://www.huduser.gov/hudapi/public/il?year=${year}&stateCode=${state}`
    } else if (endpoint === "assisted-housing") {
      url = `https://www.huduser.gov/hudapi/public/picture?year=${year}&stateCode=${state}`
    } else if (endpoint === "homelessness") {
      url = `https://www.huduser.gov/hudapi/public/ahar?year=${year}&stateCode=${state}`
    } else {
      return NextResponse.json(
        {
          error: "Invalid endpoint",
          details: "Supported endpoints: fair-market-rents, income-limits, assisted-housing, homelessness",
        },
        { status: 400 },
      )
    }

    // Make the request to the HUD API
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      timeout: 15000, // 15 second timeout
    })

    // Return the data
    return NextResponse.json({
      source: "real",
      endpoint: url,
      data: response.data.data || response.data,
    })
  } catch (error: any) {
    console.error("HUD API Error:", error.response?.data || error.message)

    return NextResponse.json(
      {
        error: "Failed to fetch data from HUD API",
        details: {
          lastResponseStatus: error.response?.status,
          lastResponseText: error.response?.data,
          lastResponseHeaders: error.response?.headers,
          message: error.message,
        },
      },
      { status: 502 },
    )
  }
}

