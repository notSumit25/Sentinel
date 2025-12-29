package org.example.ingestor.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.ingestor.model.Metric;

import org.springframework.stereotype.Service;

@Service
public class Jsonutil {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Metric parseToMetric(Object input) {
        if (input == null) return null;

        try {
            if (input instanceof Metric) {
                return (Metric) input;
            }
            if (input instanceof String) {
                return objectMapper.readValue((String) input, Metric.class);
            }
            return objectMapper.convertValue(input, Metric.class);
        } catch (Exception e) {
            System.err.println("❌ JSON Parsing Error: " + e.getMessage());
            return null;
        }
    }
}