package org.example.sentinelalert;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SentinelAlertApplication {

    public static void main(String[] args) {
        SpringApplication.run(SentinelAlertApplication.class, args);
    }

}
