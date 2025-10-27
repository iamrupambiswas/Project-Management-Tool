import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import {
  Users,
  FolderKanban,
  ClipboardList,
  Users2,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getAdminAnalytics } from "../../services/analyticsService";
import type { AdminAnalyticsDto } from "../../@api/models";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function AdminDashboard() {
  const { companyId } = useAuthStore();
  const [analytics, setAnalytics] = useState<AdminAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const data = await getAdminAnalytics(companyId);
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch admin analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [companyId]);

  if (loading) return <div className="p-6 text-gray-400 text-center">Loading analytics...</div>;
  if (!analytics) return <div className="p-6 text-gray-400 text-center">No analytics available.</div>;

  const stats = [
    { title: "Total Users", value: analytics.totalUsers, icon: Users },
    { title: "Total Projects", value: analytics.totalProjects, icon: FolderKanban },
    { title: "Total Teams", value: analytics.totalTeams, icon: Users2 },
    { title: "Total Tasks", value: analytics.totalTasks, icon: ClipboardList },
    { title: "Active Users (Last Week)", value: analytics.activeUsersLastWeek, icon: Activity },
    { title: "Overdue Tasks", value: analytics.overdueTasks, icon: AlertTriangle },
  ];

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
              <Icon className="w-6 h-6 text-blue-500 mb-1" />
              <h4 className="text-xs text-gray-400">{stat.title}</h4>
              <p className="text-xl font-semibold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-background-light border border-background-dark rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Project Summary</h3>
          <div className="h-64">
            <Pie
              data={getProjectStatusChartData(analytics.projectsByStatus ?? {})}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom", labels: { color: "#E5E7EB" } },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-background-light border border-background-dark rounded-lg p-6 shadow-md">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">Task Status Overview</h3>
          <div className="h-64">
            <Bar
              data={getTaskStatusChartData(analytics.tasksByStatus ?? {})}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { color: "#D1D5DB" } },
                  y: { ticks: { color: "#D1D5DB" } },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
