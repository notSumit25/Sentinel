package org.example.ingestor.Consumer;

import org.example.ingestor.service.IngestionService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.connection.stream.ReadOffset;

import java.time.Duration;
import java.util.Map;

@Component
public class RedisConsumer implements CommandLineRunner {

    private final StringRedisTemplate redisTemplate;
    private final IngestionService ingestionService;

    final String STREAM_KEY = "sentinel.metrics.raw";
    private String lastID = "$";

    public RedisConsumer(StringRedisTemplate redisTemplate, IngestionService ingestionService) {
        this.ingestionService = ingestionService;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Starting Redis Consumer on stream: " + STREAM_KEY);

        // Check connection
        if (Boolean.FALSE.equals(redisTemplate.hasKey(STREAM_KEY))) {
            System.out.println("⚠️ Warning: Stream key not found yet. Waiting for Go Agent...");
        }

        while (true) {
            try {
                // 1. Read from Stream
                var entries = redisTemplate.opsForStream().read(
                        StreamReadOptions.empty().count(1).block(Duration.ofMillis(2000)), // Wait up to 2s
                        StreamOffset.create(STREAM_KEY, ReadOffset.from(lastID))
                );

                if (entries != null && !entries.isEmpty()) {
                    for (var entry : entries) {
                        lastID = entry.getId().getValue();
                        Map<Object, Object> body = entry.getValue();

                        String jsonPayload = body.get("data") != null ? body.get("data").toString() : null;

                        if (jsonPayload != null) {
                            ingestionService.process(jsonPayload);
                        } else {
                            System.err.println("⚠️ Received message missing 'data' field: " + body);
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("❌ Consumer Error: " + e.getMessage());
                Thread.sleep(1000);
            }
        }
    }
}