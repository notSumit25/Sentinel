import MetricsDashboard from "../src/components/MetricsDashboard";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-6xl">
        <MetricsDashboard />
      </div>
    </main>
  );
}
