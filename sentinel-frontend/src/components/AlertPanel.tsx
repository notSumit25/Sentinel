"use client";

import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { HostFilter } from "@/src/components/HostFilter";

// Align with backend AlertResponse
interface AlertItem {
  alert_id?: string;
  rule_id?: string;
  metric_name?: string;
  metric_value?: number;
  severity?: string;
  ts?: string;
  host_id?: string;
  tenant_id?: string;
}

export function AlertPanel() {
  const { user, isLoaded } = useUser();
  const rawEmail = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress;
  const tenantId = rawEmail ?? undefined;

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHost, setSelectedHost] = useState<string>("all");

  useEffect(() => {
    if (!isLoaded) return;
    if (!tenantId) {
      setLoading(false);
      setError("Missing tenant id");
      return;
    }
    const encodedTenantId = encodeURIComponent(tenantId);
    fetchAlerts(encodedTenantId)
      .then((data) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [isLoaded, tenantId]);

  const hosts = useMemo(
    () => Array.from(new Set((alerts.map((a) => a.host_id).filter(Boolean) as string[]))).sort(),
    [alerts]
  );

  const filteredAlerts = useMemo(
    () => (selectedHost === "all" ? alerts : alerts.filter((a) => a.host_id === selectedHost)),
    [alerts, selectedHost]
  );

  const fetchAlerts = async (tenantParam: string): Promise<AlertItem[]> => {
    const url = `http://localhost:8082/alerts/all/${tenantParam}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch alerts");
    }
    return (await res.json()) as AlertItem[];
  };

  const severityBadge = (severity?: string) => {
    const sev = (severity ?? "").toUpperCase();
    const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold";
    switch (sev) {
      case "CRITICAL":
        return <span className={`${base} bg-red-500/15 text-red-400 border border-red-500/30`}>Critical</span>;
      case "MEDIUM":
        return <span className={`${base} bg-amber-500/15 text-amber-300 border border-amber-500/30`}>Medium</span>;
      case "LOW":
        return <span className={`${base} bg-emerald-500/15 text-emerald-300 border border-emerald-500/30`}>Low</span>;
      default:
        return <span className={`${base} bg-slate-500/15 text-slate-300 border border-slate-500/30`}>{sev || "Info"}</span>;
    }
  };

  const fmtTime = (ts?: string) => {
    if (!ts) return null;
    const d = new Date(ts);
    return isNaN(d.getTime()) ? ts : d.toLocaleString();
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-md">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-foreground">Alerts</h2>
        <div className="flex items-center gap-3">
          <HostFilter hosts={hosts} value={selectedHost} onChange={setSelectedHost} />
          <span className="text-xs text-muted">{filteredAlerts.length} shown</span>
        </div>
      </div>

      {loading && <p className="text-muted">Loading alerts...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && filteredAlerts.length === 0 && (
        <p className="text-muted">No alerts found.</p>
      )}
      {!loading && !error && filteredAlerts.length > 0 && (
        <ul className="space-y-4">
          {filteredAlerts.map((alert, idx) => (
            <li key={alert.alert_id ?? alert.rule_id ?? idx} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-foreground truncate">
                      {alert.rule_id ?? alert.alert_id ?? "Alert"}
                    </h3>
                    {severityBadge(alert.severity)}
                  </div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {alert.metric_name && (
                      <p className="text-muted">
                        Metric: <span className="text-foreground">{alert.metric_name}</span>
                      </p>
                    )}
                    {typeof alert.metric_value !== "undefined" && (
                      <p className="text-muted">
                        Value: <span className="text-foreground">{alert.metric_value}</span>
                      </p>
                    )}
                    {alert.ts && (
                      <p className="text-muted">
                        Time: <span className="text-foreground">{fmtTime(alert.ts)}</span>
                      </p>
                    )}
                    {alert.host_id && (
                      <p className="text-muted">
                        Host: <span className="text-foreground">{alert.host_id}</span>
                      </p>
                    )}
                    {alert.tenant_id && (
                      <p className="text-muted">
                        Tenant: <span className="text-foreground">{alert.tenant_id}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

