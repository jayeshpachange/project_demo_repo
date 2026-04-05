package com.resort.solution.entity;

import com.resort.solution.enums.ConditionEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
@Table(name="pricing_rule")
public class PricingRule {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="rule_id")
	private Integer ruleId;
	
	@Setter
	@Column(name="rule_name" , nullable = false)
	private String ruleName;
	
	@Setter
	@Enumerated(EnumType.STRING)
	@Column(name="rule_condition")
	private ConditionEnum condition;
	
	@Setter
	@Column(name="multiplier" , nullable = false)
	private double multiplier;
	

}

//ruleId (PK) → Primary key uniquely identifying each pricing rule
//
//ruleName → Descriptive name of the pricing rule (e.g., Weekend Surge, Festival Pricing)
//
//condition → Logical condition under which the rule is applied (season, occupancy, demand)
//
//multiplier → Price multiplier applied to the base price (e.g., 1.2×, 1.5×)