package org.example.ingestor.service;

import org.example.ingestor.model.Metric;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Service
public class ClickHouseService {

    private final JdbcTemplate jdbcTemplate;

    public ClickHouseService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void savetoClickHouse(List<Metric> metrics) {
        if (metrics.isEmpty()) return;

        System.out.println("🔥 Saving " + metrics.size() + " metrics to ClickHouse...");

        // Matches your table: sentinel.sentinel_vm_metrics
        String sql = """
            INSERT INTO sentinel.sentinel_vm_metrics 
            (tenant_id, host_id, ts, cpu, memory, disk, net_in, net_out) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """;

        try {
            jdbcTemplate.batchUpdate(sql, metrics, metrics.size(), (PreparedStatement ps, Metric metric) -> {
                ps.setString(1, metric.getTenantId());
                ps.setString(2, metric.getHostId());

                ps.setTimestamp(3, parseTimestamp(metric.getTimestamp()));

                ps.setDouble(4, metric.getCpuUsage());
                ps.setDouble(5, metric.getRamUsage());
                ps.setDouble(6, metric.getDiskUsage());
                ps.setLong(7, metric.getNetworkIn());
                ps.setLong(8, metric.getNetworkOut());
            });
            System.out.println("✅ Batch insert successful!");
        } catch (Exception e) {
            System.err.println("❌ Failed to insert batch to ClickHouse: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Helper: Safely converts ISO 8601 String to Java SQL Timestamp
    private Timestamp parseTimestamp(String isoString) {
        try {
            return Timestamp.from(Instant.parse(isoString));
        } catch (Exception e) {
            // Fallback to current time if parsing fails, to avoid losing data
            System.err.println("⚠️ Timestamp parse error for '" + isoString + "'. Using Now.");
            return new Timestamp(System.currentTimeMillis());
        }
    }
}