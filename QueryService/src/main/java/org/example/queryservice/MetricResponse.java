package org.example.queryservice;

public class MetricResponse {
    private String ts;
    private Double cpu;

    public MetricResponse(String ts, Double cpu) {
        this.ts = ts;
        this.cpu = cpu;
    }

    // ⚠️ THESE GETTERS ARE REQUIRED ⚠️
    public String getTs() { return ts; }
    public Double getCpu() { return cpu; }
}