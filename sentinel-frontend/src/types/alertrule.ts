export type AlertOperator = ">" | "<" | ">=" | "<=";
export type AlertSeverity = "LOW" | "MEDIUM" | "CRITICAL";
export type MetricName = "cpu" | "ram" | "disk";

export interface AlertRule {
    rule_id: string;
    tenant_id: string; // tenant identifier
    host_id: string;   // host identifier
    metric_name: MetricName;
    threshold: number;
    operator: AlertOperator;
    severity: AlertSeverity;
    enabled: number; // 1 | 0
}
