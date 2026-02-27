package com.alab.goexpress.traindetail;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.master.SeatTypeInfoDTO;
import com.alab.goexpress.master.TrainInfoDTO;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TrainDetailMapper {
  TrainInfoDTO findTrainInfo(@Param("trainCd") String trainCd);

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
