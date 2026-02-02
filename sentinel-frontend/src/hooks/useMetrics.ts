"use client";

import { useEffect, useState, useMemo } from "react";
import { Metric } from "@/src/types/metric";

export function useMetrics(userEmail?: string) {
    const [cpu, setCpu] = useState<Metric[]>([]);
    const [ram, setRam] = useState<Metric[]>([]);
    const [disk, setDisk] = useState<Metric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userEmail) {
            setLoading(false);
            return;
        }

        const fetchDashboardMetrics = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `/api/dashboard?tenantId=${encodeURIComponent(userEmail)}`,
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch metrics");
                }

                const data: {
                    cpu: Metric[];
                    ram: Metric[];
                    disk: Metric[];
                } = await res.json();

                setCpu(data.cpu);
                setRam(data.ram);
                setDisk(data.disk);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardMetrics();
    }, [userEmail]);

    const hosts = useMemo(() => {
        return Array.from(
            new Set(cpu.map((m) => m.hostId).filter(Boolean)),
        );
    }, [cpu]);

    return { cpu, ram, disk, hosts, loading, error };
}
