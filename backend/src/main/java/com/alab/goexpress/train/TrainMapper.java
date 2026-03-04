package com.alab.goexpress.train;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TrainMapper {
  List<TrainBetweenStationsDto> findTrainsBetweenStations(
    @Param("fromStationCd") String fromStationCd,
    @Param("toStationCd") String toStationCd
  );
}
