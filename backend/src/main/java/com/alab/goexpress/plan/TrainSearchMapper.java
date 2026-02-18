package com.alab.goexpress.plan;

import com.alab.goexpress.model.dto.TrainBetweenStationsDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TrainSearchMapper {

  List<TrainBetweenStationsDto> findTrainsBetweenStations(
    @Param("fromStationCd") String fromStationCd,
    @Param("toStationCd") String toStationCd
  );
}
