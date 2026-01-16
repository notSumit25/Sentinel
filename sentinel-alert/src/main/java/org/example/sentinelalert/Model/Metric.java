package org.example.sentinelalert.Model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Metric {
    private String tenantId;
    private String hostId;
    private String ts;
    private double cpu;
    private double memory;
    private  double disk;
    private long netIn;
    private long netOut;

}
