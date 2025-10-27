import React, { useEffect, useState } from "react";
import { getAdminAnalytics } from "../services/analyticsService";
import type { AdminAnalyticsDto } from "../@api/models";
import { Card, CardHeader, CardContent, CardTitle } from "./common/Card";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Loader2, Users, FolderKanban, ClipboardList, Activity, AlertTriangle, Users2 } from "lucide-react";

const COLORS = ["#60A5FA", "#34D399", "#FBBF24", "#F87171", "#A78BFA"];

const AdminDashboardWidgets: React.FC<{ companyId: number }> = ({ companyId }) => {
  const [data, setData] = useState<AdminAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics(companyId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [companyId]);

  if (loading || !data)
    return (
      <div className="flex justify-center items-center h-72">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );

  // Convert backend maps to chart-friendly format
  const projectData = Object.entries(data.projectsByStatus || {}).map(([status, value]) => ({
    name: status,
    value,
  }));

  const taskData = Object.entries(data.tasksByStatus || {}).map(([status, value]) => ({
    name: status,
    value,
  }));

  const statWidgets = [
    { title: "Total Users", value: data.totalUsers, icon: Users },
    { title: "Total Projects", value: data.totalProjects, icon: FolderKanban },
    { title: "Total Teams", value: data.totalTeams, icon: Users2 },
    { title: "Total Tasks", value: data.totalTasks, icon: ClipboardList },
    { title: "Active Users (Last Week)", value: data.activeUsersLastWeek, icon: Activity },
    { title: "Overdue Tasks", value: data.overdueTasks, icon: AlertTriangle },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Summary Widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statWidgets.map((widget, idx) => {
          const Icon = widget.icon;
          return (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex flex-col items-center justify-center text-center p-4">
                <Icon className="w-6 h-6 text-blue-500 mb-2" />
                <p className="text-sm text-gray-500">{widget.title}</p>
                <p className="text-2xl font-semibold">{widget.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Project Summary Widget */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#60A5FA" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Task Summary Widget */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Task Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#34D399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardWidgets;
