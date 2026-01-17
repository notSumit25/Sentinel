"use client";

import { useEffect, useState, useMemo } from "react";
import { Metric } from "@/src/types/metric";

export function useMetrics(userEmail?: string) {
    const [cpu, setCpu] = useState<Metric[]>([]);
    const [ram, setRam] = useState<Metric[]>([]);
    const [disk, setDisk] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const API_BASE =
        process.env.NEXT_PUBLIC_QUERY_SERVICE_URL || "http://localhost:8082";

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        const fetchDashboardMetrics = async () => {
            try {
                setLoading(true);

                const [cpuRes, ramRes, diskRes] = await Promise.all([
                    fetch(`${API_BASE}/dashboard/cpu/${userEmail}`),
                    fetch(`${API_BASE}/dashboard/ram/${userEmail}`),
                    fetch(`${API_BASE}/dashboard/disk/${userEmail}`),
                ]);

                if (!cpuRes.ok || !ramRes.ok || !diskRes.ok) {
                    throw new Error("Failed to fetch metrics");
                }

                const cpuData = await cpuRes.json();
                const ramData = await ramRes.json();
                const diskData = await diskRes.json();

                setCpu(cpuData);
                setRam(ramData);
                setDisk(diskData);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardMetrics();
    }, [userEmail, API_BASE]);

    const hosts = useMemo(() => {
        return Array.from(
            new Set(cpu.map((m) => m.hostId).filter(Boolean))
        );
    }, [cpu]);

    return { cpu, ram, disk, hosts, loading, error };
}
