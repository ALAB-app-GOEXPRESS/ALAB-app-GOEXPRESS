package com.alab.goexpress.trainsearch;

import com.alab.goexpress.model.dto.TrainBetweenStationsDto;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TrainSearchMapper {
  List<TrainBetweenStationsDto> findTrainsBetweenStations(
    @Param("fromStationCd") String fromStationCd,
    @Param("toStationCd") String toStationCd
  );
}
