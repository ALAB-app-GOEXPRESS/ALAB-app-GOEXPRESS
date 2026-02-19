package com.alab.goexpress.trainsearch;

import com.alab.goexpress.model.dto.TrainBetweenStationsDto;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrainSearchService {

  private final TrainSearchMapper mapper;

  @Transactional(readOnly = true)
  public List<TrainBetweenStationsDto> findBetween(String fromStationCd, String toStationCd) {
    return mapper.findTrainsBetweenStations(fromStationCd, toStationCd);
  }
}
