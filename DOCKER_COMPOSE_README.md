# Docker Compose Setup for Sentinel

This Docker Compose configuration provides a complete development environment for the Sentinel metrics platform with Redis and ClickHouse.

## Services

### Redis

- **Image**: redis:7-alpine
- **Port**: 6379
- **Purpose**: Caching, message queue, and real-time data storage
- **Health Check**: Enabled
- **Data Persistence**: Enabled with AOF (Append Only File)

### ClickHouse

- **Image**: clickhouse/clickhouse-server:latest
- **Ports**:
  - 8123 (HTTP interface)
  - 9000 (Native TCP protocol)
  - 9009 (Keeper TCP protocol)
- **Purpose**: Time-series metrics storage and analytics
- **Health Check**: Enabled
- **Data Persistence**: Enabled

## Quick Start

### 1. Clone and navigate to the project

```bash
cd /path/to/sentinel
```

### 2. Configure environment variables (optional)

Edit `.env` file to set custom values:

```env
REDIS_PASSWORD=your_redis_password
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=your_clickhouse_password
```

### 3. Start services

```bash
docker-compose up -d
```

### 4. Verify services are running

```bash
docker-compose ps
```

### 5. Check health status

```bash
docker-compose logs -f
```

## Useful Commands

### Access Redis CLI

```bash
docker-compose exec redis redis-cli
```

### Access ClickHouse CLI

```bash
docker-compose exec clickhouse clickhouse-client
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f redis
docker-compose logs -f clickhouse
```

### Stop services

```bash
docker-compose down
```

### Stop and remove volumes

```bash
docker-compose down -v
```

### Rebuild services

```bash
docker-compose up -d --build
```

## ClickHouse Database Setup

The ClickHouse container automatically creates a database named `sentinel`. To create tables, connect to the ClickHouse server:

```bash
docker-compose exec clickhouse clickhouse-client
```

### Example: Create a metrics table

```sql
CREATE TABLE IF NOT EXISTS sentinel.metrics (
    timestamp DateTime,
    tenant_id String,
    host_id String,
    metric_name String,
    metric_value Float64
) ENGINE = MergeTree()
ORDER BY (tenant_id, host_id, timestamp);
```

## Redis Configuration

The Redis container uses:

- AOF (Append Only File) for persistence
- Default port 6379
- Alpine Linux for minimal image size

To set a password, update the `.env` file and modify the `redis` service command in `docker-compose.yml`.

## Network

All services are connected via a bridge network named `sentinel-network`, allowing them to communicate using service names as hostnames.

## Production Considerations

- Change default passwords in `.env`
- Enable authentication for both Redis and ClickHouse
- Mount proper configuration files
- Use named volumes for persistence
- Configure resource limits
- Set up monitoring and logging
- Use environment-specific compose files

## Troubleshooting

### Services failing to start

```bash
docker-compose logs <service-name>
```

### Port conflicts

Check if ports 6379, 8123, 9000 are already in use:

```bash
# On Linux/WSL
lsof -i :6379
lsof -i :8123
lsof -i :9000
```

### Reset everything

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

## References

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Redis Official Image](https://hub.docker.com/_/redis)
- [ClickHouse Documentation](https://clickhouse.com/docs/)
