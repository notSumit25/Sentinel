package org.example.ingestor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IngestorApplication {

    public static void main(String[] args) {
        SpringApplication.run(IngestorApplication.class, args);
        System.out.println("Ingestor Service is running...");
    };
}
