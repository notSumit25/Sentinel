"use client";

import { useState } from "react";
import { AlertRule } from "@/src/types/alertrule";

interface Props {
    onSubmit: (rule: AlertRule) => Promise<void>;
}

export function AddAlertForm({ onSubmit }: Props) {
    const [form, setForm] = useState<AlertRule>({
        rule_id: "",
        tenant_id: "",
        host_id: "",
        metric_name: "cpu",
        threshold: 80,
        operator: ">",
        severity: "CRITICAL",
        enabled: 1,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const ruleIdInvalid = !form.rule_id.trim();
    const tenantIdInvalid = !form.tenant_id.trim();
    const hostIdInvalid = !form.host_id.trim();
    const showRuleIdError = !!error && ruleIdInvalid;

    const update = (key: keyof AlertRule, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    // Helper to reset all fields to defaults
    const resetForm = () => {
        setForm({
            rule_id: "",
            tenant_id: "",
            host_id: "",
            metric_name: "cpu",
            threshold: 80,
            operator: ">",
            severity: "CRITICAL",
            enabled: 1,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (ruleIdInvalid || tenantIdInvalid || hostIdInvalid) {
            setError("Please fill out all required fields");
            return;
        }

        try {
            setLoading(true);
            await onSubmit(form);
            resetForm();
            setSuccess("Alert rule created successfully.");
        } catch (e) {
            setError("Failed to create alert rule");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-border bg-surface shadow-md p-6 md:p-8 space-y-6"
        >
            {/* Success banner */}
            {success && (
                <div className="flex items-start justify-between rounded-md border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-500">
                    <span>{success}</span>
                    <button
                        type="button"
                        onClick={() => setSuccess(null)}
                        className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded hover:bg-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-500/40"
                        aria-label="Dismiss success"
                    >
                        ✕
                    </button>
                </div>
            )}

            {error && (
                <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-md">
                    {error}
                </div>
            )}

            {/* Required fields: Tenant, Host, Rule ID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted">
                        Tenant ID
                    </label>
                    <input
                        value={form.tenant_id}
                        onChange={(e) => update("tenant_id", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background text-foreground placeholder:text-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            tenantIdInvalid && !!error
                                ? "border-red-500 focus:ring-red-500/30 focus:border-red-500/60"
                                : "border-border focus:ring-primary/40 focus:border-primary/50"
                        }`}
                        placeholder="tenant-123"
                        aria-invalid={tenantIdInvalid && !!error}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted">
                        Host ID
                    </label>
                    <input
                        value={form.host_id}
                        onChange={(e) => update("host_id", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background text-foreground placeholder:text-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            hostIdInvalid && !!error
                                ? "border-red-500 focus:ring-red-500/30 focus:border-red-500/60"
                                : "border-border focus:ring-primary/40 focus:border-primary/50"
                        }`}
                        placeholder="host-abc"
                        aria-invalid={hostIdInvalid && !!error}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted">
                        Rule ID
                    </label>
                    <input
                        value={form.rule_id}
                        onChange={(e) => update("rule_id", e.target.value)}
                        className={`mt-1 w-full rounded-md border bg-background text-foreground placeholder:text-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                            showRuleIdError
                                ? "border-red-500 focus:ring-red-500/30 focus:border-red-500/60"
                                : "border-border focus:ring-primary/40 focus:border-primary/50"
                        }`}
                        placeholder="cpu_high_usage"
                        aria-invalid={showRuleIdError}
                        aria-describedby={showRuleIdError ? "ruleIdError" : undefined}
                        required
                    />
                    {showRuleIdError && (
                        <p id="ruleIdError" className="mt-1 text-xs text-red-500">
                            Rule ID is required
                        </p>
                    )}
                </div>
            </div>

            {/* Metric */}
            <div>
                <label className="block text-sm font-medium text-muted">
                    Metric
                </label>
                <select
                    value={form.metric_name}
                    onChange={(e) => update("metric_name", e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50"
                >
                    <option value="cpu">CPU</option>
                    <option value="ram">RAM</option>
                    <option value="disk">Disk</option>
                </select>
            </div>

            {/* Operator + Threshold */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted">
                        Operator
                    </label>
                    <select
                        value={form.operator}
                        onChange={(e) => update("operator", e.target.value)}
                        className="mt-1 w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50"
                    >
                        <option value=">">{">"}</option>
                        <option value="<">{"<"}</option>
                        <option value=">=">{">="}</option>
                        <option value="<=">{"<="}</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-muted">
                        Threshold
                    </label>
                    <input
                        type="number"
                        step="0.1"
                        value={form.threshold}
                        onChange={(e) => update("threshold", Number(e.target.value))}
                        className="mt-1 w-full rounded-md border border-border bg-background text-foreground placeholder:text-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50"
                    />
                    <p className="mt-1 text-xs text-muted">Percent (%)</p>
                </div>
            </div>

            {/* Severity */}
            <div>
                <label className="block text-sm font-medium text-muted">
                    Severity
                </label>
                <select
                    value={form.severity}
                    onChange={(e) => update("severity", e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50"
                >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="CRITICAL">CRITICAL</option>
                </select>
            </div>

            {/* Enabled */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={form.enabled === 1}
                    onChange={(e) => update("enabled", e.target.checked ? 1 : 0)}
                    className="h-4 w-4 rounded border-border bg-background accent-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <span className="text-sm text-muted">Enabled</span>
            </div>

            {/* Submit */}
            <button
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-md bg-primary text-white py-2.5 text-sm font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? "Creating..." : "Create Alert Rule"}
            </button>
        </form>
    );
}
