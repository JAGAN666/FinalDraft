"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  BarChart3,
  Database,
  Home,
  LineChart,
  MapPin,
  Menu,
  X,
  ChevronRight,
  HelpCircle,
  Bell,
  User,
  Search,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"

// Update the DashboardLayout props interface
interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  activeTab: string
  setActiveTab: (tab: string) => void
}

// Update the function signature
export function DashboardLayout({ children, title, subtitle, activeTab, setActiveTab }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // Close mobile menu on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const menuItems = [
    { name: "Census Data", icon: <Database className="h-5 w-5" />, href: "#census", id: "census" },
    { name: "FRED Data", icon: <LineChart className="h-5 w-5" />, href: "#fred", id: "fred" },
    { name: "HUD Data", icon: <Home className="h-5 w-5" />, href: "#hud", id: "hud" },
    { name: "Visualizations", icon: <BarChart3 className="h-5 w-5" />, href: "#visualizations", id: "visualizations" },
    { name: "County Comparison", icon: <MapPin className="h-5 w-5" />, href: "#comparison", id: "comparison" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-2xl lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Economic Data
              </h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors ${
                    activeTab === item.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : ""
                  }`}
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out hidden lg:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Economic Data
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-colors ${
                activeTab === item.id ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" : ""
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span>{item.name}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className={cn("transition-all duration-300 ease-in-out", sidebarOpen ? "lg:ml-64" : "lg:ml-0")}>
        {/* Top navigation */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20 backdrop-blur-md bg-white/90 dark:bg-gray-900/90">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              >
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>

              <button
                onClick={() => setSidebarOpen(true)}
                className={cn(
                  "p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hidden",
                  !sidebarOpen && "lg:block",
                )}
              >
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>

              <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 w-48 transition-all duration-200 dark:text-gray-300"
                />
              </div>

              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <HelpCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              <div className="relative">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 relative">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                </button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                    <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:inline">
                      Admin User
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {subtitle && (
            <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

