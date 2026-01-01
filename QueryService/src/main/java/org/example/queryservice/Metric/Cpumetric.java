package org.example.queryservice.Metric;

import org.example.queryservice.MetricResponse;
import org.example.queryservice.service.Jdbcservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/cpu")
@CrossOrigin("*")
@RestController
public class Cpumetric {

    private final Jdbcservice jdbcservice;

    public Cpumetric(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @GetMapping("/hosts")
    public List<String> getAllHosts() {
        String sql = "SELECT DISTINCT host_id FROM sentinel.sentinel_vm_metrics ORDER BY host_id";
        return jdbcservice.getJdbcTemplate().queryForList(sql, String.class);
    }

    @GetMapping("/metrics")
    public List<MetricResponse> getGlobalMetrics(@RequestParam(required = false) String hostId) {
        // If hostId is provided as query parameter, fetch metrics for that specific host
        if (hostId != null && !hostId.trim().isEmpty()) {
            String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";
            return jdbcservice.getJdbcTemplate().query(
                    sql,
                    (rs, rowNum) -> new MetricResponse(
                            rs.getString("ts"),
                            rs.getDouble("cpu")
                    ),
                    hostId
            );
        }
        
        // Otherwise, fetch all metrics
        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics ORDER BY ts DESC LIMIT 100";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("cpu")
                )
        );
    }

    @GetMapping("/tenant/{tenant_id}/hosts")
    public List<String> getHostsByTenant(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT DISTINCT host_id FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY host_id";
        return jdbcservice.getJdbcTemplate().queryForList(sql, String.class, tenantId);
    }

    @GetMapping("/tenant/{tenant_id}/metrics")
    public List<MetricResponse> getTenantMetrics(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("cpu")
                ),
                tenantId
        );
    }

    @GetMapping("/tenant/{tenant_id}/avg")
    public Double getTenantAverageCpu(
            @PathVariable("tenant_id") String tenantId,
            @RequestParam(defaultValue = "5") int minutes) {

        String sql = "SELECT avg(cpu) FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? AND ts >= (now() - INTERVAL ? MINUTE)";

        return jdbcservice.getJdbcTemplate().queryForObject(sql, Double.class, tenantId, minutes);
    }

    @GetMapping("/tenant/{tenant_id}/host/{host_id}")
    public List<MetricResponse> getTenantHostMetrics(
            @PathVariable("tenant_id") String tenantId,
            @PathVariable("host_id") String hostId) {

        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? AND host_id = ? ORDER BY ts DESC LIMIT 100";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("cpu")
                ),
                tenantId, hostId
        );
    }

    @GetMapping("/id/{host_id}")
    public List<MetricResponse> getCpuMetricsForVm(@PathVariable("host_id") String hostId) {
        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (ps) -> ps.setString(1, hostId),
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("cpu")
                )
        );
    }

    @GetMapping("/history/{host_id}")
    public List<MetricResponse> getVmHistory(
            @PathVariable("host_id") String hostId,
            @RequestParam(defaultValue = "30") int minutes) {

        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics WHERE host_id = ? AND ts >= (now() - INTERVAL ? MINUTE) ORDER BY ts ASC";

        return jdbcservice.getJdbcTemplate().query(
                sql,
                (ps) -> {
                    ps.setString(1, hostId);
                    ps.setInt(2, minutes);
                },
                (rs, rowNum) -> new MetricResponse(
                        rs.getString("ts"),
                        rs.getDouble("cpu")
                )
        );
    }
}