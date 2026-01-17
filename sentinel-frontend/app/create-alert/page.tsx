"use client";

import { AddAlertForm } from "@/src/components/AddAlertForm";
import { AlertRule } from "@/src/types/alertrule";

export default function AlertsPage() {

    const createRule = async (rule: AlertRule) => {
        const url =`http://localhost:8082/alertrules/create-alertrule/${rule.tenant_id}/${rule.host_id}`;
        const res = await fetch(
            url,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rule),
            }
        );

        if (!res.ok) {
            throw new Error("Failed to create alert rule");
        }
    };

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Alert Rules</h1>
                <p className="text-slate-500">
                    Create and manage alerting conditions
                </p>
            </div>

            <AddAlertForm onSubmit={createRule} />
        </section>
    );
}
