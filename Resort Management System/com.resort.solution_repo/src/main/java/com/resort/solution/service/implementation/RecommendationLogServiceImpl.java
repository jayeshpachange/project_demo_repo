package com.resort.solution.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.RecommendationLog;
import com.resort.solution.entity.Resort;
import com.resort.solution.entity.User;
import com.resort.solution.enums.ResortStatus;
import com.resort.solution.repository.RecommendationLogRepository;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.repository.UserRepository;
import com.resort.solution.service.RecommendationLogService;

@Service
public class RecommendationLogServiceImpl implements RecommendationLogService {
	
	@Autowired
	private RecommendationLogRepository relrepo;
	
	@Autowired
	private ResortRepository resrepo;
	
	@Autowired
	private UserRepository userRepo;
	
	

	@Override
	public List<Resort> generateRecommendations(Integer userId) {
		double minRating = 4.0;

	    return resrepo.findByIsActiveAndRatingGreaterThan(ResortStatus.ACTIVE, minRating);
 	}

	@Override
	public RecommendationLog saveRecommendation(RecommendationLog recommendationLog) {
		if(recommendationLog == null || recommendationLog.getUser() == null || recommendationLog.getResort() == null) {
			return null;
		}
		Integer resortId = recommendationLog.getResort().getResortId();
		Resort resort = resrepo.findById(resortId).orElseThrow(()-> new RuntimeException("No such roomId"));
		recommendationLog.setResort(resort);
		
		Integer userid = recommendationLog.getUser().getUserId();
		User user = userRepo.findById(userid).orElseThrow(() -> new RuntimeException("User id is invalid..."));
		recommendationLog.setUser(user);
		
		return relrepo.save(recommendationLog);
	}

	@Override
	public List<RecommendationLog> getRecommendationsByUser(Integer userId) {
		List<RecommendationLog> reco = relrepo.findByUser_UserId(userId);
		return reco;
	}

	@Override
	public List<RecommendationLog> getAll() {
		return relrepo.findAll();
	}

}
