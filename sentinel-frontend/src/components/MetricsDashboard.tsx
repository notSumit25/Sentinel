"use client";
import React, { useEffect, useState } from "react";
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
  const [cpuMetrics, setCpuMetrics] = useState([]);
  const [ramMetrics, setRamMetrics] = useState([]);
  const [diskMetrics, setDiskMetrics] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/cpu/metrics")
      .then((r) => r.json())
      .then((data) => {
        console.log("CPU Metrics:", data);
        setCpuMetrics(data);
      })
      .catch(console.error);

    fetch("http://localhost:8082/ram/metrics")
      .then((r) => r.json())
      .then((data) => {
        console.log("RAM Metrics:", data);
        setRamMetrics(data);
      })
      .catch(console.error);

    fetch("http://localhost:8082/disk/metrics")
      .then((r) => r.json())
      .then((data) => {
        console.log("Disk Metrics:", data);
        setDiskMetrics(data);
      })
      .catch(console.error);
  }, []);

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
        <p className="text-sm text-slate-500">Last updated metrics</p>
      </div>

      <div className="p-4 h-[320px]">
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
      </div>
    </div>
  );

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">System Metrics</h1>
          <p className="text-slate-500 mt-1">
            Real-time CPU, RAM and Disk monitoring
          </p>
        </div>

        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
            Live
          </span>
        </div>
      </div>

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
