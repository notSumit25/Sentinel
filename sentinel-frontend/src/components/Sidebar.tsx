"use client";

import { SidebarItem } from "@/src/components/SidebarItems";

export function Sidebar() {
    return (
        <div className="h-full w-full px-4 py-6">
            {/* Logo */}
            <div className="mb-8 px-4">
                <h1 className="text-2xl font-bold text-primary">Sentinel</h1>
                <p className="text-xs text-muted">Monitoring & Alerts</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    Monitoring
                </p>

                <SidebarItem
                    href="/dashboard"
                    icon="📊"
                    label="Metrics"
                />

                <p className="mt-6 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    Alerts
                </p>

                <SidebarItem
                    href="/create-alert"
                    icon="🚨"
                    label="Create Alert Rules"
                />
                <SidebarItem
                    href="/alert-rules"
                    icon="🚨"
                    label="Manage Alert Rules"
                />
                <SidebarItem
                    href="/alerts"
                    icon="🔔"
                    label="View Alerts"
                />
            </nav>


        </div>
    );
}
