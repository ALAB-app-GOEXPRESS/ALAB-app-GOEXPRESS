package com.alab.goexpress.reservation.adapter.out;

import com.alab.goexpress.master.DepartureInfo;
import com.alab.goexpress.master.MasterRepositoryPort;
import com.alab.goexpress.reservation.application.port.out.MasterQueryPort;
import com.alab.goexpress.reservation.application.port.out.model.DepartureStationInfo;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ReservationMasterQueryAdapter implements MasterQueryPort {

  private final MasterRepositoryPort masterRepo;

  @Override
  public String getTrainTypeCd(String trainCd) {
    return masterRepo.getTrainTypeCd(trainCd);
  }

  @Override
  public DepartureStationInfo getDepartureInfo(String trainCd, String stationCd) {
    DepartureInfo info = masterRepo.getDepartureInfo(trainCd, stationCd);
    return new DepartureStationInfo(info.departureTime(), info.trackNumber());
  }

  @Override
  public LocalTime getArrivalTime(String trainCd, String stationCd) {
    return masterRepo.getArrivalTime(trainCd, stationCd);
  }

  @Override
  public int getCharge(String depSt, String arrSt, String trainTypeCd, String seatTypeCd) {
    return masterRepo.getCharge(depSt, arrSt, trainTypeCd, seatTypeCd);
  }

  @Override
  public Long sumMaxSeatNumber(String trainCd, String seatTypeCd) {
    return masterRepo.sumMaxSeatNumber(trainCd, seatTypeCd);
  }

  @Override
  public long countReservedSeatsBySeatType(String trainCd, LocalDate date, String seatTypeCd) {
    return masterRepo.countReservedSeatsBySeatType(trainCd, date, seatTypeCd);
  }
}
