import MetricsDashboard from "@/src/components/MetricsDashboard";
import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  // Protect the route by checking authentication
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            System Monitoring
          </h1>
          <p className="text-slate-600 mt-1">
            Real-time metrics for your infrastructure
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <MetricsDashboard />
    </div>
  );
}
