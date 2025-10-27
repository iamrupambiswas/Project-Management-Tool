import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { useAuthStore } from "../store/authStore";
import { getAdminAnalytics, getUserAnalytics } from "../services/analyticsService";
import type { AdminAnalyticsDto, UserAnalyticsDto } from "../@api/models";
import {
  Users,
  FolderKanban,
  ClipboardList,
  Users2,
  Activity,
  AlertTriangle,
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function DashboardWidgets() {
  const { companyId, user } = useAuthStore();

  const isAdmin =
    Array.isArray(user?.roles) &&
    user.roles.some((r: any) =>
      typeof r === "string" ? r === "ADMIN" : r.name === "ADMIN"
    );

  const [adminAnalytics, setAdminAnalytics] = useState<AdminAnalyticsDto | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        if (isAdmin) {
          const data = await getAdminAnalytics(companyId);
          setAdminAnalytics(data);
        } else {
          const data = await getUserAnalytics(companyId);
          setUserAnalytics(data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [companyId, isAdmin]);

  if (loading) return <div className="p-6 text-gray-400 text-center">Loading analytics...</div>;

  /** --- Chart Helper Functions --- **/
  const getProjectStatusChartData = (projectsByStatus: Record<string, number>) => ({
    labels: ["Planning", "Active", "On Hold", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Projects",
        data: [
          projectsByStatus["PLANNING"] || 0,
          projectsByStatus["ACTIVE"] || 0,
          projectsByStatus["ON_HOLD"] || 0,
          projectsByStatus["COMPLETED"] || 0,
          projectsByStatus["CANCELLED"] || 0,
        ],
        backgroundColor: ["#9CA3AF", "#3B82F6", "#FBBF24", "#10B981", "#F87171"],
        borderWidth: 1,
      },
    ],
  });

  const getTaskStatusChartData = (tasksByStatus: Record<string, number>) => ({
    labels: ["To Do", "In Progress", "Review", "Done"],
    datasets: [
      {
        label: "Tasks",
        data: [
          tasksByStatus["TO_DO"] || 0,
          tasksByStatus["IN_PROGRESS"] || 0,
          tasksByStatus["REVIEW"] || 0,
          tasksByStatus["DONE"] || 0,
        ],
        backgroundColor: ["#9CA3AF", "#3B82F6", "#8B5CF6", "#10B981"],
        borderWidth: 1,
      },
    ],
  });

  /** --- Admin Dashboard --- **/
  if (isAdmin && adminAnalytics) {
    const stats = [
      { title: "Total Users", value: adminAnalytics.totalUsers, icon: Users },
      { title: "Total Projects", value: adminAnalytics.totalProjects, icon: FolderKanban },
      { title: "Total Teams", value: adminAnalytics.totalTeams, icon: Users2 },
      { title: "Total Tasks", value: adminAnalytics.totalTasks, icon: ClipboardList },
      { title: "Active Users (Last Week)", value: adminAnalytics.activeUsersLastWeek, icon: Activity },
      { title: "Overdue Tasks", value: adminAnalytics.overdueTasks, icon: AlertTriangle },
    ];

    return (
      <div className="p-6 space-y-8">
        {/* Summary Widgets */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200"
              >
                <div className="flex flex-col items-center">
                  <Icon className="w-6 h-6 text-blue-500 mb-1" />
                  <h4 className="text-xs text-gray-400">{stat.title}</h4>
                  <p className="text-xl font-semibold text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Status */}
          <div className="bg-background-light border border-background-dark rounded-lg p-6 shadow-md">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Project Summary</h3>
            <div className="h-64">
              <Pie
                data={getProjectStatusChartData(adminAnalytics.projectsByStatus ?? {})}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom", labels: { color: "#E5E7EB" } },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleColor: "#E5E7EB",
                      bodyColor: "#E5E7EB",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Task Status */}
          <div className="bg-background-light border border-background-dark rounded-lg p-6 shadow-md">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Task Status Overview</h3>
            <div className="h-64">
              <Bar
                data={getTaskStatusChartData(adminAnalytics.tasksByStatus ?? {})}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleColor: "#E5E7EB",
                      bodyColor: "#E5E7EB",
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#D1D5DB" },
                      grid: { color: "rgba(55,65,81,0.2)" },
                    },
                    y: {
                      ticks: { color: "#D1D5DB" },
                      grid: { color: "rgba(55,65,81,0.2)" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** --- User Dashboard --- **/
  if (userAnalytics) {
    // Prepare project data for chart
    const projectChartData = {
      labels: ["Total Projects", "Active", "Completed"],
      datasets: [
        {
          label: "Projects",
          data: [
            userAnalytics.totalProjects || 0,
            userAnalytics.activeProjects || 0,
            userAnalytics.completedProjects || 0,
          ],
          backgroundColor: ["#3B82F6", "#10B981", "#FBBF24"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <div className="p-6 space-y-8">
        {/* --- Summary Widgets --- */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200">
            <ClipboardList className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <h4 className="text-xs text-gray-400">Assigned Tasks</h4>
            <p className="text-xl font-semibold text-white">{userAnalytics.assignedTasks}</p>
          </div>

          <div className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200">
            <Activity className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <h4 className="text-xs text-gray-400">Completed Tasks</h4>
            <p className="text-xl font-semibold text-green-400">{userAnalytics.completedTasks}</p>
          </div>

          <div className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200">
            <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-1" />
            <h4 className="text-xs text-gray-400">Overdue Tasks</h4>
            <p className="text-xl font-semibold text-red-400">{userAnalytics.overdueTasks}</p>
          </div>

          <div className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200">
            <FolderKanban className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
            <h4 className="text-xs text-gray-400">Total Projects</h4>
            <p className="text-xl font-semibold text-indigo-400">{userAnalytics.totalProjects}</p>
          </div>

          <div className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200">
            <FolderKanban className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <h4 className="text-xs text-gray-400">Active Projects</h4>
            <p className="text-xl font-semibold text-amber-400">{userAnalytics.activeProjects}</p>
          </div>

          <div className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200">
            <Users2 className="w-6 h-6 text-teal-500 mx-auto mb-1" />
            <h4 className="text-xs text-gray-400">Teams Joined</h4>
            <p className="text-xl font-semibold text-teal-400">{userAnalytics.totalTeams}</p>
          </div>
        </div>

        {/* --- Charts Section --- */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Task Chart */}
          <div className="bg-background-light border border-background-dark rounded-lg p-6 shadow-md">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Task Status Overview</h3>
            <div className="h-64">
              <Pie
                data={getTaskStatusChartData(userAnalytics.userTasksByStatus ?? {})}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "bottom", labels: { color: "#E5E7EB" } },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleColor: "#E5E7EB",
                      bodyColor: "#E5E7EB",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Project Chart */}
          <div className="bg-background-light border border-background-dark rounded-lg p-6 shadow-md">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Project Summary</h3>
            <div className="h-64">
              <Bar
                data={projectChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#1F2937",
                      titleColor: "#E5E7EB",
                      bodyColor: "#E5E7EB",
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#D1D5DB" },
                      grid: { color: "rgba(55,65,81,0.2)" },
                    },
                    y: {
                      ticks: { color: "#D1D5DB" },
                      grid: { color: "rgba(55,65,81,0.2)" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div className="text-gray-400 text-center p-6">No analytics data available.</div>;
}
