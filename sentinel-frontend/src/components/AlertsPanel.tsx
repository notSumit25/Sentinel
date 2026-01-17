"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AlertRule } from "@/src/types/alertrule";

export function AlertsPanel() {
    const { user, isLoaded } = useUser();
    const tenantId = isLoaded && user
        ? user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress
        : null;

    const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded) return;
        if (!tenantId) {
            setLoading(false);
            setError("Missing tenant id");
            return;
        }
        const encodedTenantId = encodeURIComponent(tenantId);
        fetchAlertRules(encodedTenantId)
            .then((data) => {
                setAlertRules(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [isLoaded, tenantId]);

    const fetchAlertRules = async (tenantIdParam: string): Promise<AlertRule[]> => {
        const url = `http://localhost:8082/alertrules/all-alertrules/${tenantIdParam}`;
        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
            throw new Error("Failed to fetch alert rules");
        }
        return (await res.json()) as AlertRule[];
    };

    const handleDelete = async (ruleId: string) => {
        const confirmDelete = window.confirm(`Delete alert rule "${ruleId}"?`);
        if (!confirmDelete) return;
        try {
            const url = `http://localhost:8082/alertrules/delete-alertrule/${encodeURIComponent(ruleId)}`;
            const res = await fetch(url, { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Failed to delete alert rule");
            }
            setAlertRules((prev) => prev.filter((r) => r.rule_id !== ruleId));
        } catch (e: any) {
            setError(e.message ?? "Failed to delete alert rule");
        }
    };

    return (
        <div className="rounded-xl border border-border bg-surface p-6 shadow-md">
            <h2 className="text-xl font-semibold text-foreground mb-4">Alert Rules</h2>
            {loading && <p className="text-muted">Loading alert rules...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!loading && !error && alertRules.length === 0 && (
                <p className="text-muted">No alert rules found.</p>
            )}
            {!loading && !error && alertRules.length > 0 && (
                <ul className="space-y-4">
                    {alertRules.map((rule, idx) => (
                        <li key={`${rule.rule_id}-${idx}`} className="rounded-lg border border-border bg-background p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">{rule.rule_id}</h3>
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                        <p className="text-muted">Metric: <span className="text-foreground">{rule.metric_name}</span></p>
                                        <p className="text-muted">Operator: <span className="text-foreground">{rule.operator}</span></p>
                                        <p className="text-muted">Threshold: <span className="text-foreground">{rule.threshold}</span></p>
                                        <p className="text-muted">Severity: <span className="text-foreground">{rule.severity}</span></p>
                                        {rule.tenant_id && (<p className="text-muted">Tenant: <span className="text-foreground">{rule.tenant_id}</span></p>)}
                                        {rule.host_id && (<p className="text-muted">Host: <span className="text-foreground">{rule.host_id}</span></p>)}
                                    </div>
                                </div>
                                {/* Delete button */}
                                <button
                                    type="button"
                                    onClick={() => handleDelete(rule.rule_id)}
                                    className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                                    aria-label={`Delete ${rule.rule_id}`}
                                    title="Delete"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path d="M9 3h6a1 1 0 011 1v1h3a1 1 0 110 2h-1v13a2 2 0 01-2 2H7a2 2 0 01-2-2V7H4a1 1 0 110-2h3V4a1 1 0 011-1zm1 3h4V4h-4v2z" />
                                        <path d="M9 9a1 1 0 012 0v9a1 1 0 11-2 0V9zm4 0a1 1 0 012 0v9a1 1 0 11-2 0V9z" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
