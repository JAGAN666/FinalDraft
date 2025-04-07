// Helper functions for interacting with the Census API

export async function fetchStates(apiKey: string) {
  try {
    const response = await fetch(`https://api.census.gov/data/2020/acs/acs5?get=NAME&for=state:*&key=${apiKey}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    // First row contains headers, so we skip it
    return data.slice(1).map((state: string[]) => ({
      name: state[0],
      id: state[1],
    }))
  } catch (error) {
    console.error("Error fetching states:", error)
    return []
  }
}

export async function fetchCounties(stateId: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://api.census.gov/data/2020/acs/acs5?get=NAME&for=county:*&in=state:${stateId}&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    // First row contains headers, so we skip it
    return data.slice(1).map((county: string[]) => ({
      name: county[0].split(",")[0], // Remove state name from county name
      id: county[2],
    }))
  } catch (error) {
    console.error("Error fetching counties:", error)
    return []
  }
}

export async function fetchCensusData(params: {
  state: string
  county: string
  year: string
  variables: string[]
  apiKey: string
}) {
  const { state, county, year, variables, apiKey } = params

  try {
    // Determine which dataset to use based on year
    const dataset = Number.parseInt(year) >= 2020 ? "acs/acs5" : "acs/acs5"

    // Construct the variables string
    const varsString = variables.join(",")

    const url = `https://api.census.gov/data/${year}/${dataset}?get=NAME,${varsString}&for=county:${county}&in=state:${state}&key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Convert the array response to an object
    const headers = data[0]
    const values = data[1]

    const result: Record<string, any> = {}

    headers.forEach((header: string, index: number) => {
      result[header] = values[index]
    })

    return result
  } catch (error) {
    console.error("Error fetching census data:", error)
    throw error
  }
}

