package com.resort.solution.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resort.solution.entity.PricingRule;

public interface PricingRuleRepository extends JpaRepository<PricingRule, Integer> {

}
