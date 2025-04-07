"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Info,
  Search,
  Filter,
  ChevronRight,
  Database,
  LineChart,
  Home,
  BarChart3,
  MapPin,
  Download,
  FileText,
  Share2,
  Zap,
  Lightbulb,
  CheckCircle2,
  Layers,
  TrendingUp,
  PieChart,
  ArrowRight,
  MousePointer,
  Monitor,
  BookOpen,
  Eye,
  AreaChart,
} from "lucide-react"

export default function EnhancedUserGuide() {
  const [activeSection, setActiveSection] = useState("overview")

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
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="mb-12">
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
          <CardContent className="p-0">
            <div className="relative pt-20 pb-16 px-8 md:px-12 text-center">
              {/* Abstract graphic elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 dark:bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
              </div>

              <div className="relative z-10">
                <Badge className="mb-5 px-4 py-1.5 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
                  Interactive Dashboard Guide
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  Economic Data <span className="text-blue-600 dark:text-blue-400">Dashboard</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Your comprehensive guide to exploring, analyzing, and visualizing economic data from multiple
                  authoritative sources
                </p>

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Button size="lg" className="rounded-full gap-2 bg-blue-600 hover:bg-blue-700">
                    <BookOpen className="h-5 w-5" />
                    Start Learning
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-full gap-2">
                    <Eye className="h-5 w-5" />
                    Dashboard Tour
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Navigation */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8 w-full max-w-4xl mx-auto p-1 rounded-xl bg-blue-50 dark:bg-gray-800/50 border border-blue-100 dark:border-blue-900">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg py-3"
            >
              <Layers className="h-5 w-5 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="census"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg py-3"
            >
              <Database className="h-5 w-5 mr-2" />
              Census
            </TabsTrigger>
            <TabsTrigger
              value="fred"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg py-3"
            >
              <LineChart className="h-5 w-5 mr-2" />
              FRED
            </TabsTrigger>
            <TabsTrigger
              value="hud"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg py-3"
            >
              <Home className="h-5 w-5 mr-2" />
              HUD
            </TabsTrigger>
            <TabsTrigger
              value="visualization"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 rounded-lg py-3"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              Visualization
            </TabsTrigger>
          </TabsList>

          {/* Overview Content */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border border-blue-100 dark:border-blue-900/40 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-b border-blue-100 dark:border-blue-900/50">
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-300">
                    <Monitor className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Dashboard Structure
                  </CardTitle>
                  <CardDescription>Understanding the layout and navigation</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="relative overflow-hidden rounded-lg border border-blue-100 dark:border-gray-800 bg-white dark:bg-gray-900 aspect-video mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* This is where we would show a Figma-style dashboard layout mockup */}
                      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
                        {/* Header */}
                        <div className="h-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 flex items-center px-4">
                          <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/30"></div>
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded ml-4"></div>
                          <div className="ml-auto flex gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                          </div>
                        </div>

                        {/* Main layout */}
                        <div className="flex h-[calc(100%-3rem)] gap-4">
                          {/* Sidebar */}
                          <div className="w-1/5 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-2">
                            <div className="h-8 bg-blue-100 dark:bg-blue-900/30 rounded-md mb-2"></div>
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                            <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 flex flex-col gap-4">
                            {/* Tabs */}
                            <div className="h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm flex p-1 gap-1">
                              <div className="h-8 flex-1 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                              <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                              <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>

                            {/* Content area */}
                            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                                <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                              </div>
                              <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="sidebar">
                      <AccordionTrigger className="text-blue-700 dark:text-blue-300 font-medium">
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/40 h-7 w-7 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">1</span>
                          </div>
                          Sidebar Navigation
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 dark:text-gray-300 pl-9">
                        <p>The left sidebar provides quick access to all main sections:</p>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Census Data</strong>: Access demographic, economic, and housing data
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>FRED Data</strong>: Explore economic indicators
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>HUD Data</strong>: Housing and urban development statistics
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Visualizations</strong>: Interactive charts and graphs
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>County Comparison</strong>: Compare data across counties
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="content-area">
                      <AccordionTrigger className="text-blue-700 dark:text-blue-300 font-medium">
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/40 h-7 w-7 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">2</span>
                          </div>
                          Main Content Area
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 dark:text-gray-300 pl-9">
                        <p>
                          The main content area displays the active section with its specific controls and data
                          visualizations:
                        </p>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Data Selection</strong>: Controls for selecting data parameters
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Visualization Area</strong>: Charts, tables and other data displays
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Action Buttons</strong>: Export, share, and generate reports
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="top-bar">
                      <AccordionTrigger className="text-blue-700 dark:text-blue-300 font-medium">
                        <div className="flex items-center">
                          <div className="bg-blue-100 dark:bg-blue-900/40 h-7 w-7 rounded-full flex items-center justify-center mr-2">
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">3</span>
                          </div>
                          Top Navigation Bar
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 dark:text-gray-300 pl-9">
                        <p>The top navigation bar includes:</p>
                        <ul className="mt-2 space-y-2">
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Dashboard Title</strong>: Shows the current view
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Search</strong>: Find specific data quickly
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>Theme Toggle</strong>: Switch between light and dark mode
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="h-4 w-4 text-blue-500 mr-2" />
                            <strong>User Menu</strong>: Access account settings
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card className="border border-blue-100 dark:border-blue-900/40 shadow-md overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-b border-blue-100 dark:border-blue-900/50">
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-300">
                    <Layers className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Data Sources
                  </CardTitle>
                  <CardDescription>Integrated data providers</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <div className="bg-blue-100 dark:bg-blue-900/40 rounded-full p-3 mt-1">
                        <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-1">
                          U.S. Census Bureau
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Access to demographic, economic, social, housing, and other statistics through the American
                          Community Survey (ACS) data.
                        </p>
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            Demographics
                          </Badge>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            Housing
                          </Badge>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                          >
                            Income
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-green-50/50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                      <div className="bg-green-100 dark:bg-green-900/40 rounded-full p-3 mt-1">
                        <LineChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">
                          Federal Reserve (FRED)
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Economic data from the Federal Reserve Bank of St. Louis, including GDP, inflation rates,
                          employment statistics, and other indicators.
                        </p>
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            GDP
                          </Badge>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            Inflation
                          </Badge>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                          >
                            Employment
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
                      <div className="bg-purple-100 dark:bg-purple-900/40 rounded-full p-3 mt-1">
                        <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-1">HUD</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Housing data from the U.S. Department of Housing and Urban Development, including fair market
                          rents, income limits, and housing assistance data.
                        </p>
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                          >
                            Fair Market Rents
                          </Badge>
                          <Badge
                            variant="outline"
                            className="ml-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                          >
                            Income Limits
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-blue-100 dark:border-blue-900/40 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-b border-blue-100 dark:border-blue-900/50">
                <CardTitle className="flex items-center text-blue-800 dark:text-blue-300">
                  <MousePointer className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Main Features
                </CardTitle>
                <CardDescription>Key functionality walk-through</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="p-4 border border-l-4 border-blue-200 dark:border-blue-800 border-l-blue-500 dark:border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Interactive Workflows</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      The dashboard is designed to guide you through a consistent workflow across all data sources:
                    </p>

                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800"></div>

                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Select Data Parameters</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Choose your geographic region (state, county), time period, and specific variables/metrics of
                          interest.
                        </p>
                      </div>

                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Fetch Data</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Request the data from the appropriate API. The dashboard provides status indicators and error
                          handling.
                        </p>
                      </div>

                      <div className="relative pl-10 pb-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Visualize Results</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          View your data in tabular format or as interactive charts and graphs with multiple
                          visualization options.
                        </p>
                      </div>

                      <div className="relative pl-10">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                          4
                        </div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Export and Share</h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          Download data in various formats (CSV, Excel, JSON), create reports, or share visualizations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                      <div className="p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/40">
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400 mb-2" />
                        <h3 className="text-green-800 dark:text-green-300 font-medium mb-1">Time Series Analysis</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Analyze how metrics change over time with interactive line and area charts.
                        </p>
                      </div>

                      <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/40">
                        <PieChart className="h-6 w-6 text-amber-600 dark:text-amber-400 mb-2" />
                        <h3 className="text-amber-800 dark:text-amber-300 font-medium mb-1">Comparative Analysis</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Compare data across different regions or time periods with side-by-side visualizations.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="p-4 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/40">
                        <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400 mb-2" />
                        <h3 className="text-purple-800 dark:text-purple-300 font-medium mb-1">County Comparison</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Compare economic indicators across different counties with gap analysis tools.
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/40">
                        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 mb-2" />
                        <h3 className="text-blue-800 dark:text-blue-300 font-medium mb-1">Report Generation</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Create comprehensive reports with customizable templates and visualizations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-blue-50/50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/40">
                <Alert className="w-full bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertTitle>Pro Tip</AlertTitle>
                  <AlertDescription>
                    Use keyboard shortcuts: Press{" "}
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono">
                      Ctrl
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono">
                      B
                    </kbd>{" "}
                    +{" "}
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700 text-xs font-mono">
                      P
                    </kbd>{" "}
                    to print the current view.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Census Tab Content */}
          <TabsContent value="census" className="space-y-8">
            <Card className="border border-blue-100 dark:border-blue-900/40 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border-b border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-blue-800 dark:text-blue-300">
                    <Database className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Census Data Explorer
                  </CardTitle>
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                    U.S. Census Bureau
                  </Badge>
                </div>
                <CardDescription>Accessing demographic, economic, and housing data</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative overflow-hidden h-64 bg-blue-50 dark:bg-blue-900/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Mockup of Census UI */}
                    <div className="w-full h-full p-6 flex flex-col">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col gap-3">
                        <div className="h-6 w-1/4 bg-blue-100 dark:bg-blue-900/40 rounded"></div>
                        <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                        <div className="h-5 w-full bg-gray-100 dark:bg-gray-700 rounded"></div>
                        <div className="h-5 w-full bg-gray-100 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Step-by-Step Guide</h3>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/40 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Select Geographic Area</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Begin by selecting a state from the dropdown menu. After choosing a state, the counties within
                          that state will automatically load in the county dropdown.
                        </p>
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 p-3">
                          <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Select a specific county for detailed local data, or skip this step to get statewide
                            statistics.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/40 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Choose Time Periods</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Select one or more years for which you want data. The American Community Survey (ACS) 5-year
                          estimates are available for most years, with 2019 and earlier offering the most reliable data.
                        </p>
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30 p-3">
                          <div className="flex items-start text-sm text-amber-700 dark:text-amber-300">
                            <Lightbulb className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 mt-0.5" />
                            <span>
                              Select multiple years to analyze trends over time. The data will be displayed side-by-side
                              for easy comparison.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/40 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Select Variables</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Browse through categories like Population, Housing, Income, and Education to select specific
                          variables of interest. Use the search box to quickly find variables by keyword.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 p-3">
                            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                              <Filter className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Use category tabs to filter variables by theme
                            </div>
                          </div>
                          <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 p-3">
                            <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                              <Search className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Use search to find specific variables quickly
                            </div>
                          </div>
                        </div>
                        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30 p-3">
                          <div className="flex items-start text-sm text-amber-700 dark:text-amber-300">
                            <Lightbulb className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 mt-0.5" />
                            <span>
                              For best results, select fewer than 50 variables at once to avoid API limitations.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/40 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="text-blue-700 dark:text-blue-300 font-medium mb-1">Fetch and Visualize Data</h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Click the "Fetch Data" button to retrieve your selected data. Once the data is fetched, you
                          can view it in table format or switch to the chart view for visual analysis.
                        </p>
                        <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30 p-3">
                          <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
                            <ArrowRight className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                            Export your data in various formats using the Export button in the results section
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-blue-50/50 dark:bg-blue-900/10 border-t border-blue-100 dark:border-blue-900/40 py-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Available Data Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Population
                    </Badge>
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Households
                    </Badge>
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Race & Ethnicity
                    </Badge>
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Housing
                    </Badge>
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Income
                    </Badge>
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Employment
                    </Badge>
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                      Education
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* FRED Tab Content */}
          <TabsContent value="fred" className="space-y-8">
            <Card className="border border-green-100 dark:border-green-900/40 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border-b border-green-100 dark:border-green-900/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-green-800 dark:text-green-300">
                    <LineChart className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    FRED Economic Data Explorer
                  </CardTitle>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                    Federal Reserve
                  </Badge>
                </div>
                <CardDescription>Accessing economic indicators from the Federal Reserve</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Similar structured content for FRED data as we did for Census */}
                <div className="relative overflow-hidden h-64 bg-green-50 dark:bg-green-900/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Mockup of FRED UI */}
                    <div className="w-full h-full p-6 flex flex-col">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                              <div
                                key={i}
                                className="h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center"
                              >
                                <div className="h-4 w-4 bg-green-200 dark:bg-green-700 rounded"></div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        <div className="h-full bg-green-100/50 dark:bg-green-900/20 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">FRED Data Explorer Guide</h3>

                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      The FRED Data Explorer provides access to economic indicators and time series data from the
                      Federal Reserve Bank of St. Louis. The data includes GDP, inflation rates, employment statistics,
                      interest rates, and many other economic metrics.
                    </p>

                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <AlertDescription>
                        Unlike Census data, FRED data is primarily national in scope, though some metrics are available
                        at the state level.
                      </AlertDescription>
                    </Alert>

                    <h4 className="text-green-700 dark:text-green-300 font-medium mt-6 mb-4">
                      Using the FRED Explorer
                    </h4>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="bg-green-100 dark:bg-green-900/40 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 dark:text-green-400 text-lg font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="text-green-700 dark:text-green-300 font-medium mb-1">Select Time Periods</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Choose the years for which you want economic data. FRED provides both historical and recent
                            data for most indicators.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="bg-green-100 dark:bg-green-900/40 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 dark:text-green-400 text-lg font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="text-green-700 dark:text-green-300 font-medium mb-1">
                            Select Economic Indicators
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            Browse through categories like Economic Indicators, Labor Market, Inflation & Prices, and
                            Interest Rates to select specific variables of interest.
                          </p>
                          <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30 p-3">
                            <div className="flex items-start text-sm text-amber-700 dark:text-amber-300">
                              <Lightbulb className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400 mt-0.5" />
                              <span>
                                Pro Tip: When analyzing multiple indicators, consider using the Normalize Data option to
                                compare trends across indicators with different scales.
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="bg-green-100 dark:bg-green-900/40 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 dark:text-green-400 text-lg font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="text-green-700 dark:text-green-300 font-medium mb-1">
                            Visualize Time Series Data
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            FRED data is particularly well-suited for time series analysis. The dashboard provides line
                            charts by default to show trends over time.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-green-50/50 dark:bg-green-900/10 border-t border-green-100 dark:border-green-900/40 py-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Available Economic Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                      Economic Indicators
                    </Badge>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                      Labor Market
                    </Badge>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                      Inflation & Prices
                    </Badge>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                      Housing
                    </Badge>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                      Interest Rates
                    </Badge>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                      Money & Banking
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* HUD Tab Content */}
          <TabsContent value="hud" className="space-y-8">
            <Card className="border border-purple-100 dark:border-purple-900/40 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 border-b border-purple-100 dark:border-purple-900/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-purple-800 dark:text-purple-300">
                    <Home className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                    HUD Housing Data Explorer
                  </CardTitle>
                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                    HUD
                  </Badge>
                </div>
                <CardDescription>Housing and urban development data analysis</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* HUD UI Mockup */}
                <div className="relative overflow-hidden h-64 bg-purple-50 dark:bg-purple-900/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full p-6 flex flex-col">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        <div className="flex flex-col h-full">
                          <div className="h-6 w-1/3 bg-purple-100 dark:bg-purple-900/30 rounded mb-3"></div>
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                            <div className="h-12 bg-gray-100 dark:bg-gray-700 rounded"></div>
                          </div>
                          <div className="flex-1 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">HUD Data Explorer Guide</h3>

                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      The HUD Housing Data Explorer provides access to housing data from the U.S. Department of Housing
                      and Urban Development, including fair market rents, income limits, housing assistance data, and
                      homelessness statistics.
                    </p>

                    <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                      <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <AlertDescription>
                        HUD data is particularly useful for housing affordability analysis and can be combined with
                        Census income data for comprehensive housing studies.
                      </AlertDescription>
                    </Alert>

                    <h4 className="text-purple-700 dark:text-purple-300 font-medium mt-6 mb-4">
                      Key HUD Data Categories
                    </h4>

                    <div className="space-y-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900/30 p-4">
                        <h5 className="text-purple-700 dark:text-purple-300 font-medium mb-2">
                          Fair Market Rents (FMR)
                        </h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          FMRs determine payment standards for the Housing Choice Voucher program and are available for
                          different unit sizes (0-4 bedrooms).
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300"
                          >
                            0-Bedroom (Studio)
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300"
                          >
                            1-Bedroom
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300"
                          >
                            2-Bedroom
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300"
                          >
                            3-Bedroom
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300"
                          >
                            4-Bedroom
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900/30 p-4">
                        <h5 className="text-purple-700 dark:text-purple-300 font-medium mb-2">Income Limits</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Income limits determine eligibility for HUD-assisted housing programs and are calculated as
                          percentages of Area Median Income (AMI).
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900/30 p-4">
                        <h5 className="text-purple-700 dark:text-purple-300 font-medium mb-2">Assisted Housing</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Data on HUD-assisted housing units, occupancy rates, and demographic characteristics of
                          assisted households.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900/30 p-4">
                        <h5 className="text-purple-700 dark:text-purple-300 font-medium mb-2">Homelessness</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Data on sheltered and unsheltered homeless populations from the Point-in-Time (PIT) counts.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-purple-50/50 dark:bg-purple-900/10 border-t border-purple-100 dark:border-purple-900/40 py-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Pro Tips for HUD Data</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Compare Fair Market Rents across years to identify housing cost trends in a specific area.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Use the county comparison feature to compare housing affordability across neighboring counties.
                      </p>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Visualization Tab Content */}
          <TabsContent value="visualization" className="space-y-8">
            <Card className="border border-amber-100 dark:border-amber-900/40 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border-b border-amber-100 dark:border-amber-900/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-amber-800 dark:text-amber-300">
                    <BarChart3 className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-400" />
                    Data Visualizations
                  </CardTitle>
                  <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                    Interactive Charts
                  </Badge>
                </div>
                <CardDescription>Creating and customizing visualizations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative overflow-hidden h-64 bg-amber-50 dark:bg-amber-900/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full p-6 flex flex-col">
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                          <div className="h-8 bg-gray-100 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                        <div className="h-full bg-amber-100/30 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                          <div className="h-20 w-20 border-4 border-amber-200 dark:border-amber-700 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Visualization Options</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-amber-700 dark:text-amber-300 font-medium mb-4">Chart Types</h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg">
                            <LineChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h5 className="text-gray-900 dark:text-gray-100 font-medium">Line Chart</h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Best for time series data to show trends over time.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h5 className="text-gray-900 dark:text-gray-100 font-medium">Bar Chart</h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Ideal for comparing values across categories.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg">
                            <PieChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h5 className="text-gray-900 dark:text-gray-100 font-medium">Pie Chart</h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Shows parts of a whole - good for proportional data.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg">
                            <AreaChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <h5 className="text-gray-900 dark:text-gray-100 font-medium">Area Chart</h5>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Emphasizes volume over time, useful for cumulative data.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-amber-700 dark:text-amber-300 font-medium mb-4">Customization Options</h4>
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <h5 className="text-gray-900 dark:text-gray-100 font-medium mb-2">Data Normalization</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Convert values to percentages of the maximum value to compare variables with different
                            scales.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <h5 className="text-gray-900 dark:text-gray-100 font-medium mb-2">Percentage Change</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Show growth or decline rates instead of absolute values.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <h5 className="text-gray-900 dark:text-gray-100 font-medium mb-2">Chart Size</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Adjust chart height to better display your data.
                          </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <h5 className="text-gray-900 dark:text-gray-100 font-medium mb-2">Animation Toggle</h5>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Enable or disable chart animations for performance or preference.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-amber-50/50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/40 py-4">
                <div className="w-full">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Export Options</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      PNG Image
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      PDF Report
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      Share Link
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Interactive Tips Section */}
      <motion.div variants={itemVariants} className="mt-12">
        <Card className="border border-indigo-100 dark:border-indigo-900/40 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/50">
            <CardTitle className="flex items-center text-indigo-800 dark:text-indigo-300">
              <Zap className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Advanced Tips & Tricks
            </CardTitle>
            <CardDescription>Get the most out of your data analysis</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/40 p-5">
                <Lightbulb className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Combine Data Sources</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  For comprehensive analysis, combine Census income data with HUD housing costs to calculate
                  affordability metrics like housing cost burden.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/40 p-5">
                <TrendingUp className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Trend Analysis</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select multiple years to automatically generate trend analysis. The dashboard can calculate compound
                  annual growth rates (CAGR) for key metrics.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900/40 p-5">
                <MapPin className="h-8 w-8 text-indigo-500 dark:text-indigo-400 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Regional Benchmarking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Use County Comparison to benchmark a county against state or national averages. This helps identify
                  local strengths and challenges.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={itemVariants} className="mt-12 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Explore Economic Data?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Start using the Economic Data Dashboard to uncover insights, identify trends, and make data-driven
              decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
                Launch Dashboard
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700">
                View Sample Reports
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

