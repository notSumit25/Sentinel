package metrics

import "github.com/shirou/gopsutil/v3/disk"

func Disk() (float64, error) {
	u, err := disk.Usage("/")
	if err != nil {
		return 0, err
	}
	return u.UsedPercent, nil
}
