package org.example.queryservice.Response;

public class HostMetricReponse {
    private String ts;
    private String hostId;
    private Double value;

    public HostMetricReponse(String ts, Double value, String hostId) {
        this.ts = ts;
        this.hostId = hostId;
        this.value = value;
    }

    // ⚠️ THESE GETTERS ARE REQUIRED ⚠️
    public String getTs() { return ts; }
    public Double getValue() { return value; }
    public String getHostId() { return hostId; }
}
