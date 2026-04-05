package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.PricingRule;

public interface PricingRuleService {
    PricingRule addPricingRule(PricingRule pricingRule);
    PricingRule updatePricingRule(Integer ruleId, PricingRule pricingRule);
    List<PricingRule> getAllPricingRules();
    double applyPricingRules(double basePrice);
}
//•	addPricingRule
//•	updatePricingRule
//•	getAllPricingRules
//•	applyPricingRules == > this method is used to show finalprice by applying all rules on it
