package main

import (
	"context"
	"log"
	"time"

	"sentinel-agent/internal/config"
	"sentinel-agent/internal/metrics"
	"sentinel-agent/internal/model"
	"sentinel-agent/internal/publisher"
)

func collect(cfg *config.Config) model.Snapshot {
	cpu, _ := metrics.CPU()
	mem, _ := metrics.Memory()
	disk, _ := metrics.Disk()
	netIn, netOut, _ := metrics.Network()

	return model.Snapshot{
		TenantID: cfg.TenantID,
		HostID:   cfg.HostID,
		Time:     time.Now(),
		CPU:      cpu,
		Memory:   mem,
		Disk:     disk,
		NetIn:    netIn,
		NetOut:   netOut,
	}
}

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	pub := publisher.NewRedisPublisher(cfg.RedisURL)
	ctx := context.Background()

	ticker := time.NewTicker(time.Duration(cfg.Interval) * time.Second)
	defer ticker.Stop()

	log.Println("Sentinel Agent started")

	for range ticker.C {
		snap := collect(cfg)
		if err := pub.Publish(ctx, snap); err != nil {
			log.Println("publish failed:", err)
		}
	}
}
