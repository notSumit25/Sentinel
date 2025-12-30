package org.example.queryservice;

import org.example.queryservice.MetricResponse;
import org.example.queryservice.service.Jdbcservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/disk")
@CrossOrigin("*")
@RestController
public class Diskmetric {

    private final Jdbcservice jdbcservice;

    public Diskmetric(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @GetMapping("/metrics")
    public List<MetricResponse> getGlobalDiskMetrics() {
        String sql = "SELECT ts, disk FROM sentinel.sentinel_vm_metrics ORDER BY ts DESC LIMIT 100";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("disk")
                )
        );
    }

    @GetMapping("/tenant/{tenant_id}/metrics")
    public List<MetricResponse> getTenantDiskMetrics(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT ts, disk FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("disk")
                ),
                tenantId
        );
    }

    @GetMapping("/tenant/{tenant_id}/avg")
    public Double getTenantAverageDisk(
            @PathVariable("tenant_id") String tenantId,
            @RequestParam(defaultValue = "5") int minutes) {

        String sql = "SELECT avg(disk) FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? AND ts >= (now() - INTERVAL ? MINUTE)";

        return jdbcservice.getJdbcTemplate().queryForObject(sql, Double.class, tenantId, minutes);
    }

    @GetMapping("/tenant/{tenant_id}/host/{host_id}")
    public List<MetricResponse> getTenantHostDiskMetrics(
            @PathVariable("tenant_id") String tenantId,
            @PathVariable("host_id") String hostId) {

        String sql = "SELECT ts, disk FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? AND host_id = ? ORDER BY ts DESC LIMIT 100";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("disk")
                ),
                tenantId, hostId
        );
    }

    @GetMapping("/history/{host_id}")
    public List<MetricResponse> getDiskHistory(
            @PathVariable("host_id") String hostId,
            @RequestParam(defaultValue = "30") int minutes) {

        String sql = "SELECT ts, disk FROM sentinel.sentinel_vm_metrics WHERE host_id = ? AND ts >= (now() - INTERVAL ? MINUTE) ORDER BY ts ASC";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (ps) -> {
                    ps.setString(1, hostId);
                    ps.setInt(2, minutes);
                },
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("disk")
                )
        );
    }
}