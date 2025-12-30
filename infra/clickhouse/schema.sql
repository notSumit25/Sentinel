CREATE DATABASE IF NOT EXISTS sentinel;

CREATE TABLE IF NOT EXISTS sentinel.sentinel_vm_metrics
(
    tenant_id String,
    host_id   String,
    ts        DateTime,

    cpu       Float32,
    memory    Float32,
    disk      Float32,

    net_in    UInt64,
    net_out   UInt64
)
ENGINE = MergeTree
PARTITION BY (tenant_id, toDate(ts))
ORDER BY (tenant_id, host_id, ts);
