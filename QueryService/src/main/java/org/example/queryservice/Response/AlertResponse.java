package org.example.queryservice.Response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AlertResponse {
    private String alert_id;
    private String rule_id;
    private String metric_name;
    private Double metric_value;
    private String severity;
    private LocalDateTime ts;
    private String tenant_id;
    private String host_id;

    public AlertResponse(String alert_id, String rule_id, String metric_name, Double metric_value, String severity, LocalDateTime ts, String tenant_id, String host_id) {
        this.alert_id = alert_id;
        this.rule_id = rule_id;
        this.metric_name = metric_name;
        this.metric_value = metric_value;
        this.severity = severity;
        this.ts = ts;
        this.tenant_id = tenant_id;
        this.host_id = host_id;
    }

}
