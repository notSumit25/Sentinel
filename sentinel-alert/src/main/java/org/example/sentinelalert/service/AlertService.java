package org.example.sentinelalert.service;

import lombok.RequiredArgsConstructor;
import org.example.sentinelalert.Model.Alert;
import org.example.sentinelalert.Model.AlertRule;
import org.example.sentinelalert.Model.Metric;
import org.example.sentinelalert.repository.ClickHouseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AlertService {

    private final ClickHouseRepository repo;

    private final NotificationService notificationService;

    public void evaluate(List<Metric> metrics, List<AlertRule> rules) {

        for (AlertRule rule : rules) {

            for (Metric metric : metrics) {

                double value = extractMetricValue(metric, rule.getMetricName());


                if (value == -1.0) {
                    continue;
                }

                if (match(rule.getOperator(), value, rule.getThreshold())) {

                    Alert alert = new Alert();
                    alert.setAlertId(UUID.randomUUID().toString());
                    alert.setRuleId(rule.getRuleId());
                    alert.setTenantId(metric.getTenantId());
                    alert.setHostId(metric.getHostId());
                    alert.setMetric(rule.getMetricName());
                    alert.setValue((float) value);
                    alert.setSeverity(rule.getSeverity());
                    alert.setTs(LocalDateTime.now());

                    System.out.println("ALERT FIRED: " + alert);
                    repo.saveAlert(alert);
                  //  notificationService.notifyAlerttoemail(alert, metric.getTenantId());
                }
            }
        }
    }


    private boolean match(String op, double val, float threshold) {
        return switch (op) {
            case ">"  -> val > threshold;
            case "<"  -> val < threshold;
            case ">=" -> val >= threshold;
            case "<=" -> val <= threshold;
            default   -> false;
        };
    }

    private double extractMetricValue(Metric metric, String metricName) {
        return switch (metricName) {
            case "cpu" -> metric.getCpu();
            case "memory" -> metric.getMemory();
            case "disk" -> metric.getDisk();
            case "netIn" -> metric.getNetIn();
            case "netOut" -> metric.getNetOut();
            default -> -1.0;
        };
    }

}
