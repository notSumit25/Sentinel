package org.example.sentinelalert.scheduler;

import lombok.RequiredArgsConstructor;
import org.example.sentinelalert.Model.AlertRule;
import org.example.sentinelalert.Model.Metric;
import org.example.sentinelalert.repository.ClickHouseRepository;
import org.example.sentinelalert.service.AlertService;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@EnableScheduling
public class AlertScheduler {

    private final ClickHouseRepository repo;
    private final AlertService alertService;

    @Scheduled(
            fixedRate = 30 * 60 * 1000,   // every 30 minutes
            initialDelay = 60 * 1000      // wait 1 minute after startup
    )
    public void runAlerts() {
        List<Metric> metrics = repo.fetchLatestMetrics();
        List<AlertRule> rules = repo.fetchRules();
        alertService.evaluate(metrics, rules);
    }
}
