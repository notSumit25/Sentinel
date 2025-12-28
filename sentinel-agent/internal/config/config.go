package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	TenantID string
	HostID   string
	Interval int
	RedisURL string
}

func Load() (*Config, error) {
	interval, err := strconv.Atoi(os.Getenv("INTERVAL"))
	if err != nil || interval <= 0 {
		return nil, fmt.Errorf("invalid INTERVAL")
	}

	cfg := &Config{
		TenantID: os.Getenv("TENANT_ID"),
		HostID:   os.Getenv("HOST_ID"),
		Interval: interval,
		RedisURL: os.Getenv("REDIS_URL"),
	}

	if cfg.TenantID == "" || cfg.HostID == "" || cfg.RedisURL == "" {
		return nil, fmt.Errorf("missing required env vars")
	}

	return cfg, nil
}
