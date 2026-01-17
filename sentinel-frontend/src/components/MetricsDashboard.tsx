"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMetrics } from "@/src/hooks/useMetrics";

import { MetricCard } from "@/src/components/MetricCard";
import { DashboardHeader } from "@/src/components/DashboardHeader";
import { AlertRulesPanel } from "@/src/components/AlertRulesPanel";

export default function MetricsDashboard() {
    const { user, isLoaded } = useUser();
    const email = user?.emailAddresses[0]?.emailAddress;

    const { cpu, ram, disk, hosts, loading, error } = useMetrics(email);
    const [selectedHost, setSelectedHost] = useState("all");

    const filter = (data: any[]) =>
        selectedHost === "all"
            ? data
            : data.filter((m) => m.hostId === selectedHost);

    if (!isLoaded) return <div>Loading user...</div>;
    if (!user) return <div>Please sign in</div>;

    return (
        <section className="space-y-12">
            {/* Header */}
            <DashboardHeader
                email={email!}
                loading={loading}
                hosts={hosts}
                selectedHost={selectedHost}
                setSelectedHost={setSelectedHost}
            />

            {error && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
                    {error}
                </div>
            )}

            {/* Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MetricCard title="CPU Usage" data={filter(cpu)} dataKey="value" />
                <MetricCard title="RAM Usage" data={filter(ram)} dataKey="value" />
                <div className="lg:col-span-2">
                    <MetricCard title="Disk Usage" data={filter(disk)} dataKey="value" />
                </div>
            </div>

        </section>
    );
}
