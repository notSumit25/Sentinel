package org.example.ingestor.service;

import org.example.ingestor.model.Metric;
//import org.example.ingestor.repository.ClickHouseRepository; // Import your repo
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class BatchAggregator {


    private final ClickHouseService clickHouseRepository;

    // Thread-safe buffer
    private final List<Metric> buffer = Collections.synchronizedList(new ArrayList<>());
    private final int BATCH_SIZE_THRESHOLD = 500;

    public BatchAggregator(ClickHouseService clickHouseRepository) {
        this.clickHouseRepository = clickHouseRepository;
    }


    public void addToBatch(Metric metric) {
        buffer.add(metric);

        if (buffer.size() >= BATCH_SIZE_THRESHOLD) {
            flushBatch();
        }
    }


    @Scheduled(fixedRate = 10000)
    public void flushBatch() {
        if (buffer.isEmpty()) return;

        List<Metric> batchToProcess;

        synchronized (buffer) {
            if (buffer.isEmpty()) return;
            batchToProcess = new ArrayList<Metric>(buffer);
            buffer.clear();
        }

        this.clickHouseRepository.savetoClickHouse(batchToProcess);
    }
}