package org.example.queryservice.grpc;

import com.google.protobuf.DoubleValue;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.example.queryservice.service.Jdbcservice;

import java.util.List;

/**
 * RAM-related gRPC methods for QueryService, using the same SQL as the REST RAM controller.
 * 
 * NOTE: @GrpcService removed to avoid duplicate service registration - only DashboardQueryServiceImpl is active
 */
// @GrpcService
public class RamQueryServiceImpl extends QueryServiceGrpc.QueryServiceImplBase {

    private final Jdbcservice jdbcservice;

    public RamQueryServiceImpl(Jdbcservice jdbcservice) {
        this.jdbcservice = jdbcservice;
    }

    @Override
    public void getRamMetricsTenant(TenantRequest request,
                                    StreamObserver<MetricSeries> responseObserver) {
        String sql = "SELECT ts, memory FROM sentinel.sentinel_vm_metrics WHERE tenant_id = ? ORDER BY ts DESC LIMIT 100";

        List<MetricResponse> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> MetricResponse.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("memory"))
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
    public void getTenantAverageRam(TenantWindowRequest request,
                                    StreamObserver<DoubleValue> responseObserver) {
        String sql = "SELECT avg(memory) FROM sentinel.sentinel_vm_metrics " +
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
    public void getTenantHostRam(HostRequest request,
                                 StreamObserver<MetricSeries> responseObserver) {
        String sql = "SELECT ts, memory FROM sentinel.sentinel_vm_metrics " +
                "WHERE tenant_id = ? AND host_id = ? ORDER BY ts DESC LIMIT 100";

        List<MetricResponse> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> MetricResponse.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("memory"))
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
    public void getRamHistory(HistoryRequest request,
                              StreamObserver<MetricSeries> responseObserver) {
        String sql = "SELECT ts, memory FROM sentinel.sentinel_vm_metrics " +
                "WHERE host_id = ? AND ts >= (now() - INTERVAL ? MINUTE) ORDER BY ts ASC";

        List<MetricResponse> metrics = jdbcservice.getJdbcTemplate().query(
                sql,
                (rs, rowNum) -> MetricResponse.newBuilder()
                        .setTs(rs.getString("ts"))
                        .setValue(rs.getDouble("memory"))
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
