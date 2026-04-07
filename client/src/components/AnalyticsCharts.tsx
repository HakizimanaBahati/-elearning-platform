import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample data for charts
const enrollmentTrendData = [
  { month: "Jan", enrollments: 45 },
  { month: "Feb", enrollments: 62 },
  { month: "Mar", enrollments: 78 },
  { month: "Apr", enrollments: 95 },
  { month: "May", enrollments: 112 },
  { month: "Jun", enrollments: 138 },
];

const lessonCompletionData = [
  { name: "Lesson 1", completed: 138, inProgress: 45, notStarted: 12 },
  { name: "Lesson 2", completed: 125, inProgress: 52, notStarted: 18 },
  { name: "Lesson 3", completed: 98, inProgress: 68, notStarted: 29 },
  { name: "Lesson 4", completed: 72, inProgress: 85, notStarted: 38 },
  { name: "Lesson 5", completed: 45, inProgress: 95, notStarted: 55 },
];

const studentProgressData = [
  { name: "0-25%", value: 12 },
  { name: "25-50%", value: 28 },
  { name: "50-75%", value: 45 },
  { name: "75-100%", value: 53 },
];

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

export function AnalyticsCharts() {
  return (
    <div className="space-y-6">
      {/* Enrollment Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enrollmentTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ fill: "#4f46e5", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson Completion Status */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Completion Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lessonCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                <Bar dataKey="notStarted" fill="#e5e7eb" name="Not Started" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Student Progress Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={studentProgressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {studentProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">138</p>
              <p className="text-sm text-slate-600 mt-1">Total Enrollments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">92%</p>
              <p className="text-sm text-slate-600 mt-1">Avg Completion</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">4.8</p>
              <p className="text-sm text-slate-600 mt-1">Avg Rating</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">2.5h</p>
              <p className="text-sm text-slate-600 mt-1">Avg Time/Lesson</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
