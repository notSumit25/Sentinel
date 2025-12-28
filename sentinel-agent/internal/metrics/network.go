package metrics

import "github.com/shirou/gopsutil/v3/net"

func Network() (uint64, uint64, error) {
	stats, err := net.IOCounters(false)
	if err != nil {
		return 0, 0, err
	}
	return stats[0].BytesRecv, stats[0].BytesSent, nil
}
