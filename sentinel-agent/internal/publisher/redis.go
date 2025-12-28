package publisher

import (
	"context"
	"encoding/json"

	"github.com/redis/go-redis/v9"
	"sentinel-agent/internal/model"
)

type RedisPublisher struct {
	client *redis.Client
}

func NewRedisPublisher(url string) *RedisPublisher {
	opts, _ := redis.ParseURL(url)
	return &RedisPublisher{
		client: redis.NewClient(opts),
	}
}

func (r *RedisPublisher) Publish(ctx context.Context, snap model.Snapshot) error {
	data, err := json.Marshal(snap)
	if err != nil {
		return err
	}

	return r.client.XAdd(ctx, &redis.XAddArgs{
		Stream: "sentinel.metrics.raw",
		Values: map[string]any{
			"tenant_id": snap.TenantID,
			"host_id":   snap.HostID,
			"data":      string(data),
		},
	}).Err()
}
