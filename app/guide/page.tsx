"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  HelpCircle,
  Send,
  ChevronRight,
  Database,
  LineChart,
  Home,
  BarChart3,
  MapPin,
  Search,
  Filter,
  Download,
  Share2,
  FileText,
  PieChart,
  TrendingUp,
  Layers,
  RefreshCw,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "👋 Hi there! I'm your dashboard assistant. Ask me anything about how to use the Economic Data Dashboard!",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: inputMessage }])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(inputMessage)
      setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
      setIsTyping(false)
    }, 1000)
  }

  // Generate a response based on the user's question
  const generateResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("census") || lowerQuestion.includes("demographic")) {
      return "The Census Data Explorer allows you to access demographic, economic, and housing data from the U.S. Census Bureau. You can select a state, county, years, and specific variables to analyze. The data can be visualized in various chart formats and exported for further analysis."
    } else if (
      lowerQuestion.includes("fred") ||
      lowerQuestion.includes("economic") ||
      lowerQuestion.includes("federal reserve")
    ) {
      return "The FRED Data Explorer provides access to economic indicators from the Federal Reserve Bank of St. Louis. You can select years and specific economic variables like GDP, inflation rates, and employment statistics. The data can be visualized and compared across different time periods."
    } else if (lowerQuestion.includes("hud") || lowerQuestion.includes("housing")) {
      return "The HUD Housing Data Explorer gives you access to housing data from the U.S. Department of Housing and Urban Development. This includes fair market rents, income limits, and housing assistance data. You can filter by state, county, and year to get specific housing metrics."
    } else if (lowerQuestion.includes("visual") || lowerQuestion.includes("chart") || lowerQuestion.includes("graph")) {
      return "The Visualizations tab allows you to create interactive charts from your data. You can choose from line charts, bar charts, area charts, pie charts, scatter plots, and radar charts. You can also normalize data, show percentage changes, and export your visualizations."
    } else if (lowerQuestion.includes("compar") || lowerQuestion.includes("county")) {
      return "The County Comparison feature lets you compare economic indicators across different counties. You can select multiple counties, choose variables to compare, and visualize the differences using various chart types. There's also a gap analysis feature to highlight the differences between counties."
    } else if (
      lowerQuestion.includes("export") ||
      lowerQuestion.includes("download") ||
      lowerQuestion.includes("save")
    ) {
      return "You can export data in various formats including CSV, JSON, and Excel. Look for the Export button in the top right corner of the data display. You can also generate PDF reports or print the current view directly from the dashboard."
    } else if (lowerQuestion.includes("share")) {
      return "The Share feature allows you to create a shareable link to your current data view or send it directly via email. This makes it easy to collaborate with colleagues or share insights with stakeholders."
    } else if (lowerQuestion.includes("dark mode") || lowerQuestion.includes("theme")) {
      return "You can toggle between light and dark mode by clicking the sun/moon icon in the top navigation bar. This allows you to customize the dashboard appearance based on your preference or lighting conditions."
    } else if (lowerQuestion.includes("api") || lowerQuestion.includes("key")) {
      return "The dashboard requires API keys for accessing Census, FRED, and HUD data. These keys are used to authenticate your requests to these services. You can enter your API keys in the settings or when prompted by the dashboard."
    } else if (lowerQuestion.includes("hello") || lowerQuestion.includes("hi") || lowerQuestion.includes("hey")) {
      return "Hello! I'm your dashboard assistant. How can I help you with the Economic Data Dashboard today?"
    } else {
      return "The Economic Data Dashboard provides access to Census, FRED, and HUD data. You can explore demographic, economic, and housing data, create visualizations, and compare counties. Is there a specific feature you'd like to learn more about?"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-gray-900/90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Economic Data Dashboard Guide</h1>
          </div>
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            Interactive Guide
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guide Content */}
          <div className="lg:col-span-2">
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
              {/* Introduction */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b dark:border-gray-800">
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Welcome to the Economic Data Dashboard
                    </CardTitle>
                    <CardDescription>Your comprehensive tool for exploring and analyzing economic data</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="lead">
                        The Economic Data Dashboard provides access to a wealth of data from three major sources:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                        <motion.div
                          className="flex flex-col items-center text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <Database className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-2" />
                          <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-1">
                            U.S. Census Bureau
                          </h3>
                          <p className="text-sm text-blue-600 dark:text-blue-400">
                            Demographic, economic, and housing data
                          </p>
                        </motion.div>

                        <motion.div
                          className="flex flex-col items-center text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20"
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <LineChart className="h-10 w-10 text-green-600 dark:text-green-400 mb-2" />
                          <h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">
                            Federal Reserve (FRED)
                          </h3>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Economic indicators and time series data
                          </p>
                        </motion.div>

                        <motion.div
                          className="flex flex-col items-center text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20"
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                          <Home className="h-10 w-10 text-purple-600 dark:text-purple-400 mb-2" />
                          <h3 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-1">HUD</h3>
                          <p className="text-sm text-purple-600 dark:text-purple-400">
                            Housing and urban development statistics
                          </p>
                        </motion.div>
                      </div>

                      <p>
                        This interactive guide will walk you through all the features of the dashboard and help you make
                        the most of this powerful tool.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Feature Tabs */}
              <motion.div variants={itemVariants}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-1">
                      <TabsList className="grid grid-cols-5 w-full">
                        <TabsTrigger
                          value="overview"
                          className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                        >
                          <Layers className="h-4 w-4 mr-2" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="census"
                          className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Census
                        </TabsTrigger>
                        <TabsTrigger
                          value="fred"
                          className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                        >
                          <LineChart className="h-4 w-4 mr-2" />
                          FRED
                        </TabsTrigger>
                        <TabsTrigger
                          value="hud"
                          className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                        >
                          <Home className="h-4 w-4 mr-2" />
                          HUD
                        </TabsTrigger>
                        <TabsTrigger
                          value="visualize"
                          className="rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-gray-200 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Visualize
                        </TabsTrigger>
                      </TabsList>
                    </CardContent>
                  </Card>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="overview" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-lg">
                          <CardHeader>
                            <CardTitle>Dashboard Overview</CardTitle>
                            <CardDescription>Understanding the main components and navigation</CardDescription>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="prose dark:prose-invert max-w-none">
                              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-6">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5"></div>
                                <img
                                  src="/placeholder.svg?height=400&width=800"
                                  alt="Dashboard Overview"
                                  className="w-full h-auto relative z-10"
                                />
                                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                  <div className="text-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                      Dashboard Layout
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      Interactive visualization of the dashboard interface
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <h3>Main Dashboard Components</h3>

                              <div className="space-y-4">
                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                  <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2.5 mt-1">
                                    <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                      Sidebar Navigation
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      The sidebar provides quick access to all main sections of the dashboard. You can
                                      collapse it to gain more screen space by clicking the menu icon.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                  <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2.5 mt-1">
                                    <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                      Data Source Tabs
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      Switch between Census, FRED, and HUD data sources using the tabs at the top of the
                                      main content area.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                  <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2.5 mt-1">
                                    <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                      Data Selection Controls
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      Each data source has specific controls for selecting states, counties, years, and
                                      variables of interest.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                  <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2.5 mt-1">
                                    <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                      Visualization Area
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      Once data is fetched, it's displayed in interactive tables and charts that you can
                                      customize.
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                                  <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-2.5 mt-1">
                                    <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                      Action Buttons
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                      Export, share, and generate reports using the action buttons in the top right
                                      corner of the data display.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="census" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                            <div className="flex items-center gap-3">
                              <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                              <CardTitle>Census Data Explorer</CardTitle>
                            </div>
                            <CardDescription>Accessing demographic, economic, and housing data</CardDescription>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="prose dark:prose-invert max-w-none">
                              <p className="lead">
                                The Census Data Explorer provides access to the American Community Survey (ACS) data
                                from the U.S. Census Bureau.
                              </p>

                              <div className="my-6 space-y-4">
                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 flex-shrink-0">
                                    <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-1">
                                      State & County Selection
                                    </h4>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 m-0">
                                      Choose a state and county to focus your data exploration.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 flex-shrink-0">
                                    <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-1">
                                      Variable Selection
                                    </h4>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 m-0">
                                      Browse categories and select specific variables to analyze.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 flex-shrink-0">
                                    <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-1">
                                      Data Fetching
                                    </h4>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 m-0">
                                      Retrieve data for your selected parameters with a single click.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 flex-shrink-0">
                                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-blue-700 dark:text-blue-300 mb-1">
                                      Visualization
                                    </h4>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 m-0">
                                      View your data in table or chart format for easy analysis.
                                    </p>
                                  </div>
                                </motion.div>
                              </div>

                              <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <AlertTitle>Pro Tip</AlertTitle>
                                <AlertDescription>
                                  Use the "Reliable Presets" option if you're having trouble getting data. These are
                                  known-good combinations of parameters that reliably return data.
                                </AlertDescription>
                              </Alert>

                              <h3 className="mt-6">Available Data Categories</h3>
                              <ul>
                                <li>
                                  <strong>Population</strong> - Total population, age groups, working age adults
                                </li>
                                <li>
                                  <strong>Households</strong> - Total households, families, single-parent households
                                </li>
                                <li>
                                  <strong>Race & Ethnicity</strong> - Detailed racial and ethnic demographics
                                </li>
                                <li>
                                  <strong>Housing</strong> - Housing units, occupancy, ownership, vacancy rates
                                </li>
                                <li>
                                  <strong>Income</strong> - Median household income, poverty statistics
                                </li>
                                <li>
                                  <strong>Employment</strong> - Labor force participation, unemployment
                                </li>
                                <li>
                                  <strong>Education</strong> - Educational attainment, enrollment
                                </li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="fred" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                            <div className="flex items-center gap-3">
                              <LineChart className="h-6 w-6 text-green-600 dark:text-green-400" />
                              <CardTitle>FRED Data Explorer</CardTitle>
                            </div>
                            <CardDescription>Accessing economic indicators from the Federal Reserve</CardDescription>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="prose dark:prose-invert max-w-none">
                              <p className="lead">
                                The FRED Data Explorer provides access to economic data from the Federal Reserve Bank of
                                St. Louis, including GDP, inflation rates, employment statistics, and other economic
                                indicators.
                              </p>

                              <div className="my-6 space-y-4">
                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-green-100 dark:bg-green-800 rounded-full p-2 flex-shrink-0">
                                    <Filter className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">
                                      Economic Indicators
                                    </h4>
                                    <p className="text-sm text-green-600 dark:text-green-400 m-0">
                                      Browse and select from a comprehensive list of economic indicators organized by
                                      category.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-green-100 dark:bg-green-800 rounded-full p-2 flex-shrink-0">
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">
                                      Time Series Analysis
                                    </h4>
                                    <p className="text-sm text-green-600 dark:text-green-400 m-0">
                                      Analyze economic trends over time with interactive time series charts.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-green-100 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-green-100 dark:bg-green-800 rounded-full p-2 flex-shrink-0">
                                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">
                                      Data Export
                                    </h4>
                                    <p className="text-sm text-green-600 dark:text-green-400 m-0">
                                      Export economic data in various formats for further analysis.
                                    </p>
                                  </div>
                                </motion.div>
                              </div>

                              <h3 className="mt-6">Available Economic Categories</h3>
                              <ul>
                                <li>
                                  <strong>Economic Indicators</strong> - GDP, Industrial Production, Personal Income
                                </li>
                                <li>
                                  <strong>Labor Market</strong> - Unemployment Rate, Labor Force Participation, Payrolls
                                </li>
                                <li>
                                  <strong>Inflation & Prices</strong> - CPI, PPI, PCE Price Index
                                </li>
                                <li>
                                  <strong>Housing</strong> - Housing Starts, Home Sales, Mortgage Rates
                                </li>
                                <li>
                                  <strong>Interest Rates</strong> - Federal Funds Rate, Treasury Yields, Mortgage Rates
                                </li>
                                <li>
                                  <strong>Money & Banking</strong> - Money Stock, Bank Credit, Reserves
                                </li>
                                <li>
                                  <strong>International</strong> - Trade Balance, Exchange Rates, Current Account
                                </li>
                              </ul>

                              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle>Pro Tip</AlertTitle>
                                <AlertDescription>
                                  When analyzing economic data, consider using the "Normalize Data" option to compare
                                  indicators with different scales on the same chart.
                                </AlertDescription>
                              </Alert>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="hud" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                            <div className="flex items-center gap-3">
                              <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                              <CardTitle>HUD Housing Data Explorer</CardTitle>
                            </div>
                            <CardDescription>Accessing housing and urban development data</CardDescription>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="prose dark:prose-invert max-w-none">
                              <p className="lead">
                                The HUD Housing Data Explorer provides access to housing data from the U.S. Department
                                of Housing and Urban Development, including fair market rents, income limits, and
                                housing assistance data.
                              </p>

                              <div className="my-6 space-y-4">
                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-2 flex-shrink-0">
                                    <Home className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-1">
                                      Fair Market Rents
                                    </h4>
                                    <p className="text-sm text-purple-600 dark:text-purple-400 m-0">
                                      Access data on fair market rents for different unit sizes by location.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-2 flex-shrink-0">
                                    <LineChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-1">
                                      Income Limits
                                    </h4>
                                    <p className="text-sm text-purple-600 dark:text-purple-400 m-0">
                                      View income limits for housing assistance programs by household size.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-purple-100 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-2 flex-shrink-0">
                                    <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-purple-700 dark:text-purple-300 mb-1">
                                      Housing Assistance
                                    </h4>
                                    <p className="text-sm text-purple-600 dark:text-purple-400 m-0">
                                      Explore data on HUD-assisted housing units and occupancy rates.
                                    </p>
                                  </div>
                                </motion.div>
                              </div>

                              <h3 className="mt-6">Available Housing Data Categories</h3>
                              <ul>
                                <li>
                                  <strong>Fair Market Rents</strong> - Rental rates for different unit sizes
                                </li>
                                <li>
                                  <strong>Income Limits</strong> - Income thresholds for housing assistance eligibility
                                </li>
                                <li>
                                  <strong>HUD Assisted Housing</strong> - Data on assisted housing units and occupancy
                                </li>
                                <li>
                                  <strong>Homelessness</strong> - Statistics on sheltered and unsheltered homeless
                                  populations
                                </li>
                              </ul>

                              <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                <AlertTitle>Pro Tip</AlertTitle>
                                <AlertDescription>
                                  When analyzing housing affordability, combine HUD fair market rent data with Census
                                  income data for a more comprehensive view.
                                </AlertDescription>
                              </Alert>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="visualize" className="space-y-4 mt-0">
                        <Card className="border-0 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                            <div className="flex items-center gap-3">
                              <PieChart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                              <CardTitle>Data Visualization & Comparison</CardTitle>
                            </div>
                            <CardDescription>Creating interactive charts and comparing data</CardDescription>
                          </CardHeader>
                          <CardContent className="p-6">
                            <div className="prose dark:prose-invert max-w-none">
                              <p className="lead">
                                The dashboard provides powerful visualization tools to help you analyze and compare data
                                from different sources.
                              </p>

                              <div className="my-6 space-y-4">
                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-amber-100 dark:bg-amber-800 rounded-full p-2 flex-shrink-0">
                                    <LineChart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-amber-700 dark:text-amber-300 mb-1">
                                      Chart Types
                                    </h4>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 m-0">
                                      Choose from line, bar, area, pie, scatter, and radar charts to best represent your
                                      data.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-amber-100 dark:bg-amber-800 rounded-full p-2 flex-shrink-0">
                                    <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-amber-700 dark:text-amber-300 mb-1">
                                      County Comparison
                                    </h4>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 m-0">
                                      Compare economic indicators across different counties with side-by-side
                                      visualizations.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-amber-100 dark:bg-amber-800 rounded-full p-2 flex-shrink-0">
                                    <Share2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-amber-700 dark:text-amber-300 mb-1">
                                      Export & Share
                                    </h4>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 m-0">
                                      Export visualizations in various formats or share them with colleagues.
                                    </p>
                                  </div>
                                </motion.div>

                                <motion.div
                                  className="flex items-center gap-4 p-4 rounded-lg border border-amber-100 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20"
                                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                                >
                                  <div className="bg-amber-100 dark:bg-amber-800 rounded-full p-2 flex-shrink-0">
                                    <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-medium text-amber-700 dark:text-amber-300 mb-1">
                                      Report Generation
                                    </h4>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 m-0">
                                      Create PDF reports with your visualizations and analysis.
                                    </p>
                                  </div>
                                </motion.div>
                              </div>

                              <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <AlertTitle>Pro Tip</AlertTitle>
                                <AlertDescription>
                                  Use the "Normalize Data" option when comparing variables with different scales, and
                                  the "Show % Change" option to visualize growth rates over time.
                                </AlertDescription>
                              </Alert>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </motion.div>

              {/* Animation Demo */}
              <motion.div variants={itemVariants}>
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b dark:border-gray-800">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Interactive Dashboard Demo
                    </CardTitle>
                    <CardDescription>See the dashboard in action with this animated walkthrough</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 aspect-video">
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <div className="text-center">
                          <RefreshCw className="h-12 w-12 text-indigo-500 dark:text-indigo-400 mx-auto mb-4 animate-spin" />
                          <p className="text-gray-600 dark:text-gray-400">Interactive demo loading...</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                            (In a production environment, this would be an animated walkthrough of the dashboard)
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Chat Assistant */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg h-full flex flex-col">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b dark:border-gray-800">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Dashboard Assistant
                </CardTitle>
                <CardDescription>Ask me anything about the Economic Data Dashboard</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow flex flex-col">
                <ScrollArea className="flex-grow p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce"></div>
                            <div
                              className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-600 animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                </ScrollArea>
                <div className="p-4 border-t dark:border-gray-800">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask a question about the dashboard..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Try asking: "How do I compare counties?" or "What data sources are available?"
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

