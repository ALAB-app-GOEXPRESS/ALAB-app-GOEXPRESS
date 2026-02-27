package com.alab.goexpress.master;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface MasterRepositoryPort {
  String getTrainTypeCd(String trainCd);

  DepartureInfo getDepartureInfo(String trainCd, String stationCd);

  LocalTime getArrivalTime(String trainCd, String stationCd);

  int getCharge(String depSt, String arrSt, String trainTypeCd, String seatTypeCd);

  TrainInfoDTO getTrainInfo(String trainCd);

  Long sumMaxSeatNumber(String trainCd, String seatTypeCd);

  long countReservedSeatsBySeatType(String trainCd, LocalDate date, String seatTypeCd);
}
