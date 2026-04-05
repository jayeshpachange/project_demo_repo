package com.resort.solution.service;

import java.util.List;

import com.resort.solution.entity.Resort;
import com.resort.solution.entity.ResortImage;

public interface ResortImageService {
	
	ResortImage addResortImage(ResortImage resortImg);
	boolean deleteResortImage(Integer resortImgId);
	List<ResortImage> getImagesByResort(Integer resortImgId);

}

//•	addResortImage
//•	deleteResortImage
//•	getImagesByResort
