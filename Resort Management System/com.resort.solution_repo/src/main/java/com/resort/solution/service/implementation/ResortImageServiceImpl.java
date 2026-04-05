package com.resort.solution.service.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resort.solution.entity.Resort;
import com.resort.solution.entity.ResortImage;
import com.resort.solution.repository.ResortImageRepository;
import com.resort.solution.repository.ResortRepository;
import com.resort.solution.service.ResortImageService;

@Service
public class ResortImageServiceImpl implements ResortImageService {
	
	@Autowired
	private ResortImageRepository resimgrepo;
	
	@Autowired
	private ResortRepository resortRepo;

	@Override
	public ResortImage addResortImage(ResortImage resortImg) {
		if(resortImg == null || resortImg.getResort() == null) {
			return null;
		}
		Integer resortId = resortImg.getResort().getResortId();
		Resort resort = resortRepo.findById(resortId).orElseThrow(() -> new RuntimeException("No such resort.."));
		resortImg.setResort(resort);
		return resimgrepo.save(resortImg);
	}

	@Override
	public boolean deleteResortImage(Integer resortId) {
		Optional<ResortImage> resImg = resimgrepo.findById(resortId);
		if(resImg.isEmpty()) {
			return false;
		}
		resimgrepo.deleteById(resortId);
		return true;
	} 

	@Override
	public List<ResortImage> getImagesByResort(Integer resortImgId) {
		List<ResortImage> resImg = resimgrepo.findByResort_ResortId(resortImgId);
		return resImg;
	}

}
