package org.example.queryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class QueryServiceApplication {

    public static void main(String[] args) {
        System.out.println("Starting Query Service Application...");
        SpringApplication.run(QueryServiceApplication.class, args);
    }

}
