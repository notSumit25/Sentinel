package org.example.queryservice.Alert;

import org.example.queryservice.Response.AlertResponse;
import org.example.queryservice.service.Jdbcservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/alerts")
@CrossOrigin("*")
@RestController
public class Alert {

    private final Jdbcservice jdbcservice;

    public Alert(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @GetMapping("/all/{tenant_id}")
    public List<AlertResponse> getAlertsByTenantId(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT * FROM sentinel.alerts WHERE tenant_id = ?";
        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new AlertResponse(
                        rs.getString("alert_id"),
                        rs.getString("rule_id"),
                        rs.getString("metric_name"),
                        rs.getDouble("metric_value"),
                        rs.getString("severity"),
                        rs.getObject("ts", java.time.LocalDateTime.class),
                        rs.getString("tenant_id"),
                        rs.getString("host_id")
                ),
                tenantId
        );

    }

    @GetMapping("/hostid/{tenant_id}/{host_id}")
    public List<AlertResponse> getAlertsByTenantAndHostId(@PathVariable("tenant_id") String tenantId, @PathVariable("host_id") String hostId) {
        String sql = "SELECT * FROM sentinel.alerts WHERE tenant_id = ? AND host_id = ?";
        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new AlertResponse(
                        rs.getString("alert_id"),
                        rs.getString("rule_id"),
                        rs.getString("metric_name"),
                        rs.getDouble("metric_value"),
                        rs.getString("severity"),
                        rs.getObject("ts", java.time.LocalDateTime.class),
                        rs.getString("tenant_id"),
                        rs.getString("host_id")
                ),
                tenantId,
                hostId
        );
    }
}
