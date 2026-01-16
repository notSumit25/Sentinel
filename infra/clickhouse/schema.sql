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

CREATE TABLE IF NOT EXISTS sentinel.alert_rules
(
    rule_id     String,
    metric_name String,      -- cpu, memory, disk, etc.
    threshold   Float32,
    operator    String,      -- >, <, >=, <=
    severity    String,      -- LOW, MEDIUM, CRITICAL
    enabled     UInt8        -- 1 = enabled, 0 = disabled
)
    ENGINE = MergeTree
    ORDER BY rule_id;

CREATE TABLE IF NOT EXISTS sentinel.alerts
(
    alert_id    String,
    rule_id     String,
    tenant_id   String,
    host_id     String,
    ts          DateTime,
    metric_name String,
    metric_value Float32,
    severity    String
)
    ENGINE = MergeTree
    ORDER BY alert_id;

INSERT INTO sentinel.alert_rules VALUES
    (
        'cpu_high',
        'cpu',
        80,
        '>',
        'CRITICAL',
        1
    );

INSERT INTO sentinel.alert_rules VALUES
    (
        'disk_high',
        'disk',
        0,
        '>',
        'CRITICAL',
        1
    );
