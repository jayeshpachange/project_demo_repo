package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.PricingRule;
import com.resort.solution.repository.PricingRuleRepository;
import com.resort.solution.service.PricingRuleService;

@Service
public class PricingRuleServiceImpl implements PricingRuleService {
	
	@Autowired
	private PricingRuleRepository priceRepo;

	@Override
	public PricingRule addPricingRule(PricingRule pricingRule) {
		if(pricingRule == null || pricingRule.getRuleName() == null || pricingRule.getCondition() == null) {
			return null;
		}
		return priceRepo.save(pricingRule);
	}

	@Override
	public PricingRule updatePricingRule(Integer ruleId, PricingRule pricingRule) {
		PricingRule prRule = priceRepo.findById(ruleId).orElse(null);
		if(prRule == null ) {
			return null;
		}
		if(!prRule.getRuleName().equals(pricingRule.getRuleName())) {
			prRule.setRuleName(pricingRule.getRuleName());
		}
		if(prRule.getMultiplier() != pricingRule.getMultiplier()) {
			prRule.setMultiplier(pricingRule.getMultiplier());
		}
		if(!prRule.getCondition().equals(pricingRule.getCondition())) {
			prRule.setCondition(pricingRule.getCondition());
		}
		return priceRepo.save(prRule);
	}

	@Override
	public List<PricingRule> getAllPricingRules() {
		List<PricingRule> prRules = priceRepo.findAll();
		return prRules;
	}

	@Override
	public double applyPricingRules(double basePrice) {
		double finalPrice = basePrice;
        List<PricingRule> rules = priceRepo.findAll();
        for (PricingRule rule : rules) {
            finalPrice = finalPrice * rule.getMultiplier();
        }
        return finalPrice;
	}

}
