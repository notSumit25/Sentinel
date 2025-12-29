package org.example.ingestor.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Useful to ignore extra fields
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@JsonIgnoreProperties(ignoreUnknown = true) // Safer: prevents crashes if Go adds new fields
public class Metric {

    @JsonProperty("tenant_id")
    private String tenantId;

    @JsonProperty("host_id")
    private String hostId;

    // Go sends "time.Time" as an ISO String (e.g. "2025-12-29T..."), so we use String here.
    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("cpu")
    private double cpuUsage;

    @JsonProperty("memory") // Matches Go json:"memory"
    private double ramUsage;

    @JsonProperty("disk")
    private double diskUsage;

    @JsonProperty("net_in")
    private long networkIn;

    @JsonProperty("net_out")
    private long networkOut;
}