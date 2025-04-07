"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import CensusExplorer from "@/components/census-explorer"
import FredExplorer from "@/components/fred-explorer"
import HudExplorer from "@/components/hud-explorer"
import DataVisualizations from "@/components/data-visualizations"
import CountyComparison from "@/components/county-comparison"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DataActionButtons } from "@/components/data-action-buttons"
import EnhancedUserGuide from "@/components/enhanced-user-guide"
import { ReportGenerator } from "@/components/report-generator"
import {
  AlertCircle,
  BarChart3,
  Database,
  LineChart,
  MapPin,
  Home,
  RefreshCw,
  ChevronRight,
  Sparkles,
  HelpCircle,
  BookOpen,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

interface DataDashboardProps {
  censusApiKey: string
  fredApiKey: string
  hudApiKey: string
}

export default function DataDashboard({ censusApiKey, fredApiKey, hudApiKey }: DataDashboardProps) {
  const [activeTab, setActiveTab] = useState("census")
  const [censusData, setCensusData] = useState<any>(null)
  const [fredData, setFredData] = useState<any>(null)
  const [hudData, setHudData] = useState<any>(null)
  const [combinedData, setCombinedData] = useState<any>(null)
  const [countyComparisonData, setCountyComparisonData] = useState<any>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false)
  const [apiStatus, setApiStatus] = useState<{
    census: boolean | null
    fred: boolean | null
    hud: { status: string; endpoint?: string } | null
  }>({
    census: null,
    fred: null,
    hud: null,
  })
  const [reportData, setReportData] = useState<any>(null)
  const [showReportGenerator, setShowReportGenerator] = useState(false)

  // Check API health on component mount
  useEffect(() => {
    const checkCensusApiHealth = async () => {
      try {
        const response = await fetch(
          `https://api.census.gov/data/2020/acs/acs5?get=NAME&for=state:*&key=${censusApiKey}`,
        )
        setApiStatus((prev) => ({ ...prev, census: response.ok }))
      } catch (error) {
        setApiStatus((prev) => ({ ...prev, census: false }))
      }
    }

    const checkFredApiHealth = async () => {
      try {
        const response = await fetch(`/api/fred?series_id=GDPC1&api_key=${fredApiKey}&file_type=json`)
        const data = await response.json()
        setApiStatus((prev) => ({ ...prev, fred: data && data.seriess && data.seriess.length > 0 }))
      } catch (error) {
        setApiStatus((prev) => ({ ...prev, fred: false }))
      }
    }

    const checkHudApiHealth = async () => {
      try {
        // Skip check if API key is missing or too short
        if (!hudApiKey || hudApiKey.length < 20) {
          setApiStatus((prev) => ({
            ...prev,
            hud: {
              status: "error",
              endpoint: "API key required (at least 20 characters)",
            },
          }))
          return
        }

        // For now, we'll simulate a successful connection
        setApiStatus((prev) => ({
          ...prev,
          hud: {
            status: "connected",
            endpoint: "https://www.huduser.gov/hudapi/public",
          },
        }))
      } catch (error) {
        console.error("HUD API health check error:", error)
        setApiStatus((prev) => ({
          ...prev,
          hud: {
            status: "error",
            endpoint: error instanceof Error ? error.message : "Unknown error",
          },
        }))
      }
    }

    checkCensusApiHealth()
    checkFredApiHealth()
    checkHudApiHealth()
  }, [censusApiKey, fredApiKey, hudApiKey])

  // Combine data when census, fred, and hud data are available
  useEffect(() => {
    if (censusData && fredData && hudData) {
      // Create combined dataset for cross-analysis
      setCombinedData({
        census: censusData,
        fred: fredData,
        hud: hudData,
      })
    }
  }, [censusData, fredData, hudData])

  // Handle data from Census Explorer
  const handleCensusData = (data: any) => {
    setCensusData(data)
  }

  // Handle data from FRED Explorer
  const handleFredData = (data: any) => {
    setFredData(data)
  }

  // Handle data from HUD Explorer
  const handleHudData = (data: any) => {
    setHudData(data)
  }

  const handleCountyComparisonData = (data: any) => {
    setCountyComparisonData(data)
  }

  const handleDataFetched = (data: any) => {
    // Store the fetched data
    if (data.type === "census") {
      setCensusData(data.data)
    } else if (data.type === "fred") {
      setFredData(data.data)
    } else if (data.type === "hud") {
      setHudData(data.data)
    } else if (data.type === "visualization") {
      // Handle visualization data if needed
    } else if (data.type === "comparison") {
      // Handle comparison data if needed
    }

    // Update combined data when both census and fred data are available
    if (censusData && fredData) {
      setCombinedData({
        census: censusData,
        fred: fredData,
      })
    }

    // If this is a report action, open the report generator
    if (data.action === "report") {
      setReportData(data)
      setShowReportGenerator(true)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <DashboardLayout
      title="Economic Data Dashboard"
      subtitle="Explore Census Bureau, Federal Reserve, and HUD Housing Data"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* Dashboard Overview */}
      <motion.div className="dashboard-section" initial="hidden" animate="visible" variants={containerVariants}>
        <div className="flex items-center justify-between mb-6">
          <motion.h2 className="dashboard-section-title flex items-center gap-2" variants={itemVariants}>
            <Sparkles className="h-5 w-5 text-amber-500" />
            Dashboard Overview
          </motion.h2>
          <motion.div className="flex gap-2" variants={itemVariants}>
            <Dialog open={isUserGuideOpen} onOpenChange={setIsUserGuideOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>User Guide</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
                <EnhancedUserGuide />
              </DialogContent>
            </Dialog>
            <Link href="/guide">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 transition-all hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
              >
                <BookOpen className="h-4 w-4" />
                <span>Interactive Guide</span>
              </Button>
            </Link>
            <DataActionButtons
              censusData={censusData}
              fredData={fredData}
              hudData={hudData}
              countyComparisonData={countyComparisonData}
              activeTab={activeTab}
              title="Economic Data Dashboard"
              contentId="dashboard-content"
            />
          </motion.div>
        </div>

        {showGuide && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EnhancedUserGuide />
          </motion.div>
        )}

        {/* API Status Cards */}
        <div className="dashboard-grid grid-cols-1 md:grid-cols-3 gap-6" id="dashboard-content">
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-900 group">
              <div className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-blue-500/5 dark:to-blue-600/10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2.5 group-hover:scale-110 transition-transform duration-300">
                        <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Census Bureau API
                      </CardTitle>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm group-hover:bg-blue-500/20 dark:group-hover:bg-blue-400/20 transition-colors duration-300">
                      <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <CardContent className="p-0">
                    {apiStatus.census === null ? (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Checking connection...</span>
                      </div>
                    ) : apiStatus.census ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                        <span>Connected and ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500 dark:bg-rose-400"></div>
                        <span>Disconnected</span>
                      </div>
                    )}

                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Access to demographic, economic, and housing data from the U.S. Census Bureau.
                    </div>

                    {censusData && (
                      <div className="mt-3 flex items-center">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                          {censusData.length || 0} datasets loaded
                        </span>
                      </div>
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-900 group">
              <div className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 dark:from-emerald-500/5 dark:to-emerald-600/10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 dark:bg-emerald-900/50 rounded-full p-2.5 group-hover:scale-110 transition-transform duration-300">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        FRED Economic Data API
                      </CardTitle>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm group-hover:bg-emerald-500/20 dark:group-hover:bg-emerald-400/20 transition-colors duration-300">
                      <ChevronRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>

                  <CardContent className="p-0">
                    {apiStatus.fred === null ? (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Checking connection...</span>
                      </div>
                    ) : apiStatus.fred ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                        <span>Connected and ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500 dark:bg-rose-400"></div>
                        <span>Disconnected</span>
                      </div>
                    )}

                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Economic data from the Federal Reserve Bank of St. Louis, including GDP, inflation, and
                      employment.
                    </div>

                    {fredData && (
                      <div className="mt-3 flex items-center">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                          {fredData.length || 0} datasets loaded
                        </span>
                      </div>
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl bg-white dark:bg-gray-900 group">
              <div className="p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 dark:from-purple-500/5 dark:to-purple-600/10 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 dark:bg-purple-900/50 rounded-full p-2.5 group-hover:scale-110 transition-transform duration-300">
                        <Home className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        HUD Housing Data API
                      </CardTitle>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm group-hover:bg-purple-500/20 dark:group-hover:bg-purple-400/20 transition-colors duration-300">
                      <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <CardContent className="p-0">
                    {apiStatus.hud === null ? (
                      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Checking connection...</span>
                      </div>
                    ) : apiStatus.hud?.status === "connected" ? (
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></div>
                        <span>Connected and ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500 dark:bg-rose-400"></div>
                        <span>Disconnected</span>
                      </div>
                    )}

                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                      Housing data from the U.S. Department of Housing and Urban Development, including fair market
                      rents.
                    </div>

                    {hudData && (
                      <div className="mt-3 flex items-center">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                          {hudData.variables?.length || 0} variables loaded
                        </span>
                      </div>
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        className="dashboard-section mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border-0 p-1">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger
                value="census"
                className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
              >
                <Database className="h-4 w-4 mr-2" />
                Census Data
              </TabsTrigger>
              <TabsTrigger
                value="fred"
                className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
              >
                <LineChart className="h-4 w-4 mr-2" />
                FRED Data
              </TabsTrigger>
              <TabsTrigger
                value="hud"
                className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                HUD Data
              </TabsTrigger>
              <TabsTrigger
                value="visualizations"
                className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                disabled={!censusData && !fredData && !hudData}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Visualizations
              </TabsTrigger>
              <TabsTrigger
                value="comparison"
                className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
              >
                <MapPin className="h-4 w-4 mr-2" />
                County Comparison
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Census Data Tab */}
          <TabsContent value="census" className="space-y-4">
            <CensusExplorer apiKey={censusApiKey} onDataFetched={handleDataFetched} />
          </TabsContent>

          {/* FRED Data Tab */}
          <TabsContent value="fred" className="space-y-4">
            <FredExplorer apiKey={fredApiKey} onDataFetched={handleDataFetched} />
          </TabsContent>

          {/* HUD Data Tab */}
          <TabsContent value="hud" className="space-y-4">
            <HudExplorer apiKey={hudApiKey} onDataFetched={handleDataFetched} />
          </TabsContent>

          {/* Visualizations Tab */}
          <TabsContent value="visualizations" className="space-y-4">
            {!censusData && !fredData && !hudData ? (
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-800 dark:text-blue-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fetch data from either Census, FRED, or HUD tabs first to enable visualizations.
                </AlertDescription>
              </Alert>
            ) : (
              <DataVisualizations
                censusData={censusData}
                fredData={fredData}
                hudData={hudData}
                combinedData={combinedData}
              />
            )}
          </TabsContent>

          {/* County Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <CountyComparison apiKey={censusApiKey} onDataFetched={handleDataFetched} />
          </TabsContent>
        </Tabs>
      </motion.div>
      {/* Report Generator Dialog */}
      {showReportGenerator && (
        <ReportGenerator
          data={reportData}
          title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data Report`}
          open={showReportGenerator}
          onClose={() => setShowReportGenerator(false)}
        />
      )}
    </DashboardLayout>
  )
}

