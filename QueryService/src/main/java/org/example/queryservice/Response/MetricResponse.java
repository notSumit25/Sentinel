package org.example.queryservice.Response;

public class MetricResponse {
    private String ts;
    private Double value;

    public MetricResponse(String ts, Double value) {
        this.ts = ts;
        this.value = value;
    }

    // ⚠️ THESE GETTERS ARE REQUIRED ⚠️
    public String getTs() { return ts; }
    public Double getValue() { return value; }
}