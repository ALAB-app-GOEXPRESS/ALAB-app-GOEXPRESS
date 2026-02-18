package com.alab.goexpress.plan;

import com.alab.goexpress.model.dto.TrainBetweenStationsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainSearchService {

  private final TrainSearchMapper mapper;

  @Transactional(readOnly = true)
  public List<TrainBetweenStationsDto> findBetween(String fromStationCd, String toStationCd) {
    return mapper.findTrainsBetweenStations(fromStationCd, toStationCd);
  }
}
