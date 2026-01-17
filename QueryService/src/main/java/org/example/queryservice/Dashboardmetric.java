package org.example.queryservice;
import org.example.queryservice.Response.HostMetricReponse;
import org.example.queryservice.service.Jdbcservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/dashboard")
@CrossOrigin("*")
@RestController
public class Dashboardmetric {

    private final Jdbcservice jdbcservice;

    public Dashboardmetric(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @GetMapping("/hello")
    public String hello() {
        return "Hello from Dashboardmetric!";
    }

    @GetMapping("/cpu/{tenant_id}")
    public List<HostMetricReponse> getCpuMetrics(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT ts, cpu,host_id FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";
        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new HostMetricReponse(
                        rs.getString("ts"),
                        rs.getDouble("cpu"),
                        rs.getString("host_id")
                ),
                tenantId
        );
    }

    @GetMapping("/ram/{tenant_id}")
    public List<HostMetricReponse> getRamMetrics(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT ts, memory,host_id FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";
        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new HostMetricReponse(
                        rs.getString("ts"),
                        rs.getDouble("memory"),
                        rs.getString("host_id")
                ),
                tenantId
        );
    }

    @GetMapping("/disk/{tenant_id}")
    public List<HostMetricReponse> getDiskMetrics(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT ts, disk,host_id FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";
        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new HostMetricReponse(
                        rs.getString("ts"),
                        rs.getDouble("disk"),
                        rs.getString("host_id")
                ),
                tenantId
        );
    }



}
