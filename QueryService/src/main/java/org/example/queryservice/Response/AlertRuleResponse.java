package org.example.queryservice.Response;

import lombok.Data;

@Data
public class AlertRuleResponse {
   private String rule_id;
    private String metric_name;
   private Float threshold;
   private String operator;
   private String severity;
   private Number enabled;
   private String tenant_id;
   private String host_id;

    public AlertRuleResponse(String rule_id, String metric_name, Float threshold, String operator, String severity, Number enabled, String tenant_id, String host_id) {
         this.rule_id = rule_id;
         this.metric_name = metric_name;
         this.threshold = threshold;
         this.operator = operator;
         this.severity = severity;
         this.enabled = enabled;
         this.tenant_id = tenant_id;
         this.host_id = host_id;
    }


}
