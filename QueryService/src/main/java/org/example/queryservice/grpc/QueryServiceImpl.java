package org.example.queryservice.grpc;

import com.google.protobuf.DoubleValue;
import com.google.protobuf.Empty;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.example.queryservice.service.Jdbcservice;

import java.util.List;

/**
 * gRPC implementation of the QueryService CPU endpoints (part of the single QueryService in proto).
 * This class will be superseded by QueryServiceImpl; kept empty to avoid compilation errors
 * if referenced elsewhere. Prefer using QueryServiceImpl instead.
 * 
 * NOTE: @GrpcService removed to avoid duplicate service registration - only DashboardQueryServiceImpl is active
 */
// @GrpcService
public class QueryServiceImpl extends QueryServiceGrpc.QueryServiceImplBase {

    private final Jdbcservice jdbcservice;

    public QueryServiceImpl(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    // Hosts
    @Override
    public void listHosts(Empty request, StreamObserver<HostsResponse> responseObserver) {
        String sql = "SELECT DISTINCT host_id FROM sentinel.sentinel_vm_metrics ORDER BY host_id";

        List<String> hosts = jdbcservice.getJdbcTemplate().queryForList(sql, String.class);

        HostsResponse response = HostsResponse.newBuilder()
                .addAllHostIds(hosts)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void listTenantHosts(TenantRequest request, StreamObserver<HostsResponse> responseObserver) {
        String sql = "SELECT DISTINCT host_id FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY host_id";

        List<String> hosts = jdbcservice.getJdbcTemplate().queryForList(
                sql,
                String.class,
                request.getTenantId()
        );

        HostsResponse response = HostsResponse.newBuilder()
                .addAllHostIds(hosts)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    // CPU metrics
    @Override
    public void getCpuMetricsTenant(TenantRequest request, StreamObserver<MetricSeries> responseObserver) {
        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        List<MetricResponse> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> MetricResponse.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("cpu"))
                        .build(),
                request.getTenantId()
        );

        MetricSeries response = MetricSeries.newBuilder()
                .addAllMetrics(metrics)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getTenantAverageCpu(TenantWindowRequest request,
                                    StreamObserver<DoubleValue> responseObserver) {
        String sql = "SELECT avg(cpu) FROM sentinel.sentinel_vm_metrics " +
                "WHERE tenant_id = ? AND ts >= (now() - INTERVAL ? MINUTE)";

        Double avg = jdbcservice.getJdbcTemplate().queryForObject(
                sql,
                Double.class,
                request.getTenantId(),
                request.getMinutes()
        );

        DoubleValue response = DoubleValue.newBuilder()
                .setValue(avg != null ? avg : 0.0)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getTenantHostCpu(HostRequest request,
                                 StreamObserver<MetricSeries> responseObserver) {
        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics " +
                "WHERE tenant_id = ? AND host_id = ? ORDER BY ts DESC LIMIT 100";

        List<MetricResponse> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> MetricResponse.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("cpu"))
                        .build(),
                request.getTenantId(),
                request.getHostId()
        );

        MetricSeries response = MetricSeries.newBuilder()
                .addAllMetrics(metrics)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getCpuHistory(HistoryRequest request,
                              StreamObserver<MetricSeries> responseObserver) {
        String sql = "SELECT ts, cpu FROM sentinel.sentinel_vm_metrics " +
                "WHERE host_id = ? AND ts >= (now() - INTERVAL ? MINUTE) ORDER BY ts ASC";

        List<MetricResponse> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> MetricResponse.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("cpu"))
                        .build(),
                request.getHostId(),
                request.getMinutes()
        );

        MetricSeries response = MetricSeries.newBuilder()
                .addAllMetrics(metrics)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}