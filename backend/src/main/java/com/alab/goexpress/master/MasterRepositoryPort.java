package com.alab.goexpress.master;

import java.time.LocalTime;


public interface MasterRepositoryPort {
  record DepartureInfo(LocalTime departureTime, String trackNumber) {};

  String getTrainTypeCd(String trainCd);

  DepartureInfo getDepartureInfo(String trainCd, String stationCd);

  LocalTime getArrivalTime(String trainCd, String stationCd);

  int getCharge(String depSt, String arrSt, String trainTypeCd, String seatTypeCd);
}
