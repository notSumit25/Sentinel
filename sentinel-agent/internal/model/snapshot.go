package model

import "time"

type Snapshot struct {
	TenantID string    `json:"tenant_id"`
	HostID   string    `json:"host_id"`
	Time     time.Time `json:"timestamp"`

	CPU    float64 `json:"cpu"`
	Memory float64 `json:"memory"`
	Disk   float64 `json:"disk"`

	NetIn  uint64 `json:"net_in"`
	NetOut uint64 `json:"net_out"`
}
