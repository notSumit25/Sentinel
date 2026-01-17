package org.example.queryservice.Alertrule;

import org.example.queryservice.Response.AlertRuleResponse;
import org.example.queryservice.service.Jdbcservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/alertrules")
@CrossOrigin("*")
@RestController
public class Alertrules {

    private final Jdbcservice jdbcservice;

    public Alertrules(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @GetMapping("/all-alertrules/{tenant_id}")
    public List<AlertRuleResponse> getAllAlertRules(@PathVariable("tenant_id") String tenantId) {
        String sql = "SELECT * FROM sentinel.alert_rules WHERE tenant_id = ?";
        return jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> new AlertRuleResponse(
                        rs.getString("rule_id"),
                        rs.getString("metric_name"),
                        rs.getFloat("threshold"),
                        rs.getString("operator"),
                        rs.getString("severity"),
                        rs.getInt("enabled"),
                        rs.getString("tenant_id"),
                        rs.getString("host_id")
                ),
                tenantId
        );
    }

    @PostMapping("/create-alertrule/{tenant_id}/{host_id}")
    public String createAlertRule(@RequestBody AlertRuleResponse alertRule, @PathVariable("tenant_id") String tenantId, @PathVariable("host_id") String hostId) {
        System.out.println(alertRule);
        String sql = "INSERT INTO sentinel.alert_rules (rule_id, metric_name, threshold, operator, severity, enabled, tenant_id, host_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        int result = jdbcservice.getJdbcTemplate().update(
                sql,
                alertRule.getRule_id(),
                alertRule.getMetric_name(),
                alertRule.getThreshold(),
                alertRule.getOperator(),
                alertRule.getSeverity(),
                alertRule.getEnabled(),
                tenantId,
                hostId
        );
        if (result > 0) {
            return "Alert rule created successfully.";
        } else {
            return "Failed to create alert rule.";
        }
    }

    @DeleteMapping("/delete-alertrule/{rule_id}")
    public String deleteAlertRule(@PathVariable("rule_id") String ruleId) {
        String sql = "DELETE FROM sentinel.alert_rules WHERE rule_id = ?";
        int result = jdbcservice.getJdbcTemplate().update(sql, ruleId);
        if (result > 0) {
            return "Alert rule deleted successfully.";
        } else {
            return "Failed to delete alert rule.";
        }
    }


    @PutMapping("/update-alertrule/{rule_id}")
    public String updateAlertRule(@PathVariable("rule_id") String ruleId, @RequestBody AlertRuleResponse alertRule) {
        String sql = "UPDATE sentinel.alert_rules SET metric_name = ?, threshold = ?, operator = ?, severity = ?, enabled = ? WHERE rule_id = ?";
        int result = jdbcservice.getJdbcTemplate().update(
                sql,
                alertRule.getMetric_name(),
                alertRule.getThreshold(),
                alertRule.getOperator(),
                alertRule.getSeverity(),
                alertRule.getEnabled(),
                ruleId
        );
        if (result > 0) {
            return "Alert rule updated successfully.";
        } else {
            return "Failed to update alert rule.";
        }
    }
}
