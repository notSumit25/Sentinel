package org.example.sentinelalert.Model;

import lombok.Data;

@Data
public class AlertRule {
    private String ruleId;
    private String metricName;
    private float threshold;
    private String operator;
    private String severity;
    private boolean enabled;
    private String tenantId;
    private String hostId;
}
