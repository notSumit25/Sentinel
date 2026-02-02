package org.example.queryservice.grpc;

import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.example.queryservice.service.Jdbcservice;

import java.util.List;

/**
 * gRPC implementation for the AlertRuleService defined in queryservice.proto.
 * This mirrors the existing REST endpoints in org.example.queryservice.Alertrule.Alertrules.
 */
@GrpcService
public class AlertRuleServiceImpl extends AlertRuleServiceGrpc.AlertRuleServiceImplBase {

    private final Jdbcservice jdbcservice;

    public AlertRuleServiceImpl(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @Override
    public void listAlertRulesByTenant(TenantRequest request,
                                       StreamObserver<AlertRuleList> responseObserver) {
        String sql = "SELECT * FROM sentinel.alert_rules WHERE tenant_id = ?";

        List<AlertRule> rules = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> AlertRule.newBuilder()
                        .setRuleId(rs.getString("rule_id"))
                        .setMetricName(rs.getString("metric_name"))
                        .setThreshold(rs.getFloat("threshold"))
                        .setOperator(rs.getString("operator"))
                        .setSeverity(rs.getString("severity"))
                        .setEnabled(rs.getInt("enabled"))
                        .setTenantId(rs.getString("tenant_id"))
                        .setHostId(rs.getString("host_id"))
                        .build(),
                request.getTenantId()
        );

        AlertRuleList response = AlertRuleList.newBuilder()
                .addAllRules(rules)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void createAlertRule(CreateAlertRuleRequest request,
                                StreamObserver<Empty> responseObserver) {
        AlertRule rule = request.getRule();
        String sql = "INSERT INTO sentinel.alert_rules " +
                "(rule_id, metric_name, threshold, operator, severity, enabled, tenant_id, host_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        int result = jdbcservice.getJdbcTemplate().update(
                sql,
                rule.getRuleId(),
                rule.getMetricName(),
                rule.getThreshold(),
                rule.getOperator(),
                rule.getSeverity(),
                rule.getEnabled(),
                rule.getTenantId(),
                rule.getHostId()
        );

        if (result > 0) {
            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();
        } else {
            responseObserver.onError(new IllegalStateException("Failed to create alert rule"));
        }
    }

    @Override
    public void deleteAlertRule(DeleteAlertRuleRequest request,
                                StreamObserver<Empty> responseObserver) {
        String sql = "DELETE FROM sentinel.alert_rules WHERE rule_id = ?";

        int result = jdbcservice.getJdbcTemplate().update(sql, request.getRuleId());

        if (result > 0) {
            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();
        } else {
            responseObserver.onError(new IllegalStateException("Failed to delete alert rule"));
        }
    }

    @Override
    public void updateAlertRule(UpdateAlertRuleRequest request,
                                StreamObserver<Empty> responseObserver) {
        AlertRule rule = request.getRule();

        String sql = "UPDATE sentinel.alert_rules " +
                "SET metric_name = ?, threshold = ?, operator = ?, severity = ?, enabled = ? " +
                "WHERE rule_id = ?";

        int result = jdbcservice.getJdbcTemplate().update(
                sql,
                rule.getMetricName(),
                rule.getThreshold(),
                rule.getOperator(),
                rule.getSeverity(),
                rule.getEnabled(),
                request.getRuleId()
        );

        if (result > 0) {
            responseObserver.onNext(Empty.getDefaultInstance());
            responseObserver.onCompleted();
        } else {
            responseObserver.onError(new IllegalStateException("Failed to update alert rule"));
        }
    }
}