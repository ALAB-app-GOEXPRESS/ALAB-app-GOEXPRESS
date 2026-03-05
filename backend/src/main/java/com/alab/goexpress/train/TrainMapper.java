package com.alab.goexpress.train;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.model.dto.SeatTypeInfoDTO;
import com.alab.goexpress.model.dto.TrainInfoDTO;
import com.alab.goexpress.train.dto.TrainDto;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TrainMapper {
  List<TrainDto> selectTrainList(
    @Param("fromStationCd") String fromStationCd,
    @Param("toStationCd") String toStationCd
  );

  TrainDto selectTrain(
    @Param("fromStationCd") String fromStationCd,
    @Param("toStationCd") String toStationCd,
    @Param("trainCd") String trainCd
  );

  List<TrainInfoDTO> findTrainInfo(@Param("trainCd") String trainCd);

  DepartureInfo findDepartureInfo(@Param("trainCd") String trainCd, @Param("stationCd") String stationCd);

  LocalTime findArrivalTime(@Param("trainCd") String trainCd, @Param("stationCd") String stationCd);

  String findTrainTypeCd(@Param("trainCd") String trainCd);

  Integer findCharge(
    @Param("depSt") String depSt,
    @Param("arrSt") String arrSt,
    @Param("trainTypeCd") String trainTypeCd,
    @Param("seatTypeCd") String seatTypeCd
  );

  List<SeatTypeInfoDTO> findSeatTypesForTrain(@Param("trainCd") String trainCd);

  Long sumMaxSeatNumber(@Param("trainCd") String trainCd, @Param("seatTypeCd") String seatTypeCd);

  long countReservedSeatsBySeatType(
    @Param("trainCd") String trainCd,
    @Param("date") LocalDate date,
    @Param("seatTypeCd") String seatTypeCd
  );
}
