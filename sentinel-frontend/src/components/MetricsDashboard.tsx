"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MetricsDashboard = () => {
  const { user, isLoaded } = useUser();
  const [cpuMetrics, setCpuMetrics] = useState([]);
  const [ramMetrics, setRamMetrics] = useState([]);
  const [diskMetrics, setDiskMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user?.emailAddresses[0]?.emailAddress) {
      return;
    }

    const userEmail = user.emailAddresses[0].emailAddress;
    setLoading(true);
    setError(null);

    // Fetch metrics for the current user's host ID (email)
    const API_BASE_URL =
      process.env.NEXT_PUBLIC_QUERY_SERVICE_URL || "http://localhost:8082";

    const fetchMetrics = async () => {
      try {
        const params = new URLSearchParams({ hostId: userEmail });

        const [cpuRes, ramRes, diskRes] = await Promise.all([
          fetch(`${API_BASE_URL}/cpu/metrics?${params}`),
          fetch(`${API_BASE_URL}/ram/metrics?${params}`),
          fetch(`${API_BASE_URL}/disk/metrics?${params}`),
        ]);

        if (!cpuRes.ok || !ramRes.ok || !diskRes.ok) {
          throw new Error("Failed to fetch metrics");
        }

        const [cpuData, ramData, diskData] = await Promise.all([
          cpuRes.json(),
          ramRes.json(),
          diskRes.json(),
        ]);

        console.log("CPU Metrics:", cpuData);
        console.log("RAM Metrics:", ramData);
        console.log("Disk Metrics:", diskData);

        setCpuMetrics(cpuData);
        setRamMetrics(ramData);
        setDiskMetrics(diskData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load metrics";
        console.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [isLoaded, user?.emailAddresses]);

  const Card = ({
    title,
    data,
    dataKey,
  }: {
    title: string;
    data: any[];
    dataKey: string;
  }) => (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-500">
          {data.length > 0 ? "Last updated metrics" : "No data available"}
        </p>
      </div>

      <div className="p-4 h-[320px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="ts" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  borderColor: "#e2e8f0",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#2563eb" // blue-600
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>No data to display</p>
          </div>
        )}
      </div>
    </div>
  );

  if (!isLoaded) {
    return (
      <section className="space-y-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-slate-600">Loading user information...</div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="space-y-8">
        <div className="flex justify-center items-center py-12">
          <div className="text-red-600">Please sign in to view metrics.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Metrics</h1>
          <p className="text-slate-500 mt-1">
            Real-time CPU, RAM and Disk monitoring for{" "}
            {user.emailAddresses[0]?.emailAddress}
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <span
            className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ${
              loading
                ? "bg-yellow-50 text-yellow-700"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {loading ? "Loading..." : "Live"}
          </span>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="CPU Usage" data={cpuMetrics} dataKey="cpu" />
        <Card title="RAM Usage" data={ramMetrics} dataKey="cpu" />
        <div className="lg:col-span-2">
          <Card title="Disk Usage" data={diskMetrics} dataKey="cpu" />
        </div>
      </div>
    </section>
  );
};

export default MetricsDashboard;
