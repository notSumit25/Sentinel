package org.example.sentinelalert.Model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Alert {
    private String alertId;
    private String ruleId;
    private String tenantId;
    private String hostId;
    private String metric;
    private float value;
    private String severity;
    private LocalDateTime ts;
}
