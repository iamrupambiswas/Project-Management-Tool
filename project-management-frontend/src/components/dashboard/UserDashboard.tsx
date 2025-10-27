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
  ClipboardList,
  Activity,
  AlertTriangle,
  FolderKanban,
  Users2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getUserAnalytics } from "../../services/analyticsService";
import type { UserAnalyticsDto } from "../../@api/models";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function UserDashboard() {
  const { companyId } = useAuthStore();
  const [analytics, setAnalytics] = useState<UserAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const data = await getUserAnalytics(companyId);
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to fetch user analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [companyId]);

  if (loading) return <div className="p-6 text-gray-400 text-center">Loading analytics...</div>;
  if (!analytics) return <div className="p-6 text-gray-400 text-center">No analytics available.</div>;

  const projectChartData = {
    labels: ["Total Projects", "Active", "Completed"],
    datasets: [
      {
        label: "Projects",
        data: [
          analytics.totalProjects || 0,
          analytics.activeProjects || 0,
          analytics.completedProjects || 0,
        ],
        backgroundColor: ["#3B82F6", "#10B981", "#FBBF24"],
      },
    ],
  };

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
      },
    ],
  });

  return (
    <div className="p-6 space-y-8">
      {/* Widgets */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Assigned Tasks" value={analytics.assignedTasks} icon={ClipboardList} color="text-blue-500" />
        <StatCard title="Completed Tasks" value={analytics.completedTasks} icon={Activity} color="text-green-500" />
        <StatCard title="Overdue Tasks" value={analytics.overdueTasks} icon={AlertTriangle} color="text-red-500" />
        <StatCard title="Total Projects" value={analytics.totalProjects} icon={FolderKanban} color="text-indigo-500" />
        <StatCard title="Active Projects" value={analytics.activeProjects} icon={FolderKanban} color="text-amber-500" />
        <StatCard title="Teams Joined" value={analytics.totalTeams} icon={Users2} color="text-teal-500" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Task Status Overview">
          <Pie
            data={getTaskStatusChartData(analytics.userTasksByStatus ?? {})}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom", labels: { color: "#E5E7EB" } } },
            }}
          />
        </ChartCard>

        <ChartCard title="Project Summary">
          <Bar
            data={projectChartData}
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
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-background-light border border-background-dark rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-all duration-200">
      <Icon className={`w-6 h-6 ${color} mx-auto mb-1`} />
      <h4 className="text-xs text-gray-400">{title}</h4>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="bg-background-light border border-background-dark rounded-lg p-6 shadow-md">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}
