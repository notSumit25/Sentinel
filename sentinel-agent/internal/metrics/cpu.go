package metrics

import "github.com/shirou/gopsutil/v3/cpu"

func CPU() (float64, error) {
	p, err := cpu.Percent(0, false)
	if err != nil {
		return 0, err
	}
	return p[0], nil
}
