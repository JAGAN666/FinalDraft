import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 900 },
]

export function ReportPreview() {
  return (
    <Card className="border shadow-md">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800 rounded"></div>

          <div className="h-[200px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-6">
            <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-4/6 bg-gray-100 dark:bg-gray-800 rounded"></div>
          </div>

          <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
            <div className="h-4 w-1/4 bg-gray-100 dark:bg-gray-800 rounded mx-auto"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

