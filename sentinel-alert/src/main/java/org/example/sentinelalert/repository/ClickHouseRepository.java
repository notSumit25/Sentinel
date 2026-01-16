package org.example.sentinelalert.repository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.example.sentinelalert.Model.Alert;
import org.example.sentinelalert.Model.AlertRule;
import org.example.sentinelalert.Model.Metric;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
@RequiredArgsConstructor
public class ClickHouseRepository {

    private final JdbcTemplate jdbcTemplate;

    public List<Metric> fetchLatestMetrics() {
        String sql = """
            SELECT
                tenant_id,
                host_id,
                ts,
                cpu,
                memory,
                disk,
                net_in,
                net_out
            FROM sentinel_vm_metrics
            WHERE ts >= now() - INTERVAL 1 MINUTE
        """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Metric m = new Metric();
            m.setTenantId(rs.getString("tenant_id"));
            m.setHostId(rs.getString("host_id"));
            m.setTs(rs.getString("ts"));
            m.setCpu(rs.getDouble("cpu"));
            m.setMemory(rs.getDouble("memory"));
            m.setDisk(rs.getDouble("disk"));
            m.setNetIn(rs.getLong("net_in"));
            m.setNetOut(rs.getLong("net_out"));
            return m;
        });
    }

    public List<AlertRule> fetchRules() {
        String sql = """
        SELECT
            rule_id,
            metric_name,
            threshold,
            operator,
            severity,
            enabled
        FROM alert_rules
        WHERE enabled = 1
    """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AlertRule r = new AlertRule();
            r.setRuleId(rs.getString("rule_id"));
            r.setMetricName(rs.getString("metric_name"));
            r.setThreshold(rs.getFloat("threshold"));
            r.setOperator(rs.getString("operator"));
            r.setSeverity(rs.getString("severity"));
            r.setEnabled(rs.getInt("enabled") == 1);
            return r;
        });
    }

    public void saveAlert(Alert alert) {
        String sql = """
        INSERT INTO alerts (alert_id, rule_id, tenant_id, host_id, metric_name, metric_value, severity, ts)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """;

        jdbcTemplate.update(sql,
            alert.getAlertId(),
            alert.getRuleId(),
            alert.getTenantId(),
            alert.getHostId(),
            alert.getMetric(),
            alert.getValue(),
            alert.getSeverity(),
            alert.getTs()
        );
    }



}
