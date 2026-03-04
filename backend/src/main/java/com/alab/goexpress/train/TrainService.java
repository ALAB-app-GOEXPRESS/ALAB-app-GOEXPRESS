package com.alab.goexpress.train;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TrainService {

  private final TrainMapper mapper;

  @Transactional(readOnly = true)
  public List<TrainResponse> find(String fromStationCd, String toStationCd) {
    return mapper.selectTrains(fromStationCd, toStationCd);
  }
}
