package org.example.sentinelalert.service;

import lombok.RequiredArgsConstructor;
import org.example.sentinelalert.Model.Alert;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;

    public void notifyAlerttoemail(Alert alert, String email) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("aggarwalgunjan597@gmail.com");
        message.setTo(email);
        message.setSubject("🚨 Sentinel Alert: " + alert.getSeverity());
        message.setText(buildEmailBody(alert));

        mailSender.send(message);

    }

    private String buildEmailBody(Alert alert) {
        return """
            ALERT FIRED 🚨

            Rule ID   : %s
            Severity  : %s
            Tenant ID : %s
            Host ID   : %s
            Metric    : %s
            Value     : %s
            Time      : %s

            -- Sentinel Monitoring System
            """.formatted(
                alert.getRuleId(),
                alert.getSeverity(),
                alert.getTenantId(),
                alert.getHostId(),
                alert.getMetric(),
                alert.getValue(),
                alert.getTs()
        );
    }
}
