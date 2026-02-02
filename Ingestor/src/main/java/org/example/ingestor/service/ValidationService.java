package org.example.ingestor.service;

import org.example.ingestor.model.Metric;
import org.springframework.stereotype.Service;
import org.example.ingestor.util.Jsonutil;

@Service
public class ValidationService {


    private final Jsonutil jsonutil;

    ValidationService(Jsonutil jsonutil) {
        this.jsonutil = jsonutil;
    }

    public Metric isValid(Object input) {
        if(this.jsonutil.parseToMetric(input) == null) {
            System.err.println("🚫 [DROP] Null Metric received.");
            return null;
        }
        return this.jsonutil.parseToMetric(input);
    }
}