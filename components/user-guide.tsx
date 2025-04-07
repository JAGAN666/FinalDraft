import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info, HelpCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function UserGuide() {
  return (
    <Card className="shadow-md border-0 dark:bg-gray-900">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b dark:border-gray-800">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          How to Use the Economic Data Dashboard
        </CardTitle>
        <CardDescription>A comprehensive guide to exploring and analyzing economic data</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="census">Census Data</TabsTrigger>
            <TabsTrigger value="fred">FRED Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Welcome to the Economic Data Dashboard</h3>
              <p>
                This dashboard provides access to a wealth of economic data from three major sources: the U.S. Census
                Bureau, the Federal Reserve Economic Data (FRED), and the Department of Housing and Urban Development
                (HUD). You can explore, visualize, and compare this data across different regions and time periods.
              </p>

              <h4>Main Features</h4>
              <ul>
                <li>
                  <strong>Census Data Explorer:</strong> Access demographic, economic, and housing data from the U.S.
                  Census Bureau.
                </li>
                <li>
                  <strong>FRED Data Explorer:</strong> Explore economic indicators from the Federal Reserve Bank of St.
                  Louis.
                </li>
                <li>
                  <strong>HUD Data Explorer:</strong> Examine housing data from the U.S. Department of Housing and Urban
                  Development.
                </li>
                <li>
                  <strong>Visualizations:</strong> Create interactive charts and graphs to analyze trends and patterns.
                </li>
                <li>
                  <strong>County Comparison:</strong> Compare economic indicators across different counties.
                </li>
              </ul>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle>Pro Tip</AlertTitle>
              <AlertDescription>
                Use the "Select All Years" option to quickly include all available years in your data request. This is
                useful for analyzing trends over time.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="census" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <h3>Census Data Explorer</h3>
              <p>
                The Census Data Explorer provides access to the American Community Survey (ACS) data from the U.S.
                Census Bureau. This includes demographic, economic, social, housing, and other important statistics.
              </p>

              <h4>How to Use</h4>
              <ol>
                <li>
                  <strong>Select a State:</strong> Choose the state you want to explore data for.
                </li>
                <li>
                  <strong>Select a County:</strong> Choose a specific county within the selected state.
                </li>
                <li>
                  <strong>Select Years:</strong> Choose one or more years for which you want data.
                </li>
                <li>
                  <strong>Select Variables:</strong> Browse through categories and select the variables you're
                  interested in.
                </li>
                <li>
                  <strong>Fetch Data:</strong> Click the "Fetch Data" button to retrieve the selected information.
                </li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="fred" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none">
              <h3>FRED Data Explorer</h3>
              <p>
                The FRED Data Explorer provides access to economic data from the Federal Reserve Bank of St. Louis. This
                includes GDP, inflation rates, employment statistics, and other economic indicators.
              </p>

              <h4>How to Use</h4>
              <ol>
                <li>
                  <strong>Select Years:</strong> Choose one or more years for which you want data.
                </li>
                <li>
                  <strong>Select Variables:</strong> Browse through categories and select the economic indicators you're
                  interested in.
                </li>
                <li>
                  <strong>Fetch Data:</strong> Click the "Fetch Data" button to retrieve the selected information.
                </li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

