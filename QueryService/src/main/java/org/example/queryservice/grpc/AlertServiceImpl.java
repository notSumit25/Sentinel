package org.example.queryservice.grpc;

import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.example.queryservice.service.Jdbcservice;

import java.time.LocalDateTime;
import java.util.List;

/**
 * gRPC implementation for the AlertService defined in queryservice.proto.
 * This mirrors the existing REST endpoints in org.example.queryservice.Alert.Alert.
 */
@GrpcService
public class AlertServiceImpl extends AlertServiceGrpc.AlertServiceImplBase {

    private final Jdbcservice jdbcservice;

    public AlertServiceImpl(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @Override
    public void listAlertsByTenant(TenantRequest request,
                                   StreamObserver<AlertList> responseObserver) {
        String sql = "SELECT * FROM sentinel.alerts WHERE tenant_id = ?";

        List<Alert> alerts = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> Alert.newBuilder()
                        .setAlertId(rs.getString("alert_id"))
                        .setRuleId(rs.getString("rule_id"))
                        .setMetricName(rs.getString("metric_name"))
                        .setMetricValue(rs.getDouble("metric_value"))
                        .setSeverity(rs.getString("severity"))
                        .setTs(rs.getObject("ts", LocalDateTime.class).toString())
                        .setTenantId(rs.getString("tenant_id"))
                        .setHostId(rs.getString("host_id"))
                        .build(),
                request.getTenantId()
        );

        AlertList response = AlertList.newBuilder()
                .addAllAlerts(alerts)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void listAlertsByTenantHost(HostRequest request,
                                       StreamObserver<AlertList> responseObserver) {
        String sql = "SELECT * FROM sentinel.alerts WHERE tenant_id = ? AND host_id = ?";

        List<Alert> alerts = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> Alert.newBuilder()
                        .setAlertId(rs.getString("alert_id"))
                        .setRuleId(rs.getString("rule_id"))
                        .setMetricName(rs.getString("metric_name"))
                        .setMetricValue(rs.getDouble("metric_value"))
                        .setSeverity(rs.getString("severity"))
                        .setTs(rs.getObject("ts", LocalDateTime.class).toString())
                        .setTenantId(rs.getString("tenant_id"))
                        .setHostId(rs.getString("host_id"))
                        .build(),
                request.getTenantId(),
                request.getHostId()
        );

        AlertList response = AlertList.newBuilder()
                .addAllAlerts(alerts)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}