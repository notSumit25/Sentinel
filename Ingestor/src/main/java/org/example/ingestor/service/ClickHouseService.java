package org.example.ingestor.service;

import org.example.ingestor.model.Metric;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClickHouseService {

    public void savetoClickHouse(List<Metric> metrics) {
        System.out.println("Saving " + metrics.size() + " metrics to ClickHouse.");

    }
}
