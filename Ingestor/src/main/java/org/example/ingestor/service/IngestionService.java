package org.example.ingestor.service;


import org.springframework.stereotype.Service;
import org.example.ingestor.model.Metric;

@Service
public class IngestionService {

    private final BatchAggregator batchAggregator;
    private final ValidationService validationService;

    public IngestionService(BatchAggregator batchAggregator, ValidationService validationService) {
        this.batchAggregator = batchAggregator;
        this.validationService = validationService;
    }

    public void process(Object metric) {

        if (this.validationService.isValid(metric) == null) {
            return;
        }
        Metric validMetric = this.validationService.isValid(metric);
        System.out.println("✅ [INGEST] Valid Metric received: " + validMetric);
        batchAggregator.addToBatch(validMetric);
    }
}