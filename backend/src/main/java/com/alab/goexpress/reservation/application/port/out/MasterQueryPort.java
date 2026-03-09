package com.alab.goexpress.reservation.application.port.out;

import com.alab.goexpress.reservation.application.port.out.model.DepartureStationInfo;
import java.time.LocalDate;
import java.time.LocalTime;

public interface MasterQueryPort {
  String getTrainTypeCd(String trainCd);
  DepartureStationInfo getDepartureInfo(String trainCd, String stationCd);
  LocalTime getArrivalTime(String trainCd, String stationCd);
  int getCharge(String depSt, String arrSt, String trainTypeCd, String seatTypeCd);
  Long sumMaxSeatNumber(String trainCd, String seatTypeCd);
  long countReservedSeatsBySeatType(String trainCd, LocalDate date, String seatTypeCd);
}
