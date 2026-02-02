package org.example.queryservice.grpc;

import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.example.queryservice.service.Jdbcservice;

import java.util.List;

/**
 * Dashboard-related gRPC methods for QueryService (CPU/RAM/Disk per host).
 */
@GrpcService
public class DashboardQueryServiceImpl extends QueryServiceGrpc.QueryServiceImplBase {

    private final Jdbcservice jdbcservice;

    public DashboardQueryServiceImpl(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @Override
    public void getDashboardCpu(TenantRequest request,
                                StreamObserver<HostMetrics> responseObserver) {
        String sql = "SELECT ts, cpu, host_id FROM sentinel.sentinel_vm_metrics " +
                "WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        List<HostMetric> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> HostMetric.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("cpu"))
                        .setHostId(rs.getString("host_id"))
                        .build(),
                request.getTenantId()
        );

        HostMetrics response = HostMetrics.newBuilder()
                .addAllMetrics(metrics)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getDashboardRam(TenantRequest request,
                                StreamObserver<HostMetrics> responseObserver) {
        String sql = "SELECT ts, memory, host_id FROM sentinel.sentinel_vm_metrics " +
                "WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        List<HostMetric> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> HostMetric.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("memory"))
                        .setHostId(rs.getString("host_id"))
                        .build(),
                request.getTenantId()
        );

        HostMetrics response = HostMetrics.newBuilder()
                .addAllMetrics(metrics)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getDashboardDisk(TenantRequest request,
                                 StreamObserver<HostMetrics> responseObserver) {
        String sql = "SELECT ts, disk, host_id FROM sentinel.sentinel_vm_metrics " +
                "WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        List<HostMetric> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> HostMetric.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("disk"))
                        .setHostId(rs.getString("host_id"))
                        .build(),
                request.getTenantId()
        );

        HostMetrics response = HostMetrics.newBuilder()
                .addAllMetrics(metrics)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}