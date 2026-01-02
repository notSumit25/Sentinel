package org.example.queryservice;

public class HostMetricReponse {
    private String ts;
    private String hostId;
    private Double cpu;

    public HostMetricReponse(String ts, Double cpu, String hostId) {
        this.ts = ts;
        this.hostId = hostId;
        this.cpu = cpu;
    }

    // ⚠️ THESE GETTERS ARE REQUIRED ⚠️
    public String getTs() { return ts; }
    public Double getCpu() { return cpu; }
    public String getHostId() { return hostId; }
}
