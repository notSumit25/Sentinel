"use client";
import React, { useEffect, useState ,useMemo} from "react";
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
  const [DcpuMetrics, setDCpuMetrics] = useState([]);
  const [DramMetrics, setDRamMetrics] = useState([]);
  const [DdiskMetrics, setDDiskMetrics] = useState([]);

  // Filter State
  const [selectedHost, setSelectedHost] = useState<string>("all");

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

    const fecthDashboardMetrics = async () => {
      try {
        const [cpuRes, ramRes, diskRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/cpu/${userEmail}`),
          fetch(`${API_BASE_URL}/dashboard/ram/${userEmail}`),
          fetch(`${API_BASE_URL}/dashboard/disk/${userEmail}`),
        ]);
        if (!cpuRes.ok || !ramRes.ok || !diskRes.ok) {
          throw new Error("Failed to fetch metrics");
        }
        const [DcpuData, DramData, DdiskData] = await Promise.all([
            cpuRes.json(),
            ramRes.json(),
            diskRes.json(),
        ]);
        console.log("Dashboard CPU Metrics:", DcpuData);
        console.log("Dashboard RAM Metrics:", DramData);
        console.log("Dashboard Disk Metrics:", DdiskData);

        setDCpuMetrics(DcpuData);
        setDRamMetrics(DramData);
        setDDiskMetrics(DdiskData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load metrics";

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fecthDashboardMetrics();

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
        console.log("User Email:", userEmail);
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

    // fetchMetrics();
  }, [isLoaded, user?.emailAddresses]);


  const hostList = useMemo(() => {
    const hosts = DcpuMetrics
        .map((m: any) => m.hostId)
        .filter((id): id is string => id !== null && id !== undefined);

    return Array.from(new Set(hosts));
  }, [DcpuMetrics]);

  const filteredCpu = selectedHost === "all" ? DcpuMetrics : DcpuMetrics.filter((m: any) => m.hostId === selectedHost);
  const filteredRam = selectedHost === "all" ? DramMetrics : DramMetrics.filter((m: any) => m.hostId === selectedHost);
  const filteredDisk = selectedHost === "all" ? DdiskMetrics : DdiskMetrics.filter((m: any) => m.hostId === selectedHost);

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

        {/* 3. Host ID Filter Dropdown */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            {/* Minimalist Dot Indicator */}
            <div className={`w-2 h-2 rounded-full ${selectedHost === 'all' ? 'bg-blue-500' : 'bg-green-500'} animate-pulse`} />
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Source:
            </label>
          </div>

          <div className="relative">
            <select
                className="appearance-none bg-transparent pl-1 pr-8 py-0.5 text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer border-none ring-0 focus:ring-0  tracking-wide antialiased"
                value={selectedHost}
                onChange={(e) => setSelectedHost(e.target.value)}
            >
              <option value="all">All Managed Hosts</option>
              {hostList.map((host, index) => (
                  <option key={`${host}-${index}`} value={host}>
                    Host {host}
                  </option>
              ))}
            </select>

            {/* Custom Dropdown Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
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
        <Card title="CPU Usage" data={DcpuMetrics} dataKey="cpu" />
        <Card title="RAM Usage" data={DramMetrics} dataKey="cpu" />
        <div className="lg:col-span-2">
          <Card title="Disk Usage" data={DdiskMetrics} dataKey="cpu" />
        </div>
      </div>
    </section>
  );
};

export default MetricsDashboard;
